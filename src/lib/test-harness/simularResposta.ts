import type { PerguntaSocioemocional } from '@/types/pergunta';

export function responderAleatorio(pergunta: PerguntaSocioemocional) {
  switch (pergunta.tipoPergunta) {
    case 'ESCALA_FREQUENCIA':
      // 0..3
      return Math.floor(Math.random() * 4);

    case 'ESCALA_INTENSIDADE':
      // 1..5
      return Math.floor(Math.random() * 5) + 1;

    case 'ESCALA_VISUAL':
      // x,y -1..1
      return { x: parseFloat((Math.random() * 2 - 1).toFixed(2)), y: parseFloat((Math.random() * 2 - 1).toFixed(2)) };

    case 'SIM_NAO':
      return Math.random() < 0.5;

    case 'LIKERT_5':
      return Math.floor(Math.random() * 5) + 1;

    case 'LIKERT_7':
      return Math.floor(Math.random() * 7) + 1;

    case 'MULTIPLA_ESCOLHA':
      if (pergunta.opcoes && pergunta.opcoes.length) {
        const idx = Math.floor(Math.random() * pergunta.opcoes.length);
        return pergunta.opcoes[idx].valor;
      }
      return null;

    case 'MULTIPLA_SELECAO':
      if (pergunta.opcoes && pergunta.opcoes.length) {
        // Seleciona de 0 a N opcoes
        const out: Array<string | number> = [];
        pergunta.opcoes.forEach((op) => {
          if (Math.random() < 0.35) out.push(op.valor);
        });
        return out;
      }
      return [];

    case 'SLIDER_NUMERICO':
    case 'ESCALA_NUMERICA':
      return pergunta.valorMinimo ? pergunta.valorMinimo : 0;

    default:
      return null;
  }
}

export default responderAleatorio;
