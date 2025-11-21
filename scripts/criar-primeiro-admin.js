// Script para criar o primeiro usuário ADMIN
// Uso: node scripts/criar-primeiro-admin.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('\n🔐 CRIAR PRIMEIRO ADMINISTRADOR\n');
  console.log('Este script cria um usuário ADMIN no banco de dados.\n');

  try {
    // Perguntar dados
    const nome = await question('Nome completo: ');
    const email = await question('Email: ');
    const senha = await question('Senha (mínimo 6 caracteres): ');

    // Validações básicas
    if (!nome || nome.length < 3) {
      console.error('❌ Nome deve ter pelo menos 3 caracteres');
      process.exit(1);
    }

    if (!email || !email.includes('@')) {
      console.error('❌ Email inválido');
      process.exit(1);
    }

    if (!senha || senha.length < 6) {
      console.error('❌ Senha deve ter pelo menos 6 caracteres');
      process.exit(1);
    }

    // Verificar se email já existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('\n⚠️  Email já existe no banco!');
      const promover = await question('Deseja promover este usuário para ADMIN? (s/n): ');
      
      if (promover.toLowerCase() === 's') {
        await prisma.usuario.update({
          where: { email },
          data: { role: 'ADMIN' }
        });
        console.log('✅ Usuário promovido para ADMIN com sucesso!');
      } else {
        console.log('❌ Operação cancelada');
      }
      
      rl.close();
      await prisma.$disconnect();
      process.exit(0);
    }

    // Hash da senha
    console.log('\n🔄 Criando usuário...');
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Criar usuário ADMIN
    const admin = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
        role: 'ADMIN',
        ativo: true,
      }
    });

    console.log('\n✅ ADMIN criado com sucesso!');
    console.log('\n📋 Dados do administrador:');
    console.log(`   ID: ${admin.id}`);
    console.log(`   Nome: ${admin.nome}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log('\n🎉 Você já pode fazer login no sistema!\n');

  } catch (error) {
    console.error('\n❌ Erro ao criar administrador:', error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

main();
