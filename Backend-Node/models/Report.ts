import mongoose, { Schema, model } from "mongoose";
import { EReportStatus } from "../enums/EReportStatus";
import { formatDateIso } from "../utils/dateUtils";

const reportSchema = new Schema({
    report_date: {type: String, default: formatDateIso(new Date())},
    payments: [{type: mongoose.Schema.Types.ObjectId, ref: "Payment" }],
    report_status: {type: String, enum: EReportStatus, default: EReportStatus.Pendiente}
})

const ReportModel = model("Report", reportSchema, "reports")

export default ReportModel