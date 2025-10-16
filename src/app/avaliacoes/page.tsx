import { redirect } from 'next/navigation'

export default function AvaliacoesRedirect() {
  // Página obsoleta - Redirecionada para /minhas-avaliacoes
  redirect('/minhas-avaliacoes')
}
