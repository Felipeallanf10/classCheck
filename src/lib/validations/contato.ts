import { z } from 'zod'

export const contatoSchema = z.object({
  nome: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  
  email: z
    .string()
    .email('Email deve ter um formato válido')
    .max(255, 'Email deve ter no máximo 255 caracteres'),
  
  assunto: z
    .string()
    .min(5, 'Assunto deve ter pelo menos 5 caracteres')
    .max(200, 'Assunto deve ter no máximo 200 caracteres'),
  
  mensagem: z
    .string()
    .min(20, 'Mensagem deve ter pelo menos 20 caracteres')
    .max(1000, 'Mensagem deve ter no máximo 1000 caracteres')
})

export type ContatoData = z.infer<typeof contatoSchema>
