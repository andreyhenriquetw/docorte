import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function seedDatabase() {
  try {
    const images = [
      "https://xd90tgazad.ufs.sh/f/r9YwIz1ulNCWVIIfDpkTa08rXoOI3ve6ZLymfqzDCgd7RuBh",
    ]
    const creativeNames = ["KN DO CORTE"]
    const addresses = ["54 Drumnavanagh, Cavan, H12 X443, Irlanda"]

    const services = [
      {
        name: "Corte de Cabelo",
        description: "Estilo personalizado com as últimas tendências.",
        price: 15.0,
        imageUrl:
          "https://xd90tgazad.ufs.sh/f/r9YwIz1ulNCWLnzZk0p9UQfGIRqvtH0Z4B3xeXr618hwn2dD",
      },
      {
        name: "Barba",
        description: "Modelagem completa para destacar sua masculinidade.",
        price: 5.0,
        imageUrl:
          "https://xd90tgazad.ufs.sh/f/r9YwIz1ulNCW1LHdDRBj0VlykRN7LYMv2S9wqWXKbAap3hFg",
      },
      {
        name: "Sobrancelha",
        description: "Expressão acentuada com modelagem precisa.",
        price: 3.0,
        imageUrl:
          "https://xd90tgazad.ufs.sh/f/r9YwIz1ulNCWI1WyCI98omUnsYOVxbyz6NA7vLH12FSMDdrW",
      },
      {
        name: "Luzes",
        description: "Pontos de luz que destacam um visual mais vivo.",
        price: 35.0,
        imageUrl:
          "https://xd90tgazad.ufs.sh/f/r9YwIz1ulNCWlNpZip9LpetGEKCOf9HThFskV7irPzDI8R6M",
      },
      {
        name: "Nevou/Platinado",
        description: "Visual claro e moderno com acabamento marcante.",
        price: 50.0,
        imageUrl:
          "https://xd90tgazad.ufs.sh/f/r9YwIz1ulNCWQ6ErCSaxi96fvUBAyEclqVWKoaX4spZ7bNFt",
      },
      {
        name: "Alisamento",
        description: "Fios alinhados e lisos com resultado natural.",
        price: 30.0,
        imageUrl:
          "https://xd90tgazad.ufs.sh/f/r9YwIz1ulNCWa8uh7tD97wIB042Xx8ZbAGVLMDPUOve6aHEt",
      },
      {
        name: "Pigmentação",
        description: "Cor que entrega um visuale legante.",
        price: 10.0,
        imageUrl:
          "https://xd90tgazad.ufs.sh/f/r9YwIz1ulNCW5DGNvEAi1HmlaNWvpAqfuyJLIeTPKd03R4tG",
      },
      {
        name: "Corte + Barba",
        description: "Combo para visual renovado, bem definido.",
        price: 20.0,
        imageUrl:
          "https://xd90tgazad.ufs.sh/f/r9YwIz1ulNCWvADDaSiCzS5Ldp6gfYOMwD3cGXmI97juiKNy",
      },
      {
        name: "Corte + Barba + Sobrancelha",
        description: "Combo completo para um visual impecável.",
        price: 23.0,
        imageUrl:
          "https://xd90tgazad.ufs.sh/f/r9YwIz1ulNCWrqmwXI1ulNCWtEmGLOXUwr3MDPQYIv1a8hT0",
      },
      {
        name: "Luzes + Corte",
        description: "Realce o visual com luzes e corte moderno.",
        price: 50.0,
        imageUrl:
          "https://xd90tgazad.ufs.sh/f/r9YwIz1ulNCW1oyVVktBj0VlykRN7LYMv2S9wqWXKbAap3hF",
      },
      {
        name: "Nevou + Corte",
        description: "Efeito nevado com corte para um visual marcante.",
        price: 65.0,
        imageUrl:
          "https://xd90tgazad.ufs.sh/f/r9YwIz1ulNCWkMcOWcVBNEhwAajZgqOu3vci0UCpRHebDfPd",
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
