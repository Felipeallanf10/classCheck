/**
 * Script de teste para o backend de gamificação
 * Testa XP, níveis, streaks e conquistas
 */

const BASE_URL = 'http://localhost:3000/api/gamificacao';

// Cores para output no console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testarEndpoint(nome, url, options = {}) {
  try {
    log(`\n🧪 Testando: ${nome}`, 'blue');
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (!response.ok) {
      log(`❌ FALHOU (${response.status}): ${JSON.stringify(data, null, 2)}`, 'red');
      return { sucesso: false, data };
    }
    
    log(`✅ PASSOU: ${JSON.stringify(data, null, 2)}`, 'green');
    return { sucesso: true, data };
  } catch (error) {
    log(`❌ ERRO: ${error.message}`, 'red');
    return { sucesso: false, error: error.message };
  }
}

async function executarTestes() {
  log('\n=== INICIANDO TESTES DE GAMIFICAÇÃO ===\n', 'yellow');
  
  // ID de usuário para teste (ajuste conforme necessário)
  const usuarioId = 1;
  
  const resultados = {
    total: 0,
    passou: 0,
    falhou: 0,
  };

  // 1. Testar criação/obtenção de perfil
  const teste1 = await testarEndpoint(
    'GET /perfil - Buscar perfil do usuário',
    `${BASE_URL}/perfil?usuarioId=${usuarioId}`
  );
  resultados.total++;
  if (teste1.sucesso) resultados.passou++;
  else resultados.falhou++;

  // 2. Testar adição de XP (primeira vez - deve ganhar PRIMEIRO_XP)
  const teste2 = await testarEndpoint(
    'POST /xp - Adicionar XP (primeira avaliação)',
    `${BASE_URL}/xp`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuarioId,
        acao: 'AVALIAR_AULA',
        aulaId: 1,
        descricao: 'Teste de avaliação #1',
      }),
    }
  );
  resultados.total++;
  if (teste2.sucesso) resultados.passou++;
  else resultados.falhou++;

  // 3. Verificar conquistas após primeiro XP
  const teste3 = await testarEndpoint(
    'GET /conquistas - Verificar conquistas desbloqueadas',
    `${BASE_URL}/conquistas?usuarioId=${usuarioId}`
  );
  resultados.total++;
  if (teste3.sucesso) {
    resultados.passou++;
    if (teste3.data.length > 0) {
      log(`   📌 Conquistas desbloqueadas: ${teste3.data.length}`, 'blue');
      teste3.data.forEach(c => {
        log(`      - ${c.conquista.nome} (${c.conquista.tipo})`, 'blue');
      });
    }
  } else {
    resultados.falhou++;
  }

  // 4. Testar histórico de XP
  const teste4 = await testarEndpoint(
    'GET /historico - Buscar histórico de XP',
    `${BASE_URL}/historico?usuarioId=${usuarioId}`
  );
  resultados.total++;
  if (teste4.sucesso) resultados.passou++;
  else resultados.falhou++;

  // 5. Adicionar mais XP (mesma ação)
  const teste5 = await testarEndpoint(
    'POST /xp - Adicionar mais XP (segunda avaliação)',
    `${BASE_URL}/xp`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuarioId,
        acao: 'AVALIAR_AULA',
        aulaId: 2,
        descricao: 'Teste de avaliação #2',
      }),
    }
  );
  resultados.total++;
  if (teste5.sucesso) resultados.passou++;
  else resultados.falhou++;

  // 6. Testar ranking
  const teste6 = await testarEndpoint(
    'GET /ranking - Buscar ranking de usuários',
    `${BASE_URL}/ranking?periodo=SEMANAL&limite=10`
  );
  resultados.total++;
  if (teste6.sucesso) {
    resultados.passou++;
    if (teste6.data.ranking && teste6.data.ranking.length > 0) {
      log(`   📊 Top ${teste6.data.ranking.length} usuários no ranking:`, 'blue');
      teste6.data.ranking.slice(0, 5).forEach((u, idx) => {
        log(`      ${idx + 1}. ${u.usuario?.nome || 'N/A'} - ${u.xpPeriodo} XP`, 'blue');
      });
    }
  } else {
    resultados.falhou++;
  }

  // 7. Testar recalcular ranking
  const teste7 = await testarEndpoint(
    'POST /ranking/recalcular - Recalcular ranking',
    `${BASE_URL}/ranking/recalcular`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ periodo: 'SEMANAL' }),
    }
  );
  resultados.total++;
  if (teste7.sucesso) resultados.passou++;
  else resultados.falhou++;

  // 8. Testar progresso de conquistas
  const teste8 = await testarEndpoint(
    'GET /conquistas/progresso - Buscar progresso das conquistas',
    `${BASE_URL}/conquistas/progresso?usuarioId=${usuarioId}`
  );
  resultados.total++;
  if (teste8.sucesso) {
    resultados.passou++;
    if (teste8.data.length > 0) {
      log(`   🎯 Conquistas em progresso:`, 'blue');
      teste8.data.slice(0, 5).forEach(c => {
        const status = c.desbloqueada ? '✓' : `${c.progresso}%`;
        log(`      ${status} ${c.nome} - ${c.descricao}`, 'blue');
      });
    }
  } else {
    resultados.falhou++;
  }

  // 9. Testar perfil atualizado
  const teste9 = await testarEndpoint(
    'GET /perfil - Verificar perfil atualizado',
    `${BASE_URL}/perfil?usuarioId=${usuarioId}`
  );
  resultados.total++;
  if (teste9.sucesso) {
    resultados.passou++;
    const perfil = teste9.data;
    log(`   📈 Estatísticas do perfil:`, 'blue');
    log(`      XP Total: ${perfil.xpTotal}`, 'blue');
    log(`      Nível: ${perfil.nivel}`, 'blue');
    log(`      Streak Atual: ${perfil.streakAtual} dias`, 'blue');
    log(`      Total Avaliações: ${perfil.totalAvaliacoes}`, 'blue');
    log(`      Avaliações Consecutivas: ${perfil.avaliacoesConsecutivas}`, 'blue');
  } else {
    resultados.falhou++;
  }

  // 10. Testar todas as conquistas disponíveis
  const teste10 = await testarEndpoint(
    'GET /conquistas/todas - Listar todas conquistas',
    `${BASE_URL}/conquistas/todas`
  );
  resultados.total++;
  if (teste10.sucesso) {
    resultados.passou++;
    log(`   📜 Total de conquistas disponíveis: ${teste10.data.length}`, 'blue');
  } else {
    resultados.falhou++;
  }

  // Resumo
  log('\n=== RESUMO DOS TESTES ===\n', 'yellow');
  log(`Total de testes: ${resultados.total}`, 'blue');
  log(`✅ Passou: ${resultados.passou}`, 'green');
  log(`❌ Falhou: ${resultados.falhou}`, 'red');
  
  const taxa = ((resultados.passou / resultados.total) * 100).toFixed(1);
  log(`\n📊 Taxa de sucesso: ${taxa}%\n`, taxa >= 80 ? 'green' : 'red');

  if (resultados.falhou === 0) {
    log('🎉 TODOS OS TESTES PASSARAM! 🎉\n', 'green');
  } else {
    log(`⚠️  ${resultados.falhou} teste(s) falharam. Verifique os erros acima.\n`, 'red');
  }
}

// Executar testes
log('🚀 Verificando se o servidor está rodando...', 'yellow');
fetch('http://localhost:3000/api/gamificacao/conquistas/todas')
  .then(() => {
    log('✅ Servidor detectado! Iniciando testes...\n', 'green');
    executarTestes();
  })
  .catch(() => {
    log('❌ ERRO: Servidor não está rodando em http://localhost:3000', 'red');
    log('   Execute "npm run dev" antes de executar os testes.\n', 'yellow');
    process.exit(1);
  });
