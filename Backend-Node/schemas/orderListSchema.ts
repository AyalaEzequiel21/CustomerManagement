import { z } from "zod";

// ORDER LIST

const detailOrder = z.object({
    saleId: z.string(),
    clientName: z.string(),
    totalSale: z.number().min(0.01)
})

export type DetailOrder = z.infer<typeof detailOrder>

export const orderListRegistrationSchema = z.object({
    sales: z.array(detailOrder)
})

export type OrderListRegister = z.infer<typeof orderListRegistrationSchema>

// ORDER LIST MONGO

export const orderListMongoSchema = orderListRegistrationSchema.extend({
    _id: z.string(),
    order_date: z.string().optional(),
    order_status: z.string()
})

export type OrderListMongo = z.infer<typeof orderListMongoSchema>