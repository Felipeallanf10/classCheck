/**
 * Script: Verificar Duplicatas no Banco de Perguntas
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verificarDuplicatas() {
  console.log('🔍 VERIFICANDO DUPLICATAS NO BANCO DE PERGUNTAS\n');
  console.log('='.repeat(70), '\n');

  const perguntas = await prisma.bancoPerguntasAdaptativo.findMany({
    orderBy: { codigo: 'asc' },
    select: {
      id: true,
      codigo: true,
      titulo: true,
      texto: true,
      categoria: true,
      dominio: true,
      tipoPergunta: true,
      escalaNome: true,
      escalaItem: true
    }
  });

  console.log(`📊 Total de perguntas: ${perguntas.length}\n`);

  // ============================================
  // 1. VERIFICAR CÓDIGOS DUPLICADOS
  // ============================================
  console.log('1️⃣ VERIFICANDO CÓDIGOS DUPLICADOS...\n');
  
  const codigosCount = {};
  perguntas.forEach(p => {
    codigosCount[p.codigo] = (codigosCount[p.codigo] || 0) + 1;
  });

  const codigosDuplicados = Object.entries(codigosCount)
    .filter(([_, count]) => count > 1)
    .sort((a, b) => b[1] - a[1]);
  
  if (codigosDuplicados.length > 0) {
    console.log('❌ CÓDIGOS DUPLICADOS ENCONTRADOS:\n');
    codigosDuplicados.forEach(([codigo, count]) => {
      console.log(`   ${codigo}: ${count} vezes`);
      const duplicatas = perguntas.filter(p => p.codigo === codigo);
      duplicatas.forEach((d, idx) => {
        console.log(`      ${idx + 1}. ${d.texto.substring(0, 60)}...`);
      });
      console.log('');
    });
  } else {
    console.log('✅ Nenhum código duplicado encontrado!\n');
  }

  // ============================================
  // 2. VERIFICAR TEXTOS DUPLICADOS EXATOS
  // ============================================
  console.log('2️⃣ VERIFICANDO TEXTOS DUPLICADOS EXATOS...\n');
  
  const textosExatos = new Map();
  const duplicatasExatas = [];

  perguntas.forEach(p => {
    const textoNorm = p.texto.toLowerCase().trim();
    if (textosExatos.has(textoNorm)) {
      duplicatasExatas.push({
        original: textosExatos.get(textoNorm),
        duplicata: p
      });
    } else {
      textosExatos.set(textoNorm, p);
    }
  });

  if (duplicatasExatas.length > 0) {
    console.log(`❌ ${duplicatasExatas.length} TEXTOS DUPLICADOS EXATOS ENCONTRADOS:\n`);
    duplicatasExatas.forEach((d, idx) => {
      console.log(`   ${idx + 1}. Duplicata:`);
      console.log(`      → ${d.original.codigo}: ${d.original.texto}`);
      console.log(`      → ${d.duplicata.codigo}: ${d.duplicata.texto}`);
      console.log('');
    });
  } else {
    console.log('✅ Nenhum texto duplicado exato encontrado!\n');
  }

  // ============================================
  // 3. VERIFICAR TEXTOS MUITO SIMILARES
  // ============================================
  console.log('3️⃣ VERIFICANDO TEXTOS MUITO SIMILARES...\n');
  
  const similares = [];

  for (let i = 0; i < perguntas.length; i++) {
    for (let j = i + 1; j < perguntas.length; j++) {
      const p1 = perguntas[i];
      const p2 = perguntas[j];
      
      const texto1 = p1.texto.toLowerCase().trim();
      const texto2 = p2.texto.toLowerCase().trim();
      
      // Verificar se um contém o outro
      if (texto1.includes(texto2) || texto2.includes(texto1)) {
        similares.push({
          tipo: 'CONTÉM',
          p1,
          p2,
          razao: 'Um texto contém o outro'
        });
      }
      // Verificar se têm o mesmo título
      else if (p1.titulo.toLowerCase() === p2.titulo.toLowerCase()) {
        similares.push({
          tipo: 'TÍTULO IGUAL',
          p1,
          p2,
          razao: 'Mesmo título'
        });
      }
      // Verificar se são da mesma escala e item
      else if (p1.escalaNome && p2.escalaNome && 
               p1.escalaNome === p2.escalaNome && 
               p1.escalaItem === p2.escalaItem) {
        similares.push({
          tipo: 'ESCALA DUPLICADA',
          p1,
          p2,
          razao: `Mesmo item da escala ${p1.escalaNome}`
        });
      }
    }
  }

  if (similares.length > 0) {
    console.log(`⚠️  ${similares.length} PERGUNTAS SIMILARES ENCONTRADAS:\n`);
    similares.forEach((s, idx) => {
      console.log(`   ${idx + 1}. [${s.tipo}] - ${s.razao}`);
      console.log(`      → ${s.p1.codigo} (${s.p1.tipoPergunta}): ${s.p1.texto.substring(0, 50)}...`);
      console.log(`      → ${s.p2.codigo} (${s.p2.tipoPergunta}): ${s.p2.texto.substring(0, 50)}...`);
      console.log('');
    });
  } else {
    console.log('✅ Nenhuma pergunta similar problemática encontrada!\n');
  }

  // ============================================
  // 4. ESTATÍSTICAS POR CATEGORIA
  // ============================================
  console.log('4️⃣ ESTATÍSTICAS POR CATEGORIA:\n');
  
  const porCategoria = {};
  perguntas.forEach(p => {
    const key = `${p.categoria}`;
    porCategoria[key] = (porCategoria[key] || 0) + 1;
  });

  Object.entries(porCategoria)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`   ${cat.padEnd(35)} ${count.toString().padStart(3)} perguntas`);
    });

  // ============================================
  // 5. ESTATÍSTICAS POR ESCALA
  // ============================================
  console.log('\n5️⃣ ESTATÍSTICAS POR ESCALA VALIDADA:\n');
  
  const porEscala = {};
  perguntas.forEach(p => {
    if (p.escalaNome) {
      porEscala[p.escalaNome] = (porEscala[p.escalaNome] || 0) + 1;
    }
  });

  Object.entries(porEscala)
    .sort((a, b) => b[1] - a[1])
    .forEach(([escala, count]) => {
      console.log(`   ${escala.padEnd(25)} ${count.toString().padStart(3)} perguntas`);
    });

  const semEscala = perguntas.filter(p => !p.escalaNome).length;
  console.log(`   ${'(Sem escala validada)'.padEnd(25)} ${semEscala.toString().padStart(3)} perguntas`);

  // ============================================
  // 6. RESUMO FINAL
  // ============================================
  console.log('\n' + '='.repeat(70));
  console.log('📊 RESUMO FINAL:\n');
  
  const problemas = codigosDuplicados.length + duplicatasExatas.length;
  const avisos = similares.length;

  if (problemas === 0 && avisos === 0) {
    console.log('✅ TUDO OK! Nenhuma duplicata ou problema encontrado.');
  } else {
    if (problemas > 0) {
      console.log(`❌ ${problemas} PROBLEMAS CRÍTICOS (duplicatas exatas)`);
    }
    if (avisos > 0) {
      console.log(`⚠️  ${avisos} AVISOS (perguntas similares - pode ser intencional)`);
    }
  }

  console.log(`\n📚 Total: ${perguntas.length} perguntas únicas analisadas`);
  console.log('='.repeat(70), '\n');

  await prisma.$disconnect();
}

// Executar
verificarDuplicatas()
  .catch((error) => {
    console.error('❌ Erro ao verificar duplicatas:', error);
    process.exit(1);
  });
