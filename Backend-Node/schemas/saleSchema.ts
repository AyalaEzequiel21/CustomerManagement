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
    details: z.array(detailSaleSchema),
    totalSale: z.number(),
    // payment: z.

})