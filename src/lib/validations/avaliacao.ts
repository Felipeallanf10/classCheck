import { z } from "zod"

export const avaliacaoSchema = z.object({
  humor: z.number().min(1, "Por favor, selecione seu humor").max(5, "Humor deve ser entre 1 e 5"),
  nota: z.number().min(1, "Por favor, avalie a aula").max(5, "Nota deve ser entre 1 e 5"),
  feedback: z.string().max(500, "Feedback deve ter no máximo 500 caracteres").optional(),
})

export type AvaliacaoFormData = z.infer<typeof avaliacaoSchema>

export const avaliacaoInitialData: AvaliacaoFormData = {
  humor: 0,
  nota: 0,
  feedback: "",
}
