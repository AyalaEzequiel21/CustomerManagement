import { z } from "zod";
import { ERole } from "../enums/ERole";

// USER

export const userRegistrationSchema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().length(8),
    role: z.nativeEnum(ERole)
})

export type User = z.infer<typeof userRegistrationSchema>


// USER MONGO

export const userMongoSchema = userRegistrationSchema.extend({
    _id: z.string()
})

export type UserMongo = z.infer<typeof userMongoSchema>

// USER COOKIE

export const userCookieSchema = z.object({
    sub: z.string(),
    role:z.nativeEnum(ERole)
})

export type UserCookie = z.infer<typeof userCookieSchema>