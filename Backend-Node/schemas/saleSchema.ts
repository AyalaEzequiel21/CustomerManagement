import { z } from "zod"
import { paymentDTOSchema } from "./dtos/paymentDTOSchema"

// DETAIL SALE

export const detailSaleSchema = z.object({
    product: z.string(),
    quantity: z.number().refine( value => value > 0, {message: "The amount must be more that 0"}),
    partialResult: z.number().refine( value => value > 0, {message: "The amount must be more that 0"})
})

export type DetailSale = z.infer<typeof detailSaleSchema>


// SALE

export const saleRegistrationSchema = z.object({
    clientId: z.string().optional(),
    clientName: z.string(),
    details: z.array(detailSaleSchema),
    totalSale: z.number().optional(),
    payment_dto: paymentDTOSchema.optional(),
    payment: z.string().optional()
})

export type SaleRegister = z.infer<typeof saleRegistrationSchema>

// SALE MONGO

export const saleMongoSchema = saleRegistrationSchema.extend({
    _id: z.string(),
    sale_date: z.string()
})

export type SaleMongo = z.infer<typeof saleMongoSchema>