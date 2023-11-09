import * as reportService from "../services/reportService"
import { NextFunction, Request, Response } from "express"

/////////////////////////
// REPORT CONTROLLER
///////////////////////

export const registerReport = async (req: Request, res: Response, next: NextFunction) => {
    const report = req.body // GET THE REPORT FROM THE REQUEST
    try{
        const newReport = await reportService.createReport(report)  // CREATE THE NEW REPORT WITH REPORTSERVICE
        res.status(201).json({ok: true, data: newReport}) // RETURNS STATUS 201 AND THE NEW REPORT
    } catch(error){        
        next(error)
    }
}

export const getAllReports = async (req: any, res: Response, next: NextFunction) => {
    try{
        const reports = await reportService.getReports() // GET THE ALL REPORTS WITH REPORTSERVICE
        res.status(200).json({ok: true, data: reports}) // RETURNS STATUS 200 AND THE REPORTS
    } catch(error){
        next(error)
    }
}

export const getAllValidatedReports = async (req: any, res: Response, next: NextFunction) => {
    try {
        const reportsValidated = await reportService.reportsValidated() // GET THE ALL VALIDATED REPORTS WITH REPORTSERVICE
        res.status(200).json({ok: true, data: reportsValidated}) // RETURNS STATUS 200 AND THE REPORTS
    } catch(error){
        next(error)
    }
}

export const getAllPendingReports = async (req: any, res: Response, next: NextFunction) => {
    try {
        const reportsPending = await reportService.reportsPending() // GET THE ALL PENDING REPORTS WITH REPORTSERVICE
        res.status(200).json({ok: true, data: reportsPending}) // RETURNS STATUS 200 AND THE REPORTS
    } catch(error){
        next(error)
    }
}

export const getReportsByDate = async (req: any, res: Response, next: NextFunction) => {
    const {date} = req.query // GET THE REPORT DATE FROM THE PARAMS QUERY
    try {
        const reports = await reportService.searchReportByDate(date) // GET ALL REPORTS FROM THAT DATE
        res.status(200).json({ok: true, data: reports}) // RETURNS STATUS 200 AND THE REPORTS
    } catch(error){
        next(error)
    }
}

export const updateReport = async (req: Request, res: Response, next: NextFunction) => {
    const report = req.body // GET THE REPORT TO UPDATE FROM THE REQUEST
    try{
        const reportUpdated = await reportService.getReportUpdated(report) // UPDATE THE REPORT WITH REPORTSERVICE
        res.status(200).json({ok: true, data: reportUpdated})  // RETURNS STATUS 200 AND THE REPROT UPDATED
    } catch(error){        
        next(error)
    }
}

export const validateReport = async (req: Request, res: Response, next: NextFunction) => {
    const reportId = req.params.reportId // GET THE REPORT TO VALIDATE FROM THE REQUEST
    try{
        const reportValidated = await reportService.getReportValidated(reportId) // VALIDATE THE REPORT WITH REPORTSERVICE
        res.status(200).json({ok: true, data: reportValidated}) // RETURNS STATUS 200 AND TH REPORT VALIDATED
    } catch(error){
        next(error)
    } 
}

export const deleteReport = async (req: Request, res: Response, next: NextFunction) => {
    const reportId = req.params.reportId // GET THE REPORT TO DELETE FROM THE REQUEST
    try{
        await reportService.destroyReport(reportId) // DELETE REPORT WITH REPORT SERVICE
        res.status(204).json({ok: true}) // RETURNS STATUS 204 AND OK: TRUE
    } catch(error){
        next(error)
    } 
}

