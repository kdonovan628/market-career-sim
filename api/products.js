const express = require(`express`);
const router = express.Router();
const prisma = require(`../prisma`);

router.get(`/`, async (req, res, next) => {
  try {
    const products = await prisma.product.findMany(); 
    res.json(products);
  } catch (error) {
    next(error);
  }
});

router.get(`/:id`, async (req, res, next) => {
  const { id } = req.params; 
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) return res.status(404).json({ error: `Product not found` });

    let orders = [];
    if (req.user) {
      orders = await prisma.order.findMany({
        where: { 
          customerId: req.user.id,
          items: { some: { id: parseInt(id) }},
        },
      });
    }
    res.json({ product, orders });
  } catch (error) {
    next (error);
  }
});

module.exports = router;