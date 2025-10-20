/**
 * Script de teste manual para gamificação
 * Execute com: npx ts-node scripts/test-gamificacao.ts
 */

import { PrismaClient, PeriodoRanking } from '@prisma/client';

const prisma = new PrismaClient();

async function testarGamificacao() {
  console.log('\n🚀 === TESTE DE GAMIFICAÇÃO ===\n');

  try {
    // 1. Verificar conexão com banco
    console.log('1️⃣ Testando conexão com banco de dados...');
    await prisma.$connect();
    console.log('   ✅ Conectado ao banco!\n');

    // 2. Verificar se existem usuários
    console.log('2️⃣ Buscando usuários...');
  const usuarios = await prisma.usuario.findMany({ take: 5 });
    console.log(`   ✅ Encontrados ${usuarios.length} usuários`);
    if (usuarios.length > 0) {
      console.log(`   👤 Primeiro usuário: ${usuarios[0].nome} (ID: ${usuarios[0].id})\n`);
    } else {
      console.log('   ⚠️  Nenhum usuário encontrado. Crie usuários primeiro.\n');
      return;
    }

    const usuarioTeste = usuarios[0];

    // 3. Verificar perfil de gamificação
    console.log('3️⃣ Verificando perfil de gamificação...');
    let perfil = await prisma.perfilGamificacao.findUnique({
      where: { usuarioId: usuarioTeste.id },
      include: {
        conquistasDesbloqueadas: {
          include: { conquista: true },
        },
      },
    });

    if (!perfil) {
      console.log('   ℹ️  Perfil não existe, criando...');
      perfil = await prisma.perfilGamificacao.create({
        data: {
          usuarioId: usuarioTeste.id,
          xpTotal: 0,
          nivel: 1,
          streakAtual: 0,
          melhorStreak: 0,
          totalAvaliacoes: 0,
          avaliacoesConsecutivas: 0,
        },
        include: {
          conquistasDesbloqueadas: {
            include: { conquista: true },
          },
        },
      });
      console.log('   ✅ Perfil criado!\n');
    } else {
      console.log('   ✅ Perfil encontrado!');
      console.log(`      XP Total: ${perfil.xpTotal}`);
      console.log(`      Nível: ${perfil.nivel}`);
      console.log(`      Streak: ${perfil.streakAtual} dias`);
      console.log(`      Total Avaliações: ${perfil.totalAvaliacoes}`);
      console.log(`      Conquistas: ${perfil.conquistasDesbloqueadas.length}\n`);
    }

    // 4. Verificar conquistas disponíveis
    console.log('4️⃣ Verificando conquistas cadastradas...');
    const conquistas = await prisma.conquista.findMany();
    console.log(`   ✅ ${conquistas.length} conquistas disponíveis`);
    if (conquistas.length === 0) {
      console.log('   ⚠️  Nenhuma conquista cadastrada! Execute o seed do banco.\n');
    } else {
      console.log('   📜 Primeiras 5 conquistas:');
      conquistas.slice(0, 5).forEach((c, idx) => {
        console.log(`      ${idx + 1}. ${c.nome} (${c.tipo}) - ${c.xpRecompensa} XP`);
      });
      console.log('');
    }

    // 5. Verificar ranking
    console.log('5️⃣ Verificando ranking...');
    const rankingSemanal = await prisma.rankingPosicao.findMany({
      where: {
        configuracao: {
          periodoCalculo: PeriodoRanking.SEMANAL,
          ativo: true,
        },
      },
      include: {
        perfil: {
          include: {
            usuario: {
              select: { nome: true, email: true },
            },
          },
        },
      },
      orderBy: { posicao: 'asc' },
      take: 5,
    });
    console.log(`   ✅ ${rankingSemanal.length} usuários no ranking semanal`);
    if (rankingSemanal.length > 0) {
      console.log('   🏆 Top 5:');
      for (const posicao of rankingSemanal) {
        console.log(`      ${posicao.posicao}º ${posicao.perfil.usuario.nome} - ${posicao.xpPeriodo} XP`);
      }
    }
    console.log('');

    // 6. Verificar histórico de XP
    console.log('6️⃣ Verificando histórico de XP...');
    const historico = await prisma.historicoXP.findMany({
      where: { perfilId: perfil.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
    console.log(`   ✅ ${historico.length} registros no histórico`);
    if (historico.length > 0) {
      console.log('   📊 Últimas 5 ações:');
      historico.forEach((h) => {
        const data = new Date(h.createdAt).toLocaleDateString('pt-BR');
        console.log(`      ${data} - ${h.acao}: +${h.xpGanho} XP`);
      });
    }
    console.log('');

    // 7. Teste de integridade de dados
    console.log('7️⃣ Verificando integridade de dados...');
    const perfisComUsuario = await prisma.perfilGamificacao.count({
      where: { usuario: { id: { not: undefined } } },
    });
    const totalPerfis = await prisma.perfilGamificacao.count();
    console.log(`   ✅ ${perfisComUsuario}/${totalPerfis} perfis têm usuários válidos\n`);

    // 8. Resumo final
    console.log('8️⃣ === RESUMO FINAL ===');
    console.log(`   👥 Usuários: ${usuarios.length}`);
    console.log(`   🎮 Perfis de gamificação: ${totalPerfis}`);
    console.log(`   🏆 Conquistas disponíveis: ${conquistas.length}`);
    console.log(`   📊 Ranking ativo: ${rankingSemanal.length} usuários`);
    console.log(`   📜 Histórico de XP: ${historico.length} registros recentes`);
    console.log('');

    if (conquistas.length === 0) {
      console.log('⚠️  ATENÇÃO: Execute o seed para cadastrar as conquistas!');
      console.log('   Comando: npm run db:seed\n');
    } else {
      console.log('✅ Sistema de gamificação está funcionando!\n');
    }

  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Desconectado do banco.\n');
  }
}

testarGamificacao();
