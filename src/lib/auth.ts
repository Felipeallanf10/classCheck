import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

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
    async signIn({ user, account, profile }) {
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
