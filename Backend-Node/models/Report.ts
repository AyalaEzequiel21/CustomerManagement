import mongoose, { Schema, model } from "mongoose";
import { EReportStatus } from "../enums/EReportStatus";

const reportSchema = new Schema({
    report_date: {type: Date, default: Date.now()},
    payments: [{type: mongoose.Schema.Types.ObjectId, ref: "Payment" }],
    report_status: {type: String, enum: EReportStatus, default: EReportStatus.Pendiente}
})

const ReportModel = model("Reportd", reportSchema, "reports")

export default ReportModel