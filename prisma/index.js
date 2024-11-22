const bcrypt = require(`bcrypt`);
const { PrismaClient } = require (`@prisma/client`);

const prisma = new PrismaClient().$extends({
  model: {
    user: {
      async register(username, password) {
        const hash = await bcrypt.hash(password, 10);
        return prisma.user.create({
          data: { username, password: hash },
        });
      },
      async login(usernname, password) {
        const user = await prisma.user.findUniqueOrThrow({
          where: { username }, 
        });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw Error(`Invalid password.`);
      },
    },
  },
});

module.exports = prisma;