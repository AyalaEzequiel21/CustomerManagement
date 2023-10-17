import { EReportStatus } from "../enums/EReportStatus"
import { BadRequestError, ResourceNotFoundError } from "../errors/customErrors"
import { BadRequest, PaymentNotFound, ReportNotFound } from "../errors/errorMessages"
import { errorsPitcher } from "../errors/errorsPitcher"
import ReportModel from "../models/report"
import { ReportMongo, ReportRegister } from "../schemas/reportSchema"
import { isEmptyList } from "../utils/existingChecker"
import { isValidPaymentDto } from "../utils/modelUtils/reportUtils"

/////////////////////////
// REPORT SERVICE
///////////////////////

export const createReport = async (newReport: ReportRegister) => {
    const {payments_dto} = newReport // GET THE PAYMENTS LIST FROM THE NEW REPORT
    if (isEmptyList(payments_dto)){ // IF THE PAYMENTS IS EMPTY RUN AN EXCEPTION
        throw new ResourceNotFoundError(PaymentNotFound)
    }
    try{
        const reportCreated = await ReportModel.create({ // CREATE THE REPORT
            payments_dto: payments_dto
        })
        return reportCreated // RETURN THE REPORT CREATED
    } catch(error){        
        errorsPitcher(error)
    }
}

export const getReports = async () => {
    try{
        const reportsSaved = await ReportModel.find() // GET ALL REPORTS
        if(isEmptyList(reportsSaved)){
            throw new ResourceNotFoundError(PaymentNotFound) // IF THE REPORTS SAVED ARE EMPTY RUN AN EXCEPTION
        }
        return reportsSaved // RETURN THE REPORTS SAVED
    } catch(error){
        errorsPitcher(error)
    }
}

export const reportUpdate = async (report: ReportMongo) => {
    try {
        const reportSaved = await ReportModel.findById(report._id)  // GET THE REPORT SAVED BY ID
        if(reportSaved && reportSaved.report_status  === EReportStatus.Pendiente){ // IF THE REPORT EXISTS AND HIS STATUS IS PENDIENTE UPDATE THE REPORT 
            reportSaved.payments_dto = report.payments_dto
        } else {
            throw new ResourceNotFoundError(ReportNotFound)
        }
        const reportUpdated = await reportSaved.save() // SAVE THE REPORT UPODATED AND RETURN
        return reportUpdated
    } catch(error){
        errorsPitcher(error)
    }
}