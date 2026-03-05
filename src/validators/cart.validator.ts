import { z } from "zod";

export const addToCartSchema = z.object({
  body: z.object({
    productId:  z.number().int().min(1),
    quantity: z.number().int().min(1),
  }),
});

export const updateCartSchema = z.object({
  body: z.object({
    productId: z.string().length(24),
    quantity: z.number().int().min(1),
  }),
});