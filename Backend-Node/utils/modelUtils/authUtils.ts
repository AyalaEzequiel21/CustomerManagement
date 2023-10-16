import UserModel from "../../models/user"

// check if an email has already been registered
export const existingEmail = async (email:string) => {
    let response = false
    const userId = await UserModel.exists({email: email})
    if(userId){
        response = true
    }
    return response
}