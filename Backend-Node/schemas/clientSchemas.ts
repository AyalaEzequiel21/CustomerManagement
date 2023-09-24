import { z } from "zod";
import { ECategory } from "../enums/ECategory";


// CLIENT 

export const clientRegistrationSchema = z.object({
    fullname: z.string().min(3).max(25),
    phone: z.string().min(8).max(15),
    category: z.nativeEnum(ECategory),
    in_delivery: z.boolean()
})

export type ClientRegister = z.infer<typeof clientRegistrationSchema>

//  CLIENT MONGO

export const clientMongoSchema = clientRegistrationSchema.extend({
    _id: z.string(),
    register_date: z.string().optional(),
    balance: z.number().optional(),
    sales: z.array(z.string()).optional(),
    payments: z.array(z.string()).optional(),
    is_active: z.boolean()
})

export type ClientMongo = z.infer<typeof clientMongoSchema>