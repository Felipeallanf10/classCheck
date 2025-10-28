/**
 * TESTE: Verificar se a API agora retorna a pergunta do banco adaptativo
 */

async function testarAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/sessoes/d005c1bd-974c-4977-80c2-90648bf72ed2');
    const data = await response.json();
    
    console.log('\n=== RESPOSTA DA API ===');
    console.log('Success:', data.success);
    console.log('Status sessão:', data.sessao?.status);
    console.log('Tem pergunta atual?', !!data.sessao?.perguntaAtual);
    
    if (data.sessao?.perguntaAtual) {
      console.log('\n✅ PERGUNTA ENCONTRADA!');
      console.log('ID:', data.sessao.perguntaAtual.id);
      console.log('Texto:', data.sessao.perguntaAtual.texto);
      console.log('Categoria:', data.sessao.perguntaAtual.categoria);
      console.log('Tipo:', data.sessao.perguntaAtual.tipoPergunta);
      console.log('Valor mín:', data.sessao.perguntaAtual.valorMinimo);
      console.log('Valor máx:', data.sessao.perguntaAtual.valorMaximo);
    } else {
      console.log('\n❌ PERGUNTA ATUAL É NULL!');
      console.log('proximaPergunta no banco:', 'e4aba40a-dfe8-44a2-aa80-844b95599985');
    }
    
  } catch (error) {
    console.error('Erro ao chamar API:', error.message);
  }
}

testarAPI();
