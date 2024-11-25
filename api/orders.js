const express = require(`express`);
const router = express.Router();
module.exports = router;

const prisma = require(`../prisma`);
const { authenticate } = require("./auth");

router.get("/", authenticate, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { customerId: req.user.id },
      include: { items: true },
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.post("/", authenticate, async (req, res) => {
  const { date, note, productIds } = req.body;

  try {
    const order = await prisma.order.create({
      data: {
        date,
        note,
        customerId: req.user.id,
        items: {
          connect: productIds.map(id => ({ id: parseInt(id) })),
        },
      },
      include: { items: true },
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

router.get("/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const order = await prisma.order.findUniqueOrThrow({
      where: { id: +id },
      include: { items: true },
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.customerId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: Not your order' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});