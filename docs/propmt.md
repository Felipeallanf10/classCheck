# 🧭 INSTRUÇÕES PARA EXECUÇÃO — FASE 1 / PASSO 2  
## Integração `/exportacao` dentro de `/relatorios`  
**Projeto:** ClassCheck v3.0  
**Responsável:** [Nome do desenvolvedor]  
**Supervisor:** Felipe Allan (Gerente de Projeto)  
**Branch:** `refactor/phase1-exportacao-integration`  
**Base:** `develop`  

---

## 🎯 OBJETIVO GERAL

Unificar as páginas **/relatorios** e **/exportacao** em um único fluxo funcional, eliminando redundâncias e melhorando a navegação.  
O objetivo é **incorporar os recursos de exportação diretamente dentro da página `/relatorios`**, mantendo a experiência intuitiva e visualmente coerente com o padrão atual do sistema.

---

## ⚙️ ETAPAS DE IMPLEMENTAÇÃO

### **FASE A — Estrutura e Navegação (1h)**

#### 🎯 Objetivo:
Eliminar redundância entre `/relatorios` e `/exportacao`, redirecionando e atualizando rotas.

#### 📋 Ações:
1. **Remover a rota `/exportacao`**
   - Deletar `src/app/exportacao/page.tsx`
   - Remover importações e referências no menu lateral e breadcrumbs.

2. **Criar redirecionamento**
   - Adicionar redirecionamento no Next.js:
     ```tsx
     // src/app/exportacao/page.tsx (temporário antes de exclusão definitiva)
     import { redirect } from "next/navigation";
     export default function RedirectExportacao() {
       redirect("/relatorios");
     }
     ```
   - Após deploy e validação, remover completamente a rota.

3. **Atualizar menu lateral**
   - Substituir entrada `/exportacao` por `/relatorios`.

4. **Revisar breadcrumbs e links internos**
   - Buscar por `"exportacao"` no projeto e atualizar todas as referências.

---

### **FASE B — Criação do Componente ExportDropdown (2h)**

#### 🎯 Objetivo:
Adicionar um **menu de exportação unificado** no cabeçalho de relatórios.

#### 📋 Estrutura esperada:
components/
└── relatorios/
└── ExportDropdown.tsx

arduino
Copiar código

#### 🧱 Implementação base:
```tsx
"use client";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";

export function ExportDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" /> Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("pdf")}>Exportar PDF</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("excel")}>Exportar Excel</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("csv")}>Exportar CSV</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function handleExport(format: string) {
  // Chamar lógica do ExportadorRelatorios existente
  console.log(`Exportando relatório em formato ${format.toUpperCase()}`);
}
FASE C — Integração do Componente (1h)
🎯 Objetivo:
Integrar o ExportDropdown diretamente no cabeçalho da página /relatorios.

📋 Ações:
Editar src/app/relatorios/page.tsx:

tsx
Copiar código
import { ExportDropdown } from "@/components/relatorios/ExportDropdown";

export default function RelatoriosPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Relatórios" 
        actions={<ExportDropdown />} 
      />
      <RelatorioLongitudinal />
      <GraficoTendenciasTurma />
      <ComparativoPeriodos />
      <MapaCalorEmocional />
    </PageContainer>
  );
}
Manter compatibilidade

O botão deve chamar funções já existentes no ExportadorRelatorios, se possível via hook ou serviço.

FASE D — Refatoração e Limpeza (1h)
📋 Ações:
Revisar dependências do ExportadorRelatorios.

Mover apenas a lógica essencial de exportação para um serviço:

arduino
Copiar código
lib/export/handlers.ts
Remover código duplicado de filtros e selects já existentes.

Garantir que toda exportação seja iniciada pelo dropdown.

FASE E — Testes e Validação (1h)
📋 Cenários de teste:
Cenário	Resultado Esperado
Acesso direto a /exportacao	Redireciona automaticamente para /relatorios
Clique em “Exportar PDF”	Gera arquivo PDF corretamente
Clique em “Exportar Excel”	Gera arquivo .xlsx válido
Clique em “Exportar CSV”	Gera arquivo .csv válido
Mobile view	Dropdown acessível e responsivo

📋 Testes adicionais:
Verificar aria-labels e acessibilidade dos botões.

Testar em resoluções 375px, 768px e 1440px.

Validar compatibilidade com tema dark/light.

🧪 CRITÉRIOS DE CONCLUSÃO
✅ /exportacao removida do menu
✅ Redirecionamento ativo e funcional
✅ ExportDropdown implementado e testado
✅ Página /relatorios atualizada e limpa
✅ Nenhum código redundante ou duplicado

📅 ESTIMATIVA DE TEMPO TOTAL
Etapa	Tempo Estimado
Fase A – Estrutura	1h
Fase B – Componente	2h
Fase C – Integração	1h
Fase D – Refatoração	1h
Fase E – Testes	1h
Total Estimado	6h

🧭 RESULTADO FINAL ESPERADO
Após a conclusão:

/relatorios será a única interface de geração e exportação de relatórios.

O usuário poderá visualizar, filtrar e exportar dados no mesmo fluxo.

A navegação do sistema será mais simples, coesa e sem duplicações.

O ExportDropdown servirá como ponto padrão de exportação para futuros módulos.

💾 COMMITS RECOMENDADOS
bash
Copiar código
feat(relatorios): integrar exportação com dropdown
chore(routes): redirecionar /exportacao → /relatorios
refactor(export): mover handlers para lib/export
fix(ui): ajustar responsividade do botão de exportação
test(relatorios): validar fluxos de exportação (pdf, excel, csv)
✅ CONCLUSÃO
Esta etapa visa consolidar a estrutura do sistema, eliminando redundâncias e unificando o fluxo de exportação dentro dos relatórios.
A integração deve preservar a experiência do usuário e simplificar a manutenção futura.

🧠 Após o merge, o módulo /relatorios será o núcleo analítico e de exportação oficial do ClassCheck v3.0.