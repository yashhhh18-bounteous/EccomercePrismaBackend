import { z } from "zod";
export const createProductSchema = z.object({
    body: z.object({
        title: z.string().min(2),
        description: z.string().min(5),
        price: z.number().positive(),
        image: z.string().url(),
        stock: z.number().int().min(0),
    }),
});
