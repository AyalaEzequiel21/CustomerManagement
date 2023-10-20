import { z } from "zod";
import { paymentRegistrationSchema } from "./paymentSchema";
import { paymentDTOSchema } from "./dtos/paymentDTOSchema";

// REPORT 

export const reportRegistrationSchema = z.object({
    payments: z.array(paymentRegistrationSchema).optional(), 
    payments_dto : z.array(paymentDTOSchema)
})

export type ReportRegister = z.infer<typeof reportRegistrationSchema>

// REPORT MONGO 

export const reportMongoSchema = reportRegistrationSchema.extend({
    _id: z.string(),
    report_date: z.string().optional(),
    report_status: z.string()
})

export type ReportMongo = z.infer<typeof reportMongoSchema>