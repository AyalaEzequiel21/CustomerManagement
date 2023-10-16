import * as reportService from "../services/reportService"
import { NextFunction, Request, Response } from "express"

/////////////////////////
// REPORT CONTROLLER
///////////////////////

export const registerReport = async (req: Request, res: Response, next: NextFunction) => {
    const report = req.body // GET THE REPORT FROM THE REQUEST
    console.log(report)
    try{
        const newReport = await reportService.createReport(report)  // CREATE THE NEW REPORT WITH REPORTSERVICE
        res.status(201).json({ok: true, data: newReport}) // RETURNS STATUS 201 AND THE NEW REPORT
    } catch(error){
        console.log(error, "desde el controller");
        
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
        const reportUpdated = await reportService.reportUpdate(report) // UPDATE THE REPORT WITH REPORTSERVICE
        res.status(200).json({ok: true, data: reportUpdated})  // RETURNS STATUS 200 AND THE REPROT UPDATED
    } catch(error){
        next(error)
    }
}

