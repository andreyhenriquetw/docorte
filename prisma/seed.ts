import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function seedDatabase() {
  try {
    const images = [
      "https://cultura.uol.com.br/webstories/2023/05/como-garantir-uma-barba-bem-feita/assets/5.jpeg",
    ]
    const creativeNames = ["KN DO CORTE"]
    const addresses = ["54 Drumnavanagh, Cavan, H12 X443, Irlanda"]

    const services = [
      {
        name: "Corte de Cabelo",
        description: "Estilo personalizado com as últimas tendências.",
        price: 15.0,
        imageUrl:
          "https://hotclube.s3.sa-east-1.amazonaws.com/cortedecabelo.jpeg",
      },
      {
        name: "Barba",
        description: "Modelagem completa para destacar sua masculinidade.",
        price: 5.0,
        imageUrl: "https://hotclube.s3.sa-east-1.amazonaws.com/barba.jpeg",
      },
      {
        name: "Sobrancelha",
        description: "Expressão acentuada com modelagem precisa.",
        price: 3.0,
        imageUrl:
          "https://hotclube.s3.sa-east-1.amazonaws.com/sombrancelhaa.jpeg",
      },
      {
        name: "Luzes",
        description: "Pontos de luz que destacam um visual mais vivo.",
        price: 35.0,
        imageUrl: "https://hotclube.s3.sa-east-1.amazonaws.com/luzess.jpeg",
      },
      {
        name: "Nevou/Platinado",
        description: "Visual claro e moderno com acabamento marcante.",
        price: 50.0,
        imageUrl:
          "https://hotclube.s3.sa-east-1.amazonaws.com/nevouplatina.jpeg",
      },
      {
        name: "Alisamento",
        description: "Fios alinhados e lisos com resultado natural.",
        price: 30.0,
        imageUrl: "https://hotclube.s3.sa-east-1.amazonaws.com/alisamento.jpeg",
      },
      {
        name: "Pigmentação",
        description: "Cor que entrega um visuale legante.",
        price: 10.0,
        imageUrl:
          "https://hotclube.s3.sa-east-1.amazonaws.com/pigmentacao.jpeg",
      },
      {
        name: "Corte + Barba",
        description: "Combo para visual renovado, bem definido.",
        price: 20.0,
        imageUrl: "https://hotclube.s3.sa-east-1.amazonaws.com/cortebarba.jpeg",
      },
      {
        name: "Corte + Barba + Sobrancelha",
        description: "Combo completo para um visual impecável.",
        price: 23.0,
        imageUrl:
          "https://hotclube.s3.sa-east-1.amazonaws.com/Captura+de+tela+2026-01-08+205429.png",
      },
      {
        name: "Luzes + Corte",
        description: "Realce o visual com luzes e corte moderno.",
        price: 50.0,
        imageUrl: "https://hotclube.s3.sa-east-1.amazonaws.com/luzescorte.jpeg",
      },
      {
        name: "Nevou + Corte",
        description: "Efeito nevado com corte para um visual marcante.",
        price: 65.0,
        imageUrl: "https://hotclube.s3.sa-east-1.amazonaws.com/nevoucorte.jpeg",
      },
    ]

    // Criar apenas 1 barbearia (ou use o tamanho mínimo dos arrays)
    const barbershop = await prisma.barbershop.create({
      data: {
        name: creativeNames[0],
        address: addresses[0],
        imageUrl: images[0],
        phones: ["+352 874 772 097"],
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac augue ullamcorper, pharetra orci mollis, auctor tellus. Phasellus pharetra erat ac libero efficitur tempus. Donec pretium convallis iaculis. Etiam eu felis sollicitudin, cursus mi vitae, iaculis magna. Nam non erat neque. In hac habitasse platea dictumst. Pellentesque molestie accumsan tellus id laoreet.",
      },
    })

    for (const service of services) {
      await prisma.barbershopService.create({
        data: {
          name: service.name,
          description: service.description,
          price: service.price,
          imageUrl: service.imageUrl,
          barbershop: { connect: { id: barbershop.id } },
        },
      })
    }

    console.log("Seed finalizado com sucesso!")
  } catch (error) {
    console.error("Erro ao criar as barbearias:", error)
  } finally {
    await prisma.$disconnect()
  }
}

seedDatabase()
