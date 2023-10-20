import { z } from "zod";
import { EPaymentMethod } from "../../enums/EPaymentMethod";

export const paymentDTOSchema = z.object({
    clientId: z.string(),
    amount: z.number().refine(value => value > 0, {message: "The amount must be more that 0"}), 
    payment_method: z.nativeEnum(EPaymentMethod)
})

export type TypePaymentDto = z.infer<typeof paymentDTOSchema>