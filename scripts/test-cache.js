/**
 * Script de teste para validar funcionamento do cache Redis/Memory
 * 
 * Uso: node scripts/test-cache.js
 */

const chalk = require('chalk');

async function testarCache() {
  console.log(chalk.blue('\n🧪 Teste de Cache - ClassCheck\n'));

  const baseUrl = 'http://localhost:3000';
  
  // Teste 1: API de relatórios geral
  console.log(chalk.yellow('📊 Testando /api/relatorios (geral)...\n'));
  
  // Primeira chamada (MISS)
  console.log(chalk.gray('1️⃣  Primeira chamada (esperado: MISS)'));
  const inicio1 = Date.now();
  const res1 = await fetch(`${baseUrl}/api/relatorios?tipo=geral`);
  const tempo1 = Date.now() - inicio1;
  const data1 = await res1.json();
  
  console.log(`   ⏱️  Tempo: ${chalk.cyan(tempo1 + 'ms')}`);
  console.log(`   📦 Dados: ${chalk.green('✓')} ${data1.resumo?.totalUsuarios || 0} usuários`);
  
  // Segunda chamada (HIT)
  console.log(chalk.gray('\n2️⃣  Segunda chamada (esperado: HIT - mais rápido)'));
  const inicio2 = Date.now();
  const res2 = await fetch(`${baseUrl}/api/relatorios?tipo=geral`);
  const tempo2 = Date.now() - inicio2;
  const data2 = await res2.json();
  
  console.log(`   ⏱️  Tempo: ${chalk.cyan(tempo2 + 'ms')}`);
  console.log(`   📦 Dados: ${chalk.green('✓')} ${data2.resumo?.totalUsuários || 0} usuários`);
  
  // Análise
  const diferenca = tempo1 - tempo2;
  const percentual = Math.round((diferenca / tempo1) * 100);
  
  console.log(chalk.yellow('\n📈 Análise de Performance:\n'));
  console.log(`   Primeira chamada: ${tempo1}ms`);
  console.log(`   Segunda chamada:  ${tempo2}ms`);
  
  if (tempo2 < tempo1) {
    console.log(chalk.green(`   ✅ Cache FUNCIONANDO! ${percentual}% mais rápido (${diferenca}ms)`));
  } else {
    console.log(chalk.red(`   ❌ Cache NÃO parece estar funcionando`));
  }
  
  // Teste 2: API Admin de estatísticas do cache
  console.log(chalk.yellow('\n\n🔧 Testando /api/admin/cache (estatísticas)...\n'));
  
  try {
    const resCache = await fetch(`${baseUrl}/api/admin/cache`, {
      headers: {
        'Cookie': 'next-auth.session-token=seu-token-admin' // Precisa estar autenticado como admin
      }
    });
    
    if (resCache.status === 403) {
      console.log(chalk.yellow('   ⚠️  Não autenticado como ADMIN'));
      console.log(chalk.gray('   Para testar, faça login como admin primeiro'));
    } else {
      const cacheStats = await resCache.json();
      console.log(`   📊 Tipo de cache: ${chalk.cyan(cacheStats.dados?.tipo || 'unknown')}`);
      console.log(`   🔢 Total de keys: ${chalk.cyan(cacheStats.dados?.keysTotal || 0)}`);
      console.log(`   🔗 Conectado: ${cacheStats.dados?.conectado ? chalk.green('✓') : chalk.red('✗')}`);
    }
  } catch (error) {
    console.log(chalk.red('   ❌ Erro ao testar API admin'));
  }
  
  // Instruções
  console.log(chalk.blue('\n\n📝 Como interpretar os resultados:\n'));
  console.log('   1. Se o cache está funcionando:');
  console.log('      - Segunda chamada deve ser 40-80% mais rápida');
  console.log('      - Console do servidor deve mostrar "[Cache] HIT"');
  console.log('');
  console.log('   2. Verifique os logs no terminal do servidor:');
  console.log('      - [Cache] MISS: primeira vez buscando');
  console.log('      - [Cache] HIT (Redis): cache Redis funcionando');
  console.log('      - [Cache] HIT (Memory): cache em memória funcionando');
  console.log('');
  console.log('   3. Para limpar o cache (como admin):');
  console.log(chalk.gray('      DELETE http://localhost:3000/api/admin/cache'));
  console.log('');
}

// Executar teste
testarCache().catch((error) => {
  console.error(chalk.red('\n❌ Erro ao executar teste:'), error.message);
  process.exit(1);
});
