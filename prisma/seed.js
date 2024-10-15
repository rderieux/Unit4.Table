const prisma = require("../prisma");
const { faker } = require("@faker-js/faker");

const seed = async (
  numRestaurants = 3,
  numCustomers = 5,
  numReservations = 8
) => {
  // TODO: this function
  const restaurants = Array.from({ length: numRestaurants }, () => ({
    name: faker.person.fullName(),
  }));
  await prisma.restaurant.createMany({ data: restaurants });

  const customers = Array.from({ length: numCustomers }, () => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
  }));
  await prisma.customer.createMany({ data: customers });

  for (let i = 0; i < numReservations; i++) {
    const partySize = 1 + Math.floor(Math.random() * 3);

    const party = Array.from({ length: partySize }, () => ({
      id: 1 + Math.floor(Math.random() * numCustomers),
    }));

    await prisma.reservation.create({
      data: {
        date: new Date(Date.now()).toDateString(),
        restaurantId: 1 + Math.floor(Math.random() * numRestaurants),
        party: { connect: party },
      },
    });
  }
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
