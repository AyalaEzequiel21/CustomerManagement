import { z } from "zod";

// ORDER LIST

export const orderListRegistrationSchema = z.object({
    sales: z.array(z.string())
})

export type OrderListRegister = z.infer<typeof orderListRegistrationSchema>

// ORDER LIST MONGO

export const orderListMongoSchema = orderListRegistrationSchema.extend({
    _id: z.string(),
    order_date: z.string().optional(),
    order_status: z.string()
})

export type OrderListMongo = z.infer<typeof orderListMongoSchema>