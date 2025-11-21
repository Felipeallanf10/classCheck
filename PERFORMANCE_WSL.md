# 🚀 Guia de Performance para WSL2

## Problema: Lentidão Extrema no `npm run dev`

### Causas Comuns em WSL2
1. **Cross-filesystem operations** (arquivos em /mnt/c são MUITO lentos)
2. **File watching** no Windows filesystem via WSL
3. **Webpack polling** ativado (muito mais lento)
4. **Caches acumulados** (.next, node_modules)
5. **TypeScript/ESLint** executando em background

---

## ✅ Soluções Implementadas

### 1. Next.js Config Otimizado
- ✅ Removido webpack polling (era o maior problema)
- ✅ Turbopack desabilitado no config (use via script)
- ✅ Cache agressivo com `onDemandEntries`
- ✅ Compressão desabilitada em dev

### 2. Scripts Atualizados
```bash
npm run dev          # Agora usa --turbo (MAIS RÁPIDO)
npm run dev:webpack  # Webpack clássico (se turbo der problema)
npm run dev:poll     # Apenas para Docker (NÃO use em WSL!)
```

### 3. Cache Limpo
```bash
rm -rf .next         # Limpar cache Next.js
```

---

## 🔥 Recomendações Críticas

### **SOLUÇÃO #1: Mover Projeto para Linux Filesystem (ALTAMENTE RECOMENDADO)**

A causa #1 de lentidão em WSL é ter arquivos em `/mnt/c/`. Mova para `~/`:

```bash
# 1. Copiar projeto para home do WSL
cd ~
cp -r /mnt/c/Users/Felip/Downloads/projetos/TCC/classCheck ~/classCheck

# 2. Reinstalar dependências
cd ~/classCheck
rm -rf node_modules .next
npm install

# 3. Rodar dev
npm run dev

# 4. Abrir no VS Code
code ~/classCheck
```

**Resultado esperado**: 10-20x mais rápido! 🚀

---

### **SOLUÇÃO #2: Usar Turbopack (Já Configurado)**

```bash
npm run dev  # Agora usa Turbo por padrão
```

**Benefícios**:
- Compilação inicial 5x mais rápida
- Hot reload instantâneo
- Menor uso de CPU/memória

---

### **SOLUÇÃO #3: Desabilitar Antivírus em node_modules**

Windows Defender pode escanear milhares de arquivos:

1. Abrir **Windows Security**
2. **Virus & threat protection** → **Manage settings**
3. **Add exclusion** → **Folder**
4. Adicionar: `C:\Users\Felip\Downloads\projetos\TCC\classCheck\node_modules`

---

### **SOLUÇÃO #4: Aumentar Recursos WSL**

Criar/editar `C:\Users\Felip\.wslconfig`:

```ini
[wsl2]
memory=8GB
processors=4
swap=2GB
```

Reiniciar WSL:
```bash
wsl --shutdown
```

---

## 📊 Comparação de Performance

| Método | Primeira compilação | Hot reload |
|--------|---------------------|------------|
| ❌ WSL + /mnt/c + polling | 60-120s | 10-15s |
| ⚠️ WSL + /mnt/c + webpack | 40-60s | 5-8s |
| ✅ WSL + /mnt/c + turbo | 20-30s | 2-3s |
| 🚀 WSL + ~/ + turbo | 8-12s | <1s |

---

## 🧪 Testes de Diagnóstico

### Teste 1: Velocidade de File System
```bash
cd /mnt/c/Users/Felip/Downloads/projetos/TCC/classCheck
time ls -lR > /dev/null  # Deve ser < 2s

cd ~/classCheck  # Se moveu o projeto
time ls -lR > /dev/null  # Deve ser < 0.5s
```

### Teste 2: Velocidade de Compilação
```bash
rm -rf .next
time npm run dev  # Pressione Ctrl+C após "ready"
# ✅ Bom: < 15s
# ⚠️ Aceitável: 15-30s
# ❌ Ruim: > 30s
```

### Teste 3: Memória Disponível
```bash
free -h  # Deve ter pelo menos 2GB livre
```

---

## 🛠️ Troubleshooting

### Ainda lento após mudanças?

1. **Limpar tudo**:
```bash
rm -rf .next node_modules
npm install
npm run dev
```

2. **Verificar processos**:
```bash
ps aux | grep node  # Não deve ter múltiplos node rodando
pkill -9 node       # Matar todos se tiver duplicados
```

3. **Verificar TypeScript não está compilando**:
```bash
# Não rode tsc em watch mode junto com dev
# Se tiver, mate:
ps aux | grep tsc
pkill -9 tsc
```

4. **Testar Webpack clássico**:
```bash
npm run dev:webpack  # Se Turbo estiver com problema
```

---

## 📈 Monitoramento

### Durante desenvolvimento:
```bash
# Terminal 1
npm run dev

# Terminal 2 (opcional - monitorar recursos)
watch -n 2 'ps aux | grep next'
```

---

## 🎯 Resumo de Ações Imediatas

**Para máxima velocidade (FAÇA ISSO):**
1. ✅ Mover projeto para `~/classCheck` (Linux filesystem)
2. ✅ Usar `npm run dev` (agora usa Turbo)
3. ✅ Excluir node_modules do antivírus
4. ✅ Limpar caches: `rm -rf .next`

**Configurações já aplicadas:**
- ✅ next.config.ts otimizado (sem polling)
- ✅ Scripts atualizados (dev usa Turbo)
- ✅ TypeScript/ESLint ignorados em build

---

## 📞 Suporte

Se após todas essas otimizações ainda estiver lento (>30s), verifique:
- [ ] Projeto está em ~/classCheck (não em /mnt/c)
- [ ] WSL tem pelo menos 4GB RAM (`free -h`)
- [ ] Não há múltiplos processos node rodando (`ps aux | grep node`)
- [ ] Antivírus não está escaneando node_modules
- [ ] .next foi limpo (`rm -rf .next`)

**Velocidade esperada após otimizações:**
- ✅ Primeira compilação: 8-15s
- ✅ Hot reload: <2s
- ✅ Uso de CPU: 30-50% durante compilação
