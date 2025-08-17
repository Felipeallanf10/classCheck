# 📋 Setup Detalhado - ClassCheck

Guia completo para configuração do ambiente de desenvolvimento do ClassCheck.

## 🎯 Pré-requisitos

### 1. Docker & Docker Compose

#### Windows
```bash
# Instalar Docker Desktop
# Download: https://www.docker.com/products/docker-d    esktop

# Verificar instalação
docker --version
docker-compose --version
```

#### macOS
```bash
# Via Homebrew
brew install --cask docker

# Ou Docker Desktop
# Download: https://www.docker.com/products/docker-desktop
```

#### Linux (Ubuntu/Debian)
```bash
# Instalar Docker
sudo apt update
sudo apt install docker.io docker-compose

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER
newgrp docker

# Verificar instalação
docker --version
docker-compose --version
```

### 2. Git
```bash
# Verificar se está instalado
git --version

# Se não estiver, instalar:
# Windows: https://git-scm.com/download/win
# macOS: brew install git
# Linux: sudo apt install git
```

## 🚀 Configuração Inicial

### 1. Clonar o Repositório
```bash
git clone https://github.com/Felipeallanf10/classCheck.git
cd classcheck
```

### 2. Configurar Variáveis de Ambiente
```bash
# Copiar arquivo de exemplo
cp .env.example .env.local

# Editar arquivo (opcional para desenvolvimento)
# As configurações padrão já funcionam com Docker
```

### 3. Primeira Execução
```bash
# Build das imagens e start dos containers
docker-compose up --build

# Aguarde até ver:
# ✓ Ready on http://localhost:0.0.0.0:3000
```

### 4. Configurar Prisma (quando implementado)
```bash
# Em outro terminal, executar:
docker-compose exec app npx prisma generate
docker-compose exec app npx prisma migrate dev
```

## 🐳 Estrutura Docker

### Serviços Configurados

#### 1. app (Next.js)
- **Porta**: 3000
- **Volumes**: Código fonte montado para hot reload
- **Environment**: Desenvolvimento
- **Dependências**: MySQL deve estar healthy

#### 2. db (MySQL 8.0)
- **Porta**: 3306
- **Volume**: `mysql_data` (persistente)
- **Database**: classcheck_db
- **User**: classcheck_user
- **Password**: classcheck_password

#### 3. phpmyadmin (Interface MySQL)
- **Porta**: 8080
- **Acesso**: http://localhost:8080
- **Login**: root / root_password

### Rede
- **Nome**: classcheck-network
- **Tipo**: bridge
- **Isolamento**: Containers comunicam entre si

## 📁 Mapeamento de Volumes

```yaml
volumes:
  # Código fonte (hot reload)
  - .:/app
  
  # node_modules (evita conflitos)
  - /app/node_modules
  
  # Cache Next.js
  - ./.next:/app/.next
  
  # Dados MySQL (persistente)
  mysql_data:/var/lib/mysql
```

## 🔧 Comandos de Desenvolvimento

### Gerenciamento de Containers
```bash
# Subir ambiente
docker-compose up                    # Foreground
docker-compose up -d                 # Background

# Parar ambiente
docker-compose down                  # Para containers
docker-compose down -v               # Para + remove volumes

# Restart específico
docker-compose restart app
docker-compose restart db

# Rebuild
docker-compose build --no-cache app
docker-compose up --build
```

### Logs e Debugging
```bash
# Ver logs
docker-compose logs app              # App logs
docker-compose logs db               # MySQL logs
docker-compose logs -f app           # Follow logs

# Status dos containers
docker-compose ps

# Informações detalhadas
docker-compose top
docker system df
```

### Comandos no Container
```bash
# Terminal interativo
docker-compose exec app sh
docker-compose exec app bash

# Comandos diretos
docker-compose exec app npm install
docker-compose exec app npm run lint
docker-compose exec app npm run build

# Prisma (quando configurado)
docker-compose exec app npx prisma studio
docker-compose exec app npx prisma migrate dev
docker-compose exec app npx prisma generate
```

## 🗄️ Configuração de Banco

### Acessar MySQL
```bash
# Via container
docker-compose exec db mysql -u root -p
# Password: root_password

# Via cliente MySQL local
mysql -h localhost -P 3306 -u classcheck_user -p
# Password: classcheck_password
```

### Backup e Restore
```bash
# Backup
docker-compose exec db mysqldump -u root -proot_password classcheck_db > backup.sql

# Restore
docker-compose exec -T db mysql -u root -proot_password classcheck_db < backup.sql
```

## 🔍 Troubleshooting

### Problemas Comuns

#### 1. Porta já em uso
```bash
# Verificar processo usando a porta
netstat -tulpn | grep :3000
lsof -i :3000

# Parar containers conflitantes
docker-compose down
docker stop $(docker ps -q)
```

#### 2. Volume de node_modules
```bash
# Limpar e rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

#### 3. Permissões (Linux/macOS)
```bash
# Corrigir ownership
sudo chown -R $USER:$USER .
```

#### 4. MySQL não inicia
```bash
# Ver logs específicos
docker-compose logs db

# Reset do volume MySQL
docker-compose down -v
docker volume rm classcheck_mysql_data
docker-compose up
```

#### 5. Hot reload não funciona
```bash
# Verificar mount points
docker-compose exec app ls -la /app

# Restart do container
docker-compose restart app
```

### Logs de Debug
```bash
# Habilitar debug detalhado
export DEBUG=*
docker-compose up

# Logs do Next.js
docker-compose logs -f app | grep -i error
```

## 🔄 Workflow de Desenvolvimento

### 1. Início do Dia
```bash
git pull origin main
docker-compose up -d
```

### 2. Durante Desenvolvimento
- Código é automaticamente sincronizado (hot reload)
- Logs visíveis com `docker-compose logs -f app`
- banco persiste entre restarts

### 3. Fim do Dia
```bash
docker-compose down
```

### 4. Atualizações de Dependências
```bash
# Editar package.json
docker-compose exec app npm install

# Ou rebuild completo
docker-compose down
docker-compose build --no-cache
docker-compose up
```

## 📊 Monitoramento

### Recursos do Sistema
```bash
# Ver uso de recursos
docker stats

# Espaço em disco
docker system df
docker images
docker volume ls
```

### Performance
- **App**: Logs de performance no console do Next.js
- **DB**: Logs de query slow no MySQL
- **Sistema**: htop, docker stats

## 🔒 Segurança

### Desenvolvimento Local
- Passwords padrão (OK para dev)
- Ports expostos localmente
- Sem HTTPS (OK para dev)

### Para Produção
- Alterar todas as senhas
- Usar secrets management
- Configurar HTTPS
- Limitar ports expostos
- Configurar firewall

## 🌐 URLs de Desenvolvimento

| Serviço | URL | Credenciais |
|---------|-----|-------------|
| **Aplicação** | http://localhost:3000 | - |
| **phpMyAdmin** | http://localhost:8080 | root/root_password |
| **MySQL** | localhost:3306 | classcheck_user/classcheck_password |

## 📚 Próximos Passos

1. **Configurar Prisma Schema** - Definir modelos do banco
2. **Implementar APIs** - CRUD operations  
3. **Adicionar Testes** - Jest + Testing Library
4. **CI/CD** - GitHub Actions
5. **Deploy** - Vercel/Railway/Docker Swarm
