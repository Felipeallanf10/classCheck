import { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

// Configuração do NextAuth com Google OAuth e cookies seguros para produção
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        senha: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.senha) {
          throw new Error('Email e senha são obrigatórios');
        }

        // Buscar usuário no banco
        const usuario = await prisma.usuario.findUnique({
          where: { email: credentials.email },
        });

        if (!usuario) {
          throw new Error('Credenciais inválidas');
        }

        if (!usuario.ativo) {
          throw new Error('Usuário inativo. Entre em contato com o administrador.');
        }

        // Verificar senha
        const senhaValida = await bcrypt.compare(credentials.senha, usuario.senha);

        if (!senhaValida) {
          throw new Error('Credenciais inválidas');
        }

        // Retornar dados do usuário
        return {
          id: usuario.id.toString(),
          email: usuario.email,
          name: usuario.nome,
          role: usuario.role,
          image: usuario.avatar,
          materia: usuario.materia,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Para login com Google
      if (account?.provider === 'google') {
        try {
          // Verificar se usuário já existe
          const existingUser = await prisma.usuario.findUnique({
            where: { email: user.email! }
          });
          
          if (!existingUser) {
            // Criar novo usuário com role ALUNO (padrão)
            await prisma.usuario.create({
              data: {
                email: user.email!,
                nome: user.name || '',
                senha: '', // Usuários Google não precisam de senha
                role: 'ALUNO', // Role padrão para novos usuários
                ativo: true,
                avatar: user.image,
              }
            });
          }
          
          return true;
        } catch (error) {
          console.error('Erro ao criar usuário com Google:', error);
          return false;
        }
      }
      
      return true;
    },
    async jwt({ token, user }) {
      // Adicionar informações extras ao token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.materia = user.materia;
      } else if (token.email) {
        // Buscar dados atualizados do usuário (para pegar mudanças de role)
        const dbUser = await prisma.usuario.findUnique({
          where: { email: token.email }
        });
        
        if (dbUser) {
          token.id = dbUser.id.toString();
          token.role = dbUser.role;
          token.materia = dbUser.materia;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Adicionar informações extras à sessão
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.materia = token.materia as string | null;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? 
        `__Secure-next-auth.session-token` : 
        `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      }
    },
    callbackUrl: {
      name: process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.callback-url'
        : 'next-auth.callback-url',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name: process.env.NODE_ENV === 'production'
        ? '__Host-next-auth.csrf-token'
        : 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies: process.env.NODE_ENV === 'production',
};

/**
 * Tipo do usuário autenticado
 */
export interface AuthenticatedUser {
  id: number;
  email: string;
  nome: string;
  role: 'ALUNO' | 'PROFESSOR' | 'ADMIN';
  avatar?: string | null;
}

/**
 * Busca o usuário autenticado da sessão
 * @returns Usuário autenticado ou null
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return null;
    }

    // Converter session.user para AuthenticatedUser
    return {
      id: parseInt(session.user.id || '0'),
      email: session.user.email || '',
      nome: session.user.name || '',
      role: (session.user.role as 'ALUNO' | 'PROFESSOR' | 'ADMIN') || 'ALUNO',
      avatar: session.user.image
    };
  } catch (error) {
    console.error('Erro ao buscar usuário autenticado:', error);
    return null;
  }
}

/**
 * Verifica se há um usuário autenticado
 * Lança erro 401 se não autenticado
 * @returns Usuário autenticado
 */
export async function requireAuth(): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  
  return user;
}

/**
 * Verifica se o usuário tem uma role específica
 * @param user Usuário autenticado
 * @param roles Roles permitidas
 * @returns true se o usuário tem uma das roles
 */
export function hasRole(
  user: AuthenticatedUser,
  roles: ('ALUNO' | 'PROFESSOR' | 'ADMIN')[]
): boolean {
  return roles.includes(user.role);
}

/**
 * Verifica se o usuário tem permissão de admin
 * @param user Usuário autenticado
 * @returns true se for admin
 */
export function isAdmin(user: AuthenticatedUser): boolean {
  return user.role === 'ADMIN';
}

/**
 * Verifica se o usuário tem permissão de professor
 * @param user Usuário autenticado
 * @returns true se for professor ou admin
 */
export function isProfessor(user: AuthenticatedUser): boolean {
  return user.role === 'PROFESSOR' || user.role === 'ADMIN';
}

/**
 * Verifica se o usuário é dono do recurso
 * @param user Usuário autenticado
 * @param resourceUserId ID do usuário dono do recurso
 * @returns true se for dono ou admin
 */
export function isOwnerOrAdmin(
  user: AuthenticatedUser,
  resourceUserId: number
): boolean {
  return user.id === resourceUserId || user.role === 'ADMIN';
}

/**
 * Helper para lidar com erros de autenticação em API routes
 */
export function handleAuthError(error: unknown) {
  if (error instanceof Error) {
    if (error.message === 'UNAUTHORIZED') {
      return {
        error: 'Não autenticado. Faça login para acessar este recurso.',
        status: 401
      };
    }
    
    if (error.message === 'FORBIDDEN') {
      return {
        error: 'Você não tem permissão para acessar este recurso.',
        status: 403
      };
    }
  }
  
  return {
    error: 'Erro interno do servidor',
    status: 500
  };
}

/**
 * Wrapper para proteger API routes
 * Uso: await withAuth(async (user) => { ... })
 */
export async function withAuth<T>(
  handler: (user: AuthenticatedUser) => Promise<T>
): Promise<T> {
  const user = await requireAuth();
  return handler(user);
}

/**
 * Wrapper para proteger API routes com verificação de role
 * Uso: await withRoles(['ADMIN'], async (user) => { ... })
 */
export async function withRoles<T>(
  roles: ('ALUNO' | 'PROFESSOR' | 'ADMIN')[],
  handler: (user: AuthenticatedUser) => Promise<T>
): Promise<T> {
  const user = await requireAuth();
  
  if (!hasRole(user, roles)) {
    throw new Error('FORBIDDEN');
  }
  
  return handler(user);
}
