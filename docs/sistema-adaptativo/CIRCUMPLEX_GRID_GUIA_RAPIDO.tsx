// /**
//  * GUIA RÁPIDO - CircumplexGrid
//  * 
//  * Como integrar o componente CircumplexGrid no fluxo de check-in
//  */

// // ============================================
// // 1. IMPORTAÇÃO BÁSICA
// // ============================================

// import { CircumplexGrid } from '@/components/adaptive';

// // ============================================
// // 2. USO SIMPLES (Check-in Diário)
// // ============================================

// export function CheckInDiario() {
//   const [emotion, setEmotion] = useState(null);

//   return (
//     <CircumplexGrid
//       onSelect={(point) => {
//         console.log('Emoção:', point);
//         setEmotion(point);
//         // Salvar no banco de dados
//       }}
//       selectedPoint={emotion}
//     />
//   );
// }

// // ============================================
// // 3. COM HISTÓRICO TEMPORAL
// // ============================================

// export function CheckInComHistorico() {
//   const [emotion, setEmotion] = useState(null);
//   const [history, setHistory] = useState([]);

//   useEffect(() => {
//     // Buscar histórico dos últimos 7 dias
//     async function loadHistory() {
//       const data = await fetch('/api/emotional-state?dias=7');
//       const historico = await data.json();
//       setHistory(historico);
//     }
//     loadHistory();
//   }, []);

//   return (
//     <CircumplexGrid
//       onSelect={setEmotion}
//       selectedPoint={emotion}
//       historicalPoints={history}
//     />
//   );
// }

// // ============================================
// // 4. INTEGRAÇÃO COM API
// // ============================================

// // app/api/emotional-state/route.ts
// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';

// export async function POST(req: Request) {
//   const { usuarioId, valencia, ativacao } = await req.json();
  
//   // Determinar quadrante
//   const getQuadrant = (v: number, a: number) => {
//     if (v >= 0 && a >= 0) return 'Animado';
//     if (v >= 0 && a < 0) return 'Calmo';
//     if (v < 0 && a < 0) return 'Entediado';
//     return 'Ansioso';
//   };
  
//   const registro = await prisma.humorRegistro.create({
//     data: {
//       usuarioId,
//       valencia,
//       ativacao,
//       quadrante: getQuadrant(valencia, ativacao),
//       data: new Date()
//     }
//   });
  
//   return NextResponse.json(registro);
// }

// // ============================================
// // 5. PÁGINA COMPLETA DE CHECK-IN
// // ============================================

// // app/check-in/page.tsx
// 'use client';

// import { useState } from 'react';
// import { CircumplexGrid } from '@/components/adaptive';
// import { Button } from '@/components/ui/button';
// import { useRouter } from 'next/navigation';

// export default function CheckInPage() {
//   const [emotion, setEmotion] = useState(null);
//   const [saving, setSaving] = useState(false);
//   const router = useRouter();

//   const handleSave = async () => {
//     if (!emotion) return;
    
//     setSaving(true);
    
//     try {
//       await fetch('/api/emotional-state', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           usuarioId: 1, // Usar ID do usuário logado
//           valencia: emotion.valencia,
//           ativacao: emotion.ativacao
//         })
//       });
      
//       // Redirecionar para dashboard
//       router.push('/dashboard?checkin=success');
//     } catch (error) {
//       console.error('Erro ao salvar:', error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="container mx-auto p-6 max-w-2xl">
//       <h1 className="text-3xl font-bold mb-6">Check-in Emocional</h1>
      
//       <CircumplexGrid
//         onSelect={setEmotion}
//         selectedPoint={emotion}
//         width={500}
//         height={500}
//       />
      
//       {emotion && (
//         <div className="mt-6 flex gap-4">
//           <Button
//             onClick={handleSave}
//             disabled={saving}
//             className="flex-1"
//           >
//             {saving ? 'Salvando...' : 'Salvar Check-in'}
//           </Button>
//           <Button
//             variant="outline"
//             onClick={() => setEmotion(null)}
//           >
//             Limpar
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }

// // ============================================
// // 6. ANÁLISE DE PADRÕES EMOCIONAIS
// // ============================================

// function analisarPadroesEmocionais(historico) {
//   const mediaValencia = historico.reduce((sum, p) => sum + p.valencia, 0) / historico.length;
//   const mediaAtivacao = historico.reduce((sum, p) => sum + p.ativacao, 0) / historico.length;
  
//   // Detectar tendências
//   const tendenciaDepressiva = mediaValencia < -0.3 && mediaAtivacao < -0.2;
//   const tendenciaAnsiosa = mediaValencia < -0.2 && mediaAtivacao > 0.3;
  
//   // Calcular variabilidade
//   const calcularDP = (valores) => {
//     const media = valores.reduce((a, b) => a + b, 0) / valores.length;
//     const variancia = valores.reduce((sum, v) => sum + Math.pow(v - media, 2), 0) / valores.length;
//     return Math.sqrt(variancia);
//   };
  
//   const variabilidadeValencia = calcularDP(historico.map(p => p.valencia));
//   const variabilidadeAtivacao = calcularDP(historico.map(p => p.ativacao));
  
//   return {
//     mediaValencia,
//     mediaAtivacao,
//     tendenciaDepressiva,
//     tendenciaAnsiosa,
//     variabilidadeValencia,
//     variabilidadeAtivacao,
//     alerta: tendenciaDepressiva || tendenciaAnsiosa
//   };
// }

// // Uso:
// const analise = analisarPadroesEmocionais(historico);
// if (analise.alerta) {
//   console.log('⚠️ Padrão emocional preocupante detectado!');
// }

// // ============================================
// // 7. DASHBOARD COM ESTATÍSTICAS
// // ============================================

// export function EmotionalDashboard({ userId }) {
//   const [stats, setStats] = useState(null);

//   useEffect(() => {
//     async function loadStats() {
//       const res = await fetch(`/api/emotional-stats?userId=${userId}`);
//       const data = await res.json();
//       setStats(data);
//     }
//     loadStats();
//   }, [userId]);

//   if (!stats) return <div>Carregando...</div>;

//   return (
//     <div className="grid grid-cols-2 gap-4">
//       <div className="p-4 bg-blue-50 rounded-lg">
//         <h3 className="font-semibold">Estado Predominante</h3>
//         <p className="text-2xl">{stats.estadoPredominante}</p>
//       </div>
      
//       <div className="p-4 bg-green-50 rounded-lg">
//         <h3 className="font-semibold">Valencia Média</h3>
//         <p className="text-2xl">{stats.mediaValencia.toFixed(2)}</p>
//       </div>
      
//       <div className="p-4 bg-purple-50 rounded-lg">
//         <h3 className="font-semibold">Ativação Média</h3>
//         <p className="text-2xl">{stats.mediaAtivacao.toFixed(2)}</p>
//       </div>
      
//       <div className="p-4 bg-orange-50 rounded-lg">
//         <h3 className="font-semibold">Variabilidade</h3>
//         <p className="text-2xl">{stats.variabilidade.toFixed(2)}</p>
//       </div>
      
//       {stats.alerta && (
//         <div className="col-span-2 p-4 bg-red-50 border border-red-200 rounded-lg">
//           <h3 className="font-semibold text-red-900">⚠️ Alerta</h3>
//           <p className="text-sm text-red-700">
//             Padrão emocional preocupante detectado. Considere conversar com um profissional.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

// // ============================================
// // 8. MODELO PRISMA RECOMENDADO
// // ============================================

// /**
//  * Adicionar ao schema.prisma:
//  * 
//  * model HumorRegistro {
//  *   id         String   @id @default(uuid())
//  *   usuarioId  Int
//  *   valencia   Float    // -1.0 a 1.0
//  *   ativacao   Float    // -1.0 a 1.0
//  *   quadrante  String   // "Animado", "Calmo", "Entediado", "Ansioso"
//  *   data       DateTime @default(now())
//  *   
//  *   usuario Usuario @relation(fields: [usuarioId], references: [id])
//  *   
//  *   @@index([usuarioId, data])
//  *   @@map("humor_registros")
//  * }
//  */

// // ============================================
// // 9. TESTES
// // ============================================

// import { render, screen, fireEvent } from '@testing-library/react';
// import { CircumplexGrid } from './CircumplexGrid';

// describe('CircumplexGrid', () => {
//   it('deve renderizar corretamente', () => {
//     render(<CircumplexGrid />);
//     expect(screen.getByText(/Como você está se sentindo/)).toBeInTheDocument();
//   });

//   it('deve chamar onSelect ao clicar', () => {
//     const handleSelect = jest.fn();
//     render(<CircumplexGrid onSelect={handleSelect} interactive={true} />);
    
//     const canvas = screen.getByRole('img'); // Canvas tem role img
//     fireEvent.click(canvas, { clientX: 200, clientY: 200 });
    
//     expect(handleSelect).toHaveBeenCalled();
//   });

//   it('deve exibir ponto histórico', () => {
//     const history = [
//       { valencia: 0.5, ativacao: 0.5, label: 'Animado' }
//     ];
    
//     render(<CircumplexGrid historicalPoints={history} />);
//     // Verificar que canvas foi renderizado com histórico
//   });
// });

// // ============================================
// // 10. EXEMPLOS DE ALERTAS
// // ============================================

// function gerarAlertasEmocionais(ponto) {
//   const alertas = [];
  
//   // Ansiedade alta
//   if (ponto.valencia < -0.5 && ponto.ativacao > 0.7) {
//     alertas.push({
//       nivel: 'LARANJA',
//       tipo: 'ANSIEDADE_ALTA',
//       mensagem: 'Estado de alta ansiedade detectado',
//       recomendacao: 'Técnicas de respiração podem ajudar'
//     });
//   }
  
//   // Depressão indicada
//   if (ponto.valencia < -0.7 && ponto.ativacao < -0.3) {
//     alertas.push({
//       nivel: 'VERMELHO',
//       tipo: 'DEPRESSAO_INDICADA',
//       mensagem: 'Sinais de estado depressivo',
//       recomendacao: 'Converse com um profissional'
//     });
//   }
  
//   return alertas;
// }

// // ============================================
// // FIM DO GUIA RÁPIDO
// // ============================================

// export default {
//   CircumplexGrid,
//   analisarPadroesEmocionais,
//   gerarAlertasEmocionais
// };
