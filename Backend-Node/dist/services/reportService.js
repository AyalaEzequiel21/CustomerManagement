"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroyReport = exports.getReportValidated = exports.getReportUpdated = exports.searchReportByDate = exports.reportsPending = exports.reportsValidated = exports.getReports = exports.createReport = void 0;
const connect_1 = require("../db/connect");
const EReportStatus_1 = require("../enums/EReportStatus");
const customErrors_1 = require("../errors/customErrors");
const errorMessages_1 = require("../errors/errorMessages");
const errorsPitcher_1 = require("../errors/errorsPitcher");
const report_1 = __importDefault(require("../models/report"));
const dateUtils_1 = require("../utils/dateUtils");
const existingChecker_1 = require("../utils/existingChecker");
const reportUtils_1 = require("../utils/modelUtils/reportUtils"); //  REPORT UTILS
/////////////////////////
// REPORT SERVICE
///////////////////////
const createReport = (newReport) => __awaiter(void 0, void 0, void 0, function* () {
    const { payments_dto } = newReport; // GET THE PAYMENTS LIST FROM THE NEW REPORT
    if ((0, existingChecker_1.isEmptyList)(payments_dto)) { // IF THE PAYMENTS IS EMPTY RUN AN EXCEPTION
        throw new customErrors_1.BadRequestError(errorMessages_1.BadRequest);
    }
    try {
        const reportCreated = yield report_1.default.create({
            payments_dto: payments_dto
        });
        if (!reportCreated) { // IF NOT EXIST REPORT RUN AN EXCEPTION
            throw new customErrors_1.InternalServerError(errorMessages_1.InternalServer);
        }
        return reportCreated; // RETURN THE REPORT CREATED
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.createReport = createReport;
const getReports = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reportsSaved = yield report_1.default.find(); // GET ALL REPORTS
        if ((0, existingChecker_1.isEmptyList)(reportsSaved)) {
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.ReportNotFound); // IF THE REPORTS SAVED ARE EMPTY RUN AN EXCEPTION
        }
        return reportsSaved; // RETURN THE REPORTS SAVED
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.getReports = getReports;
const reportsValidated = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reportsValidated = yield report_1.default.find({ report_status: EReportStatus_1.EReportStatus.Validado }); // FIND ALL VALIDATED REPORTS
        if ((0, existingChecker_1.isEmptyList)(reportsValidated)) {
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.ReportNotFound); // IF THE REPORTS SAVED ARE EMPTY RUN AN EXCEPTION
        }
        return reportsValidated; // RETURN THE REPORTS VALIDATED
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.reportsValidated = reportsValidated;
const reportsPending = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reportsPending = yield report_1.default.find({ report_status: EReportStatus_1.EReportStatus.Pendiente }); // FIND ALL PENDING REPORTS
        if ((0, existingChecker_1.isEmptyList)(reportsPending)) {
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.ReportNotFound); // IF THE REPORTS SAVED ARE EMPTY RUN AN EXCEPTION
        }
        return reportsPending; // RETURN THE REPORTS VALIDATED
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.reportsPending = reportsPending;
const searchReportByDate = (reportDate) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, dateUtils_1.isValidDateFormat)(reportDate)) { // CHECK IF DATE IS VALID OR RUN AN EXCEPTION
        throw new customErrors_1.BadRequestError(errorMessages_1.BadRequest);
    }
    try {
        const reports = yield report_1.default.find({ report_date: reportDate }).exec(); // SEARCH REPORTS WITH THE SAME REPORT DATE
        if ((0, existingChecker_1.isEmptyList)(reports)) { // IF REPORTS IS EMPTY RUN AN EXCEPTION
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.ReportNotFound);
        }
        return reports; // RETURNS THE REPORTS
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.searchReportByDate = searchReportByDate;
const getReportUpdated = (report) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reportSaved = yield report_1.default.findById(report._id); // GET THE REPORT SAVED BY ID
        if (!reportSaved || reportSaved.report_status === EReportStatus_1.EReportStatus.Validado) { // IF THE REPORT NOT EXISTS OR HIS STATUS IS VALIDATED THEN RUN AN EXCEPTION
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.ReportNotFound);
        }
        if ((0, existingChecker_1.isEmptyList)(report.payments_dto)) {
            throw new customErrors_1.BadRequestError(errorMessages_1.BadRequest);
        }
        reportSaved.payments_dto = report.payments_dto; // ELSE ONLY UPDATE THE PAYMENTS DTO 
        const reportUpdated = yield reportSaved.save(); // SAVE THE REPORT UPDATED AND RETURN IT
        return reportUpdated;
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.getReportUpdated = getReportUpdated;
const getReportValidated = (reportId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield (0, connect_1.startSession)();
    try {
        session.startTransaction();
        const reportSaved = yield report_1.default.findById(reportId).exec(); // FIND THE REPORT BY HIS ID
        if (!reportSaved || reportSaved.report_status === EReportStatus_1.EReportStatus.Validado) { // IF THE REPORT EXISTS AND HIS STATUS IS PENDIENTE THEN PROCESS THE PAYMENTS
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.ReportNotFound);
        }
        const paymentsProcessed = yield (0, reportUtils_1.processPaymentsReport)(reportSaved.payments_dto, reportSaved._id, session); // WITH REPORT UTILS
        if ((0, existingChecker_1.isEmptyList)(paymentsProcessed)) {
            throw new customErrors_1.InternalServerError(errorMessages_1.Conflict);
        }
        reportSaved.payments = paymentsProcessed;
        reportSaved.payments_dto = []; // RESET THE PAYMENTS_DTO 
        reportSaved.report_status = EReportStatus_1.EReportStatus.Validado; // MODIFY STATUS TO VALIDATE
        const reportValidated = yield reportSaved.save({ session }); // SAVE THE REPORT WITH THE PAYMENTS PROCESSED AND RETURN IT
        yield session.commitTransaction(); //  CONFIRM TRANSACTION
        return reportValidated;
    }
    catch (error) {
        yield session.abortTransaction();
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
    yield session.endSession();
});
exports.getReportValidated = getReportValidated;
const destroyReport = (reportId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const report = yield report_1.default.findById(reportId).exec();
        if (!report || report.report_status === EReportStatus_1.EReportStatus.Validado) {
            throw new customErrors_1.ResourceNotFoundError(errorMessages_1.ReportNotFound);
        }
        yield report_1.default.deleteOne({ _id: reportId });
    }
    catch (error) {
        (0, errorsPitcher_1.errorsPitcher)(error);
    }
});
exports.destroyReport = destroyReport;
