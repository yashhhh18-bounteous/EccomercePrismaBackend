import { z } from "zod";
export const createOrderSchema = z.object({
    body: z.object({
        paymentMethod: z.enum(["COD", "CARD"]),
        shippingAddress: z.object({
            fullName: z.string().min(2),
            phone: z.string().min(10),
            street: z.string().min(3),
            city: z.string().min(2),
            state: z.string().min(2),
            pincode: z.string().min(4),
            country: z.string().min(2),
        }),
    }),
});
