import { z } from "zod"

// DETAIL SALE

export const detailSaleSchema = z.object({
    productName: z.string(),
    quantity: z.number().refine( value => value > 0, {message: "The amount must be more that 0"}),
    partialResult: z.number()
})

// SALE

export const saleRegistrationSchema = z.object({
    clientId: z.string(),
    clientName: z.string(),
    details: z.array(detailSaleSchema),
    totalSale: z.number(),
    payment: z.string().optional()
})

export type SaleRegister = z.infer<typeof saleRegistrationSchema>

// SALE MONGO

export const saleMongoSchema = saleRegistrationSchema.extend({
    _id: z.string(),
    sale_date: z.string()
})

export type SaleMongo =z.infer<typeof saleMongoSchema>