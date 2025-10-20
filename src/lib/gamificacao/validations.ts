/**
 * Schemas de validação para a API de Gamificação
 * Usa Zod para validação de dados
 */

import { z } from 'zod';

/**
 * Schema para adicionar XP
 */
export const adicionarXPSchema = z.object({
  usuarioId: z.number().int().positive('usuarioId deve ser um número positivo'),
  acao: z.string().min(1, 'acao é obrigatória'),
  aulaId: z.number().int().positive().optional(),
  descricao: z.string().max(500).optional(),
});

/**
 * Schema para buscar histórico de XP
 */
export const buscarHistoricoSchema = z.object({
  usuarioId: z.number().int().positive(),
  limite: z.number().int().min(1).max(100).default(20),
  pagina: z.number().int().min(1).default(1).optional(),
  acao: z.string().optional(),
});

/**
 * Schema para ranking
 */
export const rankingSchema = z.object({
  configuracaoId: z.number().int().positive().default(1),
  periodo: z.enum(['SEMANAL', 'MENSAL', 'BIMESTRAL']).optional(),
  limite: z.number().int().min(1).max(100).default(10),
});

/**
 * Schema para criar configuração de ranking
 */
export const criarConfiguracaoRankingSchema = z.object({
  periodoCalculo: z.enum(['SEMANAL', 'MENSAL', 'BIMESTRAL']),
  bonusPrimeiroLugar: z.number().min(0).max(1).default(0.3),
  bonusSegundoLugar: z.number().min(0).max(1).default(0.2),
  bonusTerceiroLugar: z.number().min(0).max(1).default(0.1),
  minimoAvaliacoes: z.number().int().min(1).default(5),
  aplicarAutomaticamente: z.boolean().default(true),
  notificarAlunos: z.boolean().default(true),
  visibilidadeRanking: z.enum(['PUBLICO', 'APENAS_TOP3', 'PRIVADO']).default('PUBLICO'),
  materiaId: z.string().optional(),
  criadoPorId: z.number().int().positive(),
});

/**
 * Schema para verificar conquistas
 */
export const verificarConquistasSchema = z.object({
  usuarioId: z.number().int().positive(),
  acao: z.string().optional(),
});

/**
 * Schema para parâmetros de rota com usuarioId
 */
export const usuarioIdParamSchema = z.object({
  usuarioId: z.number().int().positive(),
});

/**
 * Helper para validar dados
 */
export function validarDados<T>(schema: z.ZodSchema<T>, data: unknown): {
  sucesso: boolean;
  dados?: T;
  erros?: z.ZodError;
} {
  try {
    const dadosValidados = schema.parse(data);
    return { sucesso: true, dados: dadosValidados };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { sucesso: false, erros: error };
    }
    throw error;
  }
}

/**
 * Helper para formatar erros de validação
 */
export function formatarErrosValidacao(erros: z.ZodError): Record<string, string> {
  const errosFormatados: Record<string, string> = {};
  
  erros.errors.forEach((erro) => {
    const campo = erro.path.join('.');
    errosFormatados[campo] = erro.message;
  });
  
  return errosFormatados;
}
