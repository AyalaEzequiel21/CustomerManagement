import { ERole } from "../../enums/ERole";

//
// USER INTERFACES ///////////////////////////////////////////
//

export interface User {
    username: string,
    email: string,
    password: string,
    role: ERole
}

export interface UserMongo extends User {
    _id: string
}