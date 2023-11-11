"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReport = exports.validateReport = exports.updateReport = exports.getReportsByDate = exports.getAllPendingReports = exports.getAllValidatedReports = exports.getAllReports = exports.registerReport = void 0;
const reportService = __importStar(require("../services/reportService"));
/////////////////////////
// REPORT CONTROLLER
///////////////////////
const registerReport = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const report = req.body; // GET THE REPORT FROM THE REQUEST
    try {
        const newReport = yield reportService.createReport(report); // CREATE THE NEW REPORT WITH REPORTSERVICE
        res.status(201).json({ ok: true, data: newReport }); // RETURNS STATUS 201 AND THE NEW REPORT
    }
    catch (error) {
        next(error);
    }
});
exports.registerReport = registerReport;
const getAllReports = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reports = yield reportService.getReports(); // GET THE ALL REPORTS WITH REPORTSERVICE
        res.status(200).json({ ok: true, data: reports }); // RETURNS STATUS 200 AND THE REPORTS
    }
    catch (error) {
        next(error);
    }
});
exports.getAllReports = getAllReports;
const getAllValidatedReports = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reportsValidated = yield reportService.reportsValidated(); // GET THE ALL VALIDATED REPORTS WITH REPORTSERVICE
        res.status(200).json({ ok: true, data: reportsValidated }); // RETURNS STATUS 200 AND THE REPORTS
    }
    catch (error) {
        next(error);
    }
});
exports.getAllValidatedReports = getAllValidatedReports;
const getAllPendingReports = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reportsPending = yield reportService.reportsPending(); // GET THE ALL PENDING REPORTS WITH REPORTSERVICE
        res.status(200).json({ ok: true, data: reportsPending }); // RETURNS STATUS 200 AND THE REPORTS
    }
    catch (error) {
        next(error);
    }
});
exports.getAllPendingReports = getAllPendingReports;
const getReportsByDate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { date } = req.query; // GET THE REPORT DATE FROM THE PARAMS QUERY
    try {
        const reports = yield reportService.searchReportByDate(date); // GET ALL REPORTS FROM THAT DATE
        res.status(200).json({ ok: true, data: reports }); // RETURNS STATUS 200 AND THE REPORTS
    }
    catch (error) {
        next(error);
    }
});
exports.getReportsByDate = getReportsByDate;
const updateReport = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const report = req.body; // GET THE REPORT TO UPDATE FROM THE REQUEST
    try {
        const reportUpdated = yield reportService.getReportUpdated(report); // UPDATE THE REPORT WITH REPORTSERVICE
        res.status(200).json({ ok: true, data: reportUpdated }); // RETURNS STATUS 200 AND THE REPROT UPDATED
    }
    catch (error) {
        next(error);
    }
});
exports.updateReport = updateReport;
const validateReport = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const reportId = req.params.reportId; // GET THE REPORT TO VALIDATE FROM THE REQUEST
    try {
        const reportValidated = yield reportService.getReportValidated(reportId); // VALIDATE THE REPORT WITH REPORTSERVICE
        res.status(200).json({ ok: true, data: reportValidated }); // RETURNS STATUS 200 AND TH REPORT VALIDATED
    }
    catch (error) {
        next(error);
    }
});
exports.validateReport = validateReport;
const deleteReport = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const reportId = req.params.reportId; // GET THE REPORT TO DELETE FROM THE REQUEST
    try {
        yield reportService.destroyReport(reportId); // DELETE REPORT WITH REPORT SERVICE
        res.status(204).json({ ok: true }); // RETURNS STATUS 204 AND OK: TRUE
    }
    catch (error) {
        next(error);
    }
});
exports.deleteReport = deleteReport;
