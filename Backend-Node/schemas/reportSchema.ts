import { z } from "zod";

// REPORT 

export const reportRegistrationSchema = z.object({
    payments: z.array(z.string())
})

export type ReportRegister = z.infer<typeof reportRegistrationSchema>

// REPORT MONGO 

export const reportMongoSchema = reportRegistrationSchema.extend({
    _id: z.string(),
    report_date: z.string().optional(),
    report_status: z.boolean()
})

export type ReportMongo = z.infer<typeof reportMongoSchema>