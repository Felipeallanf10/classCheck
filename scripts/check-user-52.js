const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
  const user = await prisma.usuario.findUnique({
    where: { id: 52 }
  });
  
  if (user) {
    console.log('✅ Usuário ID 52 encontrado:');
    console.log(`   Nome: ${user.nome}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
  } else {
    console.log('❌ Usuário ID 52 não encontrado. Criando...');
    
    const newUser = await prisma.usuario.create({
      data: {
        id: 52,
        nome: 'Usuário de Teste',
        email: 'teste52@classcheck.com',
        senha: 'senha123', // Senha padrão para testes
        role: 'ALUNO',
        ativo: true
      }
    });
    
    console.log('✅ Usuário criado com sucesso!');
    console.log(`   ID: ${newUser.id}`);
    console.log(`   Nome: ${newUser.nome}`);
    console.log(`   Email: ${newUser.email}`);
  }
  
  await prisma.$disconnect();
}

checkUser().catch(console.error);
