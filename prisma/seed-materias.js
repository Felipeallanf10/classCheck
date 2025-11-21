const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const materiasIniciais = [
  { nome: 'Matemática', descricao: 'Disciplina de Matemática' },
  { nome: 'Português', descricao: 'Língua Portuguesa' },
  { nome: 'História', descricao: 'Disciplina de História' },
  { nome: 'Geografia', descricao: 'Disciplina de Geografia' },
  { nome: 'Ciências', descricao: 'Disciplina de Ciências' },
  { nome: 'Biologia', descricao: 'Disciplina de Biologia' },
  { nome: 'Física', descricao: 'Disciplina de Física' },
  { nome: 'Química', descricao: 'Disciplina de Química' },
  { nome: 'Inglês', descricao: 'Língua Inglesa' },
  { nome: 'Espanhol', descricao: 'Língua Espanhola' },
  { nome: 'Educação Física', descricao: 'Disciplina de Educação Física' },
  { nome: 'Artes', descricao: 'Disciplina de Artes' },
  { nome: 'Filosofia', descricao: 'Disciplina de Filosofia' },
  { nome: 'Sociologia', descricao: 'Disciplina de Sociologia' },
]

async function main() {
  console.log('🌱 Iniciando seed de matérias...')

  for (const materia of materiasIniciais) {
    const existe = await prisma.materia.findUnique({
      where: { nome: materia.nome }
    })

    if (!existe) {
      await prisma.materia.create({
        data: materia
      })
      console.log(`✅ Matéria criada: ${materia.nome}`)
    } else {
      console.log(`⏭️  Matéria já existe: ${materia.nome}`)
    }
  }

  console.log('✨ Seed de matérias concluído!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
