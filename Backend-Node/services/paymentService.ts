import { BadRequestError, ResourceNotFoundError } from "../errors/customErrors";
import { BadRequest, ClientNotFound, PaymentNotFound } from "../errors/errorMessages";
import { errorsPitcher } from "../errors/errorsPitcher";
import PaymentModel from "../models/payment";
import { PaymentRegister } from "../schemas/paymentSchema";
import { addPaymentToClient, findClientById, isValidPaymentMethod, subtractPaymentToClient, validateId } from "../utils/modelUtils/paymentUtils"; // PAYMENTS UTILS
import { isValidDateFormat } from "../utils/dateUtils";
import { isEmptyList } from "../utils/existingChecker";
import { startSession } from "../db/connect";


/////////////////////////
// PAYMENT SERVICE
///////////////////////

export const createPayment = async (newPayment: PaymentRegister) => {    
    const {clientId, amount, payment_method, saleId, reportId} = newPayment // GET ALL ATTRIBUTES TO CREATE A PAYMENT
    const session = await startSession() // START A SESSION FOR THE TRANSACTION
    try{
        session.startTransaction()
        const client = await findClientById(clientId, session) // GET THE CLIENT OF PAYMENT BY HIS ID WITH PAYMENTS UTILS
        if(client){ // IF CLIENT EXISTS THEN CREATED THE PAYMENT
            const paymentData = { // CREATE THE PAYMENT DATA
                clientId: clientId, 
                amount: amount,
                payment_method: payment_method, 
                saleId: saleId || undefined,
                reportId: reportId || undefined
            }
            const paymentCreated = await PaymentModel.create([paymentData], {session}) // CREATE THE PAYMENT WITH PAYMENT DATA AND SESSION
            if(!paymentCreated[0]){ // We use position 0 because only one payment will be created
                throw new BadRequestError(BadRequest) // IF PAMETN NOT EXISTS RUN AN EXCEPTION
            }
            await addPaymentToClient(client, paymentCreated[0], session) // ADD THE PAYMENT TO CLIENT AND UPDATE HIS BALANCE WITH PAYMENT UTILS
            await session.commitTransaction() // CONFIRM TRANSACTION
            return paymentCreated // RETURNS THE PAYMENT CREATED
        }
    } catch (error){
        await session.abortTransaction()
        errorsPitcher(error)
    } 
    await session.endSession() // END THE SESSION
}


export const deletePaymentById = async (paymentId: string) => {
    if (!validateId(paymentId)){ // CHECK IF PAYMENTID IS VALID WITH PAYMENTUTILS OR RUN AN EXCEPTION
        throw new BadRequestError(BadRequest)
    }
    const session = await startSession() // START A SESSION FOR THE TRANSACTION
    try {
        session.startTransaction()
        const existsPayment = await PaymentModel.findById(paymentId).exec() // SEARCH THE PAYMENT
        if(!existsPayment){ // CHECK IF EXISTS OR RUN AN EXCEPTION
            throw new ResourceNotFoundError(PaymentNotFound)
        }
        const client = await findClientById(existsPayment.clientId) // SEARCH THE CLIENT OF PAYMENT
        if(!client){ // IF NOT EXIST RUN AN EXCEPTION
            throw new ResourceNotFoundError(ClientNotFound)
        }
        await subtractPaymentToClient(client, existsPayment._id, session) // REMOVE THE PAYMENT FROM TE CLIENT AND UPDATE HIS BALANCE WITH PAYMENTUTILS
        await PaymentModel.findByIdAndDelete(existsPayment._id).session(session) // DELETE THE PAYMENT FROM TO DATA BASE
        await session.commitTransaction() // CONFIRM TRANSACTION
    } catch (error){
        await session.abortTransaction()
        errorsPitcher(error)
    }
    await session.endSession()
}

export const allPayments = async () => {
    try{
        const payments = await PaymentModel.find() //  GET ALL PAYMENTS
        if(isEmptyList(payments)){ // CHECK IF THE RESPONSE IS EMPTY AND RUN AN EXCEPTION
            throw new ResourceNotFoundError(PaymentNotFound)
            // return []
        }
        return payments // RETURN THE PAYMENTS
    } catch (error){
        errorsPitcher(error)
    }
}

export const getPaymentsByClientId = async (clientId: string) => {
    if(!validateId(clientId)){ // CHECK IF ID IS VALID WITH PAYMENTUTILS
        throw new BadRequestError(BadRequest)
    } 
    try {
        const payments = await PaymentModel.find({clientId: clientId}) //  GET ALL PAYMENTS FROM A CLIENT BY HIS ID
        
        if(isEmptyList(payments)){ //CHECK IF THE RESPONSE IS EMPTY  AND RUN AN EXCEPTION
            throw new ResourceNotFoundError(PaymentNotFound)
        }
        return payments // RETURN THE PAYMENTS
    } catch (error){
        errorsPitcher(error)
    }
}

export const getPaymentsByPaymentMethod = async (paymentMethod: string) => {
    if(!isValidPaymentMethod(paymentMethod)){  // CHECK IF PAYMENTmEHOD IS VALID WITH PAYMENTUTILS OR RUN AN EXCEPTION 
        throw new BadRequestError(BadRequest)
    }
    try {
        const payments = await PaymentModel.find({payment_method: paymentMethod}) //  GET ALL PAYMENTS FILTERED BY PAYMENT_METHOD
        
        if(isEmptyList(payments)){ //CHECK IF THE RESPONSE IS EMPTY  AND RUN AN EXCEPTION
            throw new ResourceNotFoundError(PaymentNotFound)
        }
        return payments // RETURN THE PAYMENTS
    } catch (error){
        errorsPitcher(error)
    }
}

export const getPaymentsByPaymentDate = async (paymentDate: string) => {
    if(!isValidDateFormat(paymentDate)){  // CHECK IF PAYMENTmEHOD IS VALID OR RUN AN EXCEPTION
        throw new BadRequestError(BadRequest)
    }
    try {
        const payments = await PaymentModel.find({payment_date: paymentDate}) //  GET ALL PAYMENTS FILTERED BY PAYMENT_DATE

        if(isEmptyList(payments)){ //CHECK IF THE RESPONSE IS EMPTY  AND RUN AN EXCEPTION
            throw new ResourceNotFoundError(PaymentNotFound)
        }
        return payments // RETURN THE PAYMENTS
    } catch (error){
        errorsPitcher(error)
    }
}