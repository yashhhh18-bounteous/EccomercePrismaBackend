import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

/**
 * CREATE ORDER FROM CART
 */
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { paymentMethod, shippingAddress } = req.body;

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user!.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = cart.items.reduce((sum: number, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    const expectedDelivery = new Date();
    expectedDelivery.setDate(expectedDelivery.getDate() + 5);

    const order = await prisma.$transaction(async (tx) => {

      const newOrder = await tx.order.create({
        data: {
          userId: req.user!.id,
          paymentMethod,
          shippingAddress,
          expectedDelivery,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              totalPrice: item.product.price * item.quantity
            }))
          }
        },
        include: {
          items: true
        }
      });

      // clear cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      return newOrder;
    });

    res.status(201).json(order);

  } catch (error) {
    res.status(500).json({ message: "Failed to create order", error });
  }
};

/**
 * GET MY ORDERS
 */
export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {

    const orders = await prisma.order.findMany({
      where: { userId: req.user!.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(orders);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};

/**
 * GET SINGLE ORDER
 */
export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {

    const order = await prisma.order.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.userId !== req.user!.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(order);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order", error });
  }
};