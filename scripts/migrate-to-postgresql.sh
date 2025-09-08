#!/bin/bash

# ==============================================
# SCRIPT DE MIGRAÇÃO MYSQL → POSTGRESQL
# ClassCheck Migration Script
# ==============================================

echo "🔄 Iniciando migração MySQL → PostgreSQL..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para print colorido
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 1. Parar containers existentes
echo "1. Parando containers MySQL existentes..."
docker-compose down -v
print_status "Containers parados"

# 2. Limpar dados antigos (opcional)
read -p "Deseja remover volumes do MySQL? (y/N): " remove_volumes
if [[ $remove_volumes =~ ^[Yy]$ ]]; then
    docker volume prune -f
    print_status "Volumes MySQL removidos"
fi

# 3. Gerar Prisma Client para PostgreSQL
echo "2. Gerando Prisma Client para PostgreSQL..."
npx prisma generate
print_status "Prisma Client gerado"

# 4. Subir PostgreSQL
echo "3. Subindo container PostgreSQL..."
docker-compose up db -d
print_status "PostgreSQL iniciado na porta 5433"

# 5. Aguardar PostgreSQL estar pronto
echo "4. Aguardando PostgreSQL ficar pronto..."
sleep 15

# 6. Executar migrações
echo "5. Executando migrações do Prisma..."
npx prisma migrate dev --name "init_postgresql"
print_status "Migrações executadas"

# 7. (Opcional) Popular banco com dados de teste
read -p "Deseja executar seed do banco? (y/N): " run_seed
if [[ $run_seed =~ ^[Yy]$ ]]; then
    npx prisma db seed
    print_status "Dados de teste inseridos"
fi

# 8. Subir aplicação
echo "6. Subindo aplicação completa..."
docker-compose up -d
print_status "Aplicação rodando em http://localhost:3000"

echo ""
echo "🎉 Migração concluída com sucesso!"
echo ""
echo "📋 Informações importantes:"
echo "   • PostgreSQL: localhost:5433"
echo "   • Database: classcheck_db"
echo "   • User: classcheck_user"
echo "   • Password: classcheck_password"
echo ""
echo "🔧 Para conectar no DBeaver:"
echo "   • Veja o arquivo docs/DBEAVER_SETUP.md"
echo ""
echo "📊 Comandos úteis:"
echo "   • docker-compose logs -f db     # Logs do PostgreSQL"
echo "   • npx prisma studio            # Interface visual do banco"
echo "   • docker-compose exec db psql -U classcheck_user -d classcheck_db"
