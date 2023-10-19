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

export const getAllReports = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const reports = await reportService.getReports() // GET THE ALL REPORTS WITH REPORTSERVICE
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

