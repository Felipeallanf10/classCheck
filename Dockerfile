# ==============================================
# Dockerfile para Next.js + TypeScript
# Ambiente: Desenvolvimento com Hot Reload
# ==============================================

# Usar imagem oficial do Node.js 20 (LTS)
FROM node:20-alpine

# Definir diretório de trabalho dentro do contêiner
WORKDIR /app

# Instalar dependências do sistema (necessárias para algumas libs)
RUN apk add --no-cache \
    libc6-compat \
    curl

# Copiar arquivos de configuração de dependências
COPY package*.json ./
COPY tsconfig.json ./
COPY tailwind.config.js ./
COPY postcss.config.mjs ./
COPY next.config.ts ./
COPY components.json ./

# Instalar dependências (usar cache do Docker para otimizar builds)
RUN npm ci

# Copiar código fonte da aplicação
COPY . .

# Expor porta 3000 (Next.js development server)
EXPOSE 3000

# Criar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Definir permissões corretas
RUN chown -R nextjs:nodejs /app
USER nextjs

# Comando padrão: iniciar servidor de desenvolvimento com hot reload
CMD ["npm", "run", "dev"]

# ==============================================
# NOTAS:
# - Esta imagem está otimizada para DESENVOLVIMENTO
# - Hot reload funciona através de volumes montados
# - Para PRODUÇÃO, criar Dockerfile separado com build otimizado
# - node_modules será sobrescrito por volume anônimo no docker-compose
# ==============================================
