import { z } from "zod";


// PRODUCT

export const productRegistrationSchema = z.object({
    productName: z.string().min(3).max(25),
    price_cat_1: z.number().refine(value => value > 0, {message: "The price must be more that 0"}),
    price_cat_2: z.number().refine(value => value > 0, {message: "The price must be more that 0"})
})

export type ProductRegister = z.infer<typeof productRegistrationSchema>

// PRODUCT MONGO

export const productMongoSchema = productRegistrationSchema.extend({
    _id: z.string(),
    is_active: z.boolean()
})

export type ProductMongo = z.infer<typeof productMongoSchema>