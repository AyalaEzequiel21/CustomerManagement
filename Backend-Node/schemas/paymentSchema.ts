import { z } from "zod";
import { EPaymentMethod } from "../enums/EPaymentMethod";

// PAYMENT

export const paymentRegistrationSchema = z.object({
    clientId: z.string(),
    amount: z.number().refine(value => value > 0, {message: "The amount must be more that 0"}), 
    payment_method: z.nativeEnum(EPaymentMethod),
    saleId: z.string().optional(),
    reportId: z.string().optional()
})

export type PaymentRegister = z.infer<typeof paymentRegistrationSchema>

// PAYMENT MONGO 

export const paymentMongoSchema = paymentRegistrationSchema.extend({
    _id: z.string()
})

export type PaymentMongo = z.infer<typeof paymentMongoSchema>