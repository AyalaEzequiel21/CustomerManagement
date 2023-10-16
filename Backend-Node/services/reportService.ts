import { BadRequestError, ResourceNotFoundError } from "../errors/customErrors"
import { BadRequest, PaymentNotFound } from "../errors/errorMessages"
import { errorsPitcher } from "../errors/errorsPitcher"
import ReportModel from "../models/report"
import { ReportMongo, ReportRegister } from "../schemas/reportSchema"
import { isEmptyList } from "../utils/existingChecker"
import { isValidPaymentDto } from "../utils/modelUtils/reportUtils"

/////////////////////////
// REPORT SERVICE
///////////////////////

export const createReport = async (newReport: ReportRegister) => {
    const {payments} = newReport // GET THE PAYMENTS LIST FROM THE NEW REPORT
    if (isEmptyList(payments)){ // IF THE PAYMENTS IS EMPTY RUN AN EXCEPTION
        throw new ResourceNotFoundError(PaymentNotFound)
    }
    
    try{
        const reportCreated = await ReportModel.create({ // CREATE THE REPORT
            payments: payments
        })
        return reportCreated // RETURN THE REPORT CREATED
    } catch(error){
        console.log(error);
        
        errorsPitcher(error)
    }
}

export const getReports = async () => {

}

export const reportUpdate = async (report: ReportMongo) => {

}