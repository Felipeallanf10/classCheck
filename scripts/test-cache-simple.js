/**
 * Script SIMPLES para testar cache
 * Uso: node scripts/test-cache-simple.js
 */

async function testarCache() {
  console.log('\n🧪 Teste de Cache - ClassCheck\n');

  const url = 'http://localhost:3000/api/relatorios?tipo=geral';
  
  console.log('⏳ Aguardando servidor compilar (primeira vez pode demorar)...\n');
  
  try {
    // Primeira chamada (pode demorar devido à compilação)
    console.log('1️⃣  Primeira chamada (MISS esperado)...');
    const inicio1 = Date.now();
    await fetch(url, { 
      signal: AbortSignal.timeout(30000) // 30 segundos de timeout
    });
    const tempo1 = Date.now() - inicio1;
    console.log(`   Tempo: ${tempo1}ms\n`);
    
    // Aguardar 1 segundo
    console.log('⏳ Aguardando 1 segundo...\n');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Segunda chamada
    console.log('2️⃣  Segunda chamada (HIT esperado)...');
    const inicio2 = Date.now();
    const res2 = await fetch(url, {
      signal: AbortSignal.timeout(30000)
    });
    const tempo2 = Date.now() - inicio2;
    
    // Verificar se resposta é válida
    if (res2.ok) {
      console.log(`   Tempo: ${tempo2}ms\n`);
    } else {
      console.log(`   Tempo: ${tempo2}ms (erro ${res2.status})\n`);
    }
    
    // Resultado
    console.log('📊 Resultado:');
    console.log(`   Primeira: ${tempo1}ms`);
    console.log(`   Segunda:  ${tempo2}ms`);
    console.log(`   Diferença: ${tempo1 - tempo2}ms (${Math.round((1 - tempo2/tempo1) * 100)}% mais rápido)\n`);
    
    if (tempo2 < tempo1 * 0.5) {
      console.log('✅ Cache FUNCIONANDO! Segunda chamada >50% mais rápida\n');
    } else if (tempo2 < tempo1) {
      console.log('⚠️  Cache provavelmente funcionando (segunda mais rápida)\n');
    } else {
      console.log('❌ Cache NÃO funcionando (tempos similares)\n');
    }
    
    console.log('💡 Dica: Verifique os logs do servidor:');
    console.log('   - Deve aparecer "[Cache] MISS" na primeira');
    console.log('   - Deve aparecer "[Cache] HIT" na segunda\n');
  } catch (error) {
    console.error('\n❌ Erro ao executar teste:');
    console.error('   ', error.message);
    console.error('\n💡 Verifique se o servidor está rodando: npm run dev\n');
  }
}

testarCache();
