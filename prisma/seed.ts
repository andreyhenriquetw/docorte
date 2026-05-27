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
        price: 25.0,
        imageUrl:
          "https://xd90tgazad.ufs.sh/f/r9YwIz1ulNCWLnzZk0p9UQfGIRqvtH0Z4B3xeXr618hwn2dD",
      },
      {
        name: "Corte + Barba",
        description: "Combo para visual renovado, bem definido.",
        price: 30.0,
        imageUrl:
          "https://xd90tgazad.ufs.sh/f/r9YwIz1ulNCWvADDaSiCzS5Ldp6gfYOMwD3cGXmI97juiKNy",
      },
      {
        name: "Corte + Barba + Sobrancelha",
        description: "Combo completo para um visual impecável.",
        price: 35.0,
        imageUrl:
          "https://xd90tgazad.ufs.sh/f/r9YwIz1ulNCWrqmwXI1ulNCWtEmGLOXUwr3MDPQYIv1a8hT0",
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
        price: 5.0,
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
        description: "Cor que entrega um visual elegante.",
        price: 10.0,
        imageUrl:
          "https://xd90tgazad.ufs.sh/f/r9YwIz1ulNCW5DGNvEAi1HmlaNWvpAqfuyJLIeTPKd03R4tG",
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

    // limpa dados antigos
    await prisma.booking.deleteMany()
    await prisma.barbershopService.deleteMany()
    await prisma.barber.deleteMany()
    await prisma.barbershop.deleteMany()

    // cria barbearia
    const barbershop = await prisma.barbershop.create({
      data: {
        name: creativeNames[0],
        slug: "agende-aqui",
        address: addresses[0],
        imageUrl: images[0],
        phones: ["+55 35 8815-0081"],
        description:
          "Barbearia premium especializada em cortes modernos, barba e estilo.",
      },
    })

    // cria barbeiros
    const barbers = await Promise.all([
      prisma.barber.create({
        data: {
          name: "KN",
          imageUrl: "/barber1.jpg",
          barbershopId: barbershop.id,
        },
      }),
    ])

    // cria serviços
    for (const service of services) {
      const randomBarber = barbers[Math.floor(Math.random() * barbers.length)]

      await prisma.barbershopService.create({
        data: {
          name: service.name,
          description: service.description,
          price: service.price,
          imageUrl: service.imageUrl,

          barbershop: {
            connect: {
              id: barbershop.id,
            },
          },

          barber: {
            connect: {
              id: randomBarber.id,
            },
          },
        },
      })
    }

    console.log("✅ Seed finalizado com barbeiros!")
  } catch (error) {
    console.error("❌ Erro ao criar dados:", error)
  } finally {
    await prisma.$disconnect()
  }
}

seedDatabase()
