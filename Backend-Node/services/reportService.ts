import { startSession } from "../db/connect"
import { EReportStatus } from "../enums/EReportStatus"
import { BadRequestError, InternalServerError, ResourceNotFoundError } from "../errors/customErrors"
import { BadRequest, Conflict, InternalServer, PaymentNotFound, ReportNotFound } from "../errors/errorMessages"
import { errorsPitcher } from "../errors/errorsPitcher"
import ReportModel from "../models/report"
import { ReportMongo, ReportRegister } from "../schemas/reportSchema"
import { isEmptyList } from "../utils/existingChecker"
import { processPaymentsReport } from "../utils/modelUtils/reportUtils" //  REPORT UTILS

/////////////////////////
// REPORT SERVICE
///////////////////////

export const createReport = async (newReport: ReportRegister) => {
    const {payments_dto} = newReport // GET THE PAYMENTS LIST FROM THE NEW REPORT
    if (isEmptyList(payments_dto)){ // IF THE PAYMENTS IS EMPTY RUN AN EXCEPTION
        throw new BadRequestError(BadRequest)
    }
    try{
        const reportCreated = await ReportModel.create({ // CREATE THE REPORT
            payments_dto: payments_dto
        })
        if(!reportCreated){ // IF NOT EXIST REPORT RUN AN EXCEPTION
            throw new InternalServerError(InternalServer)
        }
        return reportCreated // RETURN THE REPORT CREATED
    } catch(error){        
        errorsPitcher(error)
    }
}

export const getReports = async () => { // all reports
    try{
        const reportsSaved = await ReportModel.find() // GET ALL REPORTS
        if(isEmptyList(reportsSaved)){
            throw new ResourceNotFoundError(ReportNotFound) // IF THE REPORTS SAVED ARE EMPTY RUN AN EXCEPTION
        }
        return reportsSaved // RETURN THE REPORTS SAVED
    } catch(error){
        errorsPitcher(error)
    }
}

export const reportsValidated = async () => { // all reports validated
    try {
        const reportsValidated = await ReportModel.find({report_status: EReportStatus.Validado}) // FIND ALL VALIDATED REPORTS
        if(isEmptyList(reportsValidated)){
            throw new ResourceNotFoundError(ReportNotFound) // IF THE REPORTS SAVED ARE EMPTY RUN AN EXCEPTION
        }
        return reportsValidated // RETURN THE REPORTS VALIDATED
    }catch (error){
        errorsPitcher(error)
    }
}

export const reportsPending = async () => { // all reports pending
    try {
        const reportsPending = await ReportModel.find({report_status: EReportStatus.Pendiente}) // FIND ALL PENDING REPORTS
        if(isEmptyList(reportsPending)){
            throw new ResourceNotFoundError(ReportNotFound) // IF THE REPORTS SAVED ARE EMPTY RUN AN EXCEPTION
        }
        return reportsPending // RETURN THE REPORTS VALIDATED
    }catch (error){
        errorsPitcher(error)
    }
}

export const getReportUpdated = async (report: ReportMongo) => { // update report
    try {
        const reportSaved = await ReportModel.findById(report._id)  // GET THE REPORT SAVED BY ID
        if(!reportSaved || reportSaved.report_status === EReportStatus.Validado){ // IF THE REPORT NOT EXISTS OR HIS STATUS IS VALIDATED THEN RUN AN EXCEPTION
            throw new ResourceNotFoundError(ReportNotFound)
        } 
        if(isEmptyList(report.payments_dto)){
            throw new BadRequestError(BadRequest)
        }
        reportSaved.payments_dto = report.payments_dto // ELSE ONLY UPDATE THE PAYMENTS DTO 
        const reportUpdated = await reportSaved.save() // SAVE THE REPORT UPDATED AND RETURN IT
        return reportUpdated
    } catch(error){        
        errorsPitcher(error)
    }
}

export const getReportValidated = async (reportId: string) => { // validate an report
    const session = await startSession()
    try{
        session.startTransaction()
        const reportSaved = await ReportModel.findById(reportId).exec() // FIND THE REPORT BY HIS ID
        if(!reportSaved || reportSaved.report_status === EReportStatus.Validado){ // IF THE REPORT EXISTS AND HIS STATUS IS PENDIENTE THEN PROCESS THE PAYMENTS
            throw new ResourceNotFoundError(ReportNotFound)
        }
        const paymentsProcessed = await processPaymentsReport(reportSaved.payments_dto, reportSaved._id, session) // WITH REPORT UTILS
        if(isEmptyList(paymentsProcessed)){
            throw new InternalServerError(Conflict)
        }
        reportSaved.payments = paymentsProcessed
        reportSaved.payments_dto = [] // RESET THE PAYMENTS_DTO 
        reportSaved.report_status = EReportStatus.Validado  // MODIFY STATUS TO VALIDATE
        const reportValidated = await reportSaved.save({session}) // SAVE THE REPORT WITH THE PAYMENTS PROCESSED AND RETURN IT
        await session.commitTransaction() //  CONFIRM TRANSACTION
        return reportValidated
    }catch(error){
        await session.abortTransaction()
        errorsPitcher(error)
    }
    await session.endSession()
}

export const destroyReport = async (reportId: string) => {
    try{
        const report = await ReportModel.findById(reportId).exec()
        if(!report || report.report_status === EReportStatus.Validado){
            throw new ResourceNotFoundError(ReportNotFound)
        }
        await ReportModel.deleteOne({_id: reportId})
    } catch(error){
        errorsPitcher(error)
    }
}