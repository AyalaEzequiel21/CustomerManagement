import { EReportStatus } from "../enums/EReportStatus"
import { InternalServerError, ResourceNotFoundError } from "../errors/customErrors"
import { Conflict, PaymentNotFound, ReportNotFound } from "../errors/errorMessages"
import { errorsPitcher } from "../errors/errorsPitcher"
import ReportModel from "../models/report"
import { ReportMongo, ReportRegister } from "../schemas/reportSchema"
import { isEmptyList, processPaymentsReport } from "../utils"

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

export const reportsValidated = async () => {
    try {
        const reportsValidated = await ReportModel.find({report_status: EReportStatus.Validado}) // FIND ALL VALIDATED REPORTS
        if(isEmptyList(reportsValidated)){
            throw new ResourceNotFoundError(PaymentNotFound) // IF THE REPORTS SAVED ARE EMPTY RUN AN EXCEPTION
        }
        return reportsValidated // RETURN THE REPORTS VALIDATED
    }catch (error){
        errorsPitcher(error)
    }
}

export const reportsPending = async () => {
    try {
        const reportsPending = await ReportModel.find({report_status: EReportStatus.Pendiente}) // FIND ALL PENDING REPORTS
        if(isEmptyList(reportsPending)){
            throw new ResourceNotFoundError(PaymentNotFound) // IF THE REPORTS SAVED ARE EMPTY RUN AN EXCEPTION
        }
        return reportsPending // RETURN THE REPORTS VALIDATED
    }catch (error){
        errorsPitcher(error)
    }
}

export const getReportUpdated = async (report: ReportMongo) => {
    try {
        const reportSaved = await ReportModel.findById(report._id)  // GET THE REPORT SAVED BY ID
        if(reportSaved && reportSaved.report_status  === EReportStatus.Pendiente){ // IF THE REPORT EXISTS AND HIS STATUS IS PENDIENTE UPDATE THE REPORT 
            reportSaved.payments_dto = report.payments_dto
        } else {
            throw new ResourceNotFoundError(ReportNotFound)
        }
        const reportUpdated = await reportSaved.save() // SAVE THE REPORT UPODATED AND RETURN IT
        return reportUpdated
    } catch(error){        
        errorsPitcher(error)
    }
}

export const getReportValidated = async (reportId: string) => {
    try{
        const reportSaved = await ReportModel.findById(reportId) // FIND THE REPORT BY HIS ID
        if(reportSaved && reportSaved.report_status  === EReportStatus.Pendiente){ // IF THE REPORT EXISTS AND HIS STATUS IS PENDIENTE THEN PROCESS THE PAYMENTS
            const paymentsProcessed = await processPaymentsReport(reportSaved.payments_dto, reportSaved._id.toString())
            if(isEmptyList(paymentsProcessed)){
                throw new InternalServerError(Conflict)
            }
            reportSaved.payments = paymentsProcessed
            reportSaved.payments_dto = [] // RESET THE PAYMENTS_DTO 
            reportSaved.report_status = EReportStatus.Validado  // MODIFY STATUS TO VALIDATE
        } else {
            throw new ResourceNotFoundError(ReportNotFound)
        }
        const reportValidated = await reportSaved.save() // SAVE THE REPORT WITH THE PAYMENTS PROCESSED AND RETURN IT
        return reportValidated
    }catch(error){
        errorsPitcher(error)
    }
}