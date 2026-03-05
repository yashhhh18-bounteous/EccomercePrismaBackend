import { Response } from "express";
import {prisma} from "../lib/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

/**
 * GET USER CART
 */
export const getCart = async (req: AuthRequest, res: Response) => {
  try {

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

    if (!cart) {
      return res.json({ items: [], total: 0 });
    }

    const total = cart.items.reduce((sum: number, item: any) => {
  return sum + item.totalPrice;
}, 0);

    res.json({ cart, total });

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cart", error });
  }
};


/**
 * ADD ITEM TO CART
 */
export const addToCart = async (req: AuthRequest, res: Response) => {
  try {

    const { productId, quantity } = req.body;

    const product = await prisma.product.findUnique({
      where: { id: Number(productId) }
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await prisma.cart.findUnique({
      where: { userId: req.user!.id }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: req.user!.id
        }
      });
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: Number(productId)
        }
      }
    });

    if (existingItem) {

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity
        }
      });

    } else {

      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: Number(productId),
          quantity,
          totalPrice: product.price * quantity
        }
      });

    }

    res.json({ message: "Item added to cart" });

  } catch (error) {
    res.status(500).json({ message: "Failed to add to cart", error });
  }
};


/**
 * UPDATE ITEM QUANTITY
 */
export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {

    const { productId, quantity } = req.body;

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user!.id }
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: Number(productId)
        }
      }
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity }
    });

    res.json({ message: "Cart updated" });

  } catch (error) {
    res.status(500).json({ message: "Failed to update cart", error });
  }
};


/**
 * REMOVE ITEM FROM CART
 */
export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {

    const { productId } = req.params;

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user!.id }
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    await prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: Number(productId)
        }
      }
    });

    res.json({ message: "Item removed from cart" });

  } catch (error) {
    res.status(500).json({ message: "Failed to remove item", error });
  }
};