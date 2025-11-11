const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearAlerts() {
  console.log('🧹 Limpando alertas...');
  const deleted = await prisma.alertaSocioemocional.deleteMany({});
  console.log(`✅ ${deleted.count} alertas removidos`);
  await prisma.$disconnect();
}

clearAlerts().catch(console.error);
