/**
 * Script para testar e validar o cálculo de métricas do Dashboard Professor
 * 
 * Uso: node scripts/test-metricas-dashboard.js <turmaId> <periodo>
 * 
 * Exemplo: node scripts/test-metricas-dashboard.js 1 mes
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testarMetricas(turmaId, periodo = 'mes') {
  console.log('\n🧪 Teste de Métricas - Dashboard Professor\n');
  console.log(`Turma ID: ${turmaId}`);
  console.log(`Período: ${periodo}\n`);

  try {
    // 1. Buscar turma
    const turma = await prisma.turma.findUnique({
      where: { id: turmaId },
      select: { 
        id: true, 
        nome: true, 
        codigo: true,
        ano: true,
        periodo: true,
        professores: {
          select: {
            materia: true,
          },
        },
      },
    });

    if (!turma) {
      console.error('❌ Turma não encontrada');
      return;
    }

    const materias = turma.professores.map((p) => p.materia).join(', ') || 'Nenhuma matéria';
    console.log(`✅ Turma encontrada: ${turma.nome} (${turma.codigo}) - ${materias}\n`);

    // 2. Calcular período
    const agora = new Date();
    let dataInicio;
    
    switch (periodo) {
      case 'semana':
        dataInicio = new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'mes':
        dataInicio = new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '3meses':
        dataInicio = new Date(agora.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'semestre':
        dataInicio = new Date(agora.getTime() - 180 * 24 * 60 * 60 * 1000);
        break;
      default:
        dataInicio = new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    console.log(`📅 Período: ${dataInicio.toLocaleDateString('pt-BR')} até ${agora.toLocaleDateString('pt-BR')}\n`);

    // 3. Buscar alunos da turma
    const turmaAlunos = await prisma.turmaAluno.findMany({
      where: { turmaId },
      select: { alunoId: true },
    });

    if (turmaAlunos.length === 0) {
      console.error('❌ Nenhum aluno encontrado na turma');
      return;
    }

    const alunoIds = turmaAlunos.map((ta) => ta.alunoId);
    console.log(`👥 Total de alunos na turma: ${alunoIds.length}\n`);

    // 4. Buscar dados dos alunos
    const alunos = await prisma.usuario.findMany({
      where: { id: { in: alunoIds } },
      select: {
        id: true,
        nome: true,
        email: true,
        sessoesAdaptativas: {
          where: {
            status: 'FINALIZADA',
            iniciadoEm: { gte: dataInicio },
          },
          orderBy: { iniciadoEm: 'asc' },
          select: {
            id: true,
            thetaEstimado: true,
            confianca: true,
            iniciadoEm: true,
          },
        },
        alertasSocioemocionais: {
          where: {
            status: { in: ['PENDENTE', 'EM_ANALISE'] },
            criadoEm: { gte: dataInicio },
          },
          select: {
            id: true,
            nivel: true,
            tipo: true,
          },
        },
      },
    });

    console.log('📊 Calculando métricas individuais...\n');

    const metricas = alunos.map((aluno) => {
      const sessoes = aluno.sessoesAdaptativas;
      const alertas = aluno.alertasSocioemocionais;
      
      // Theta médio
      const thetaMedio = sessoes.length > 0
        ? sessoes.reduce((sum, s) => sum + (s.thetaEstimado || 0), 0) / sessoes.length
        : 0;
      
      // Confiança média
      const confiancaMedia = sessoes.length > 0
        ? sessoes.reduce((sum, s) => sum + (s.confianca || 0), 0) / sessoes.length
        : 0;
      
      // Calcular tendência
      let tendencia = 'ESTAVEL';
      if (sessoes.length >= 2) {
        const primeiroTheta = sessoes[0].thetaEstimado || 0;
        const ultimoTheta = sessoes[sessoes.length - 1].thetaEstimado || 0;
        const variacao = ultimoTheta - primeiroTheta;
        
        if (variacao > 0.3) tendencia = 'CRESCENTE';
        else if (variacao < -0.3) tendencia = 'DECRESCENTE';
      }
      
      // Calcular nível de risco
      let nivelRisco = 'BAIXO';
      const alertasVermelhos = alertas.filter((a) => a.nivel === 'VERMELHO').length;
      const alertasLaranjas = alertas.filter((a) => a.nivel === 'LARANJA').length;
      
      if (alertasVermelhos > 0 || thetaMedio < -2) {
        nivelRisco = 'CRITICO';
      } else if (alertasLaranjas > 1 || thetaMedio < -1) {
        nivelRisco = 'ALTO';
      } else if (alertasLaranjas > 0 || thetaMedio < 0) {
        nivelRisco = 'MEDIO';
      }

      console.log(`  📌 ${aluno.nome}`);
      console.log(`     - Sessões: ${sessoes.length}`);
      console.log(`     - Theta médio: ${thetaMedio.toFixed(3)}`);
      console.log(`     - Confiança: ${(confiancaMedia * 100).toFixed(1)}%`);
      console.log(`     - Tendência: ${tendencia}`);
      console.log(`     - Alertas: ${alertas.length} (🔴 ${alertasVermelhos} | 🟠 ${alertasLaranjas})`);
      console.log(`     - Risco: ${nivelRisco}`);
      console.log(`     - Última sessão: ${sessoes.length > 0 ? sessoes[sessoes.length - 1].iniciadoEm.toLocaleString('pt-BR') : 'Nenhuma'}\n`);
      
      return {
        aluno: {
          id: aluno.id,
          nome: aluno.nome,
          email: aluno.email,
        },
        thetaMedio: Number(thetaMedio.toFixed(3)),
        confiancaMedia: Number(confiancaMedia.toFixed(3)),
        tendencia,
        totalSessoes: sessoes.length,
        alertasAbertos: alertas.length,
        alertasVermelhos,
        alertasLaranjas,
        nivelRisco,
        ultimaSessao: sessoes.length > 0 ? sessoes[sessoes.length - 1].iniciadoEm : null,
      };
    });

    // 5. Métricas gerais
    console.log('📈 Métricas Gerais da Turma:\n');
    
    const metricsGerais = {
      totalAlunos: alunos.length,
      alunosCriticos: metricas.filter((m) => m.nivelRisco === 'CRITICO').length,
      alunosAltoRisco: metricas.filter((m) => m.nivelRisco === 'ALTO').length,
      alunosMedioRisco: metricas.filter((m) => m.nivelRisco === 'MEDIO').length,
      alunosBaixoRisco: metricas.filter((m) => m.nivelRisco === 'BAIXO').length,
      thetaMedioTurma: metricas.length > 0
        ? Number((metricas.reduce((sum, m) => sum + m.thetaMedio, 0) / metricas.length).toFixed(3))
        : 0,
      totalAlertasAbertos: metricas.reduce((sum, m) => sum + m.alertasAbertos, 0),
      totalSessoesRealizadas: metricas.reduce((sum, m) => sum + m.totalSessoes, 0),
    };

    console.log(`  👥 Total de alunos: ${metricsGerais.totalAlunos}`);
    console.log(`  🔴 Críticos: ${metricsGerais.alunosCriticos}`);
    console.log(`  🟠 Alto risco: ${metricsGerais.alunosAltoRisco}`);
    console.log(`  🟡 Médio risco: ${metricsGerais.alunosMedioRisco}`);
    console.log(`  🟢 Baixo risco: ${metricsGerais.alunosBaixoRisco}`);
    console.log(`  📊 Theta médio da turma: ${metricsGerais.thetaMedioTurma}`);
    console.log(`  ⚠️  Total de alertas abertos: ${metricsGerais.totalAlertasAbertos}`);
    console.log(`  📝 Total de sessões realizadas: ${metricsGerais.totalSessoesRealizadas}`);
    console.log(`  📈 Média de sessões por aluno: ${(metricsGerais.totalSessoesRealizadas / metricsGerais.totalAlunos).toFixed(1)}\n`);

    // 6. Alunos por risco
    console.log('🎯 Distribuição por Nível de Risco:\n');
    const metricasOrdenadas = metricas.sort((a, b) => {
      const ordem = { CRITICO: 0, ALTO: 1, MEDIO: 2, BAIXO: 3 };
      return ordem[a.nivelRisco] - ordem[b.nivelRisco];
    });

    metricasOrdenadas.forEach((m) => {
      const emoji = {
        CRITICO: '🔴',
        ALTO: '🟠',
        MEDIO: '🟡',
        BAIXO: '🟢',
      }[m.nivelRisco];

      console.log(`  ${emoji} ${m.aluno.nome} (θ: ${m.thetaMedio}, ${m.totalSessoes} sessões, ${m.alertasAbertos} alertas)`);
    });

    console.log('\n✅ Teste concluído com sucesso!\n');

  } catch (erro) {
    console.error('\n❌ Erro ao testar métricas:', erro);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar teste
const turmaId = parseInt(process.argv[2] || '1', 10);
const periodo = process.argv[3] || 'mes';

testarMetricas(turmaId, periodo);
