const prisma = require(`./index`); 
const { faker } = require(`@faker-js/faker`);

const seed = async (numProducts = 20) => {
  const products = Array.from({ length: numProducts }, () => ({
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
  }));
  await prisma.product.createMany({ data: products });
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
  