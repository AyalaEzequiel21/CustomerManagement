"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDateIso = exports.isValidDateFormat = void 0;
const date_fns_1 = require("date-fns");
const es_1 = __importDefault(require("date-fns/locale/es")); // Importa el locale para español
const isValidDateFormat = (date) => {
    const dateFormatRegex = /^\d{2}\/\d{2}\/\d{4}$/; // FORMAT MUST BE A DATE 
    if (!dateFormatRegex.test(date)) {
        return false;
    }
    const parsedDate = (0, date_fns_1.parse)(date, 'dd/MM/yyyy', new Date(), { locale: es_1.default }); // Utiliza el locale 'es' para español
    return (0, date_fns_1.isDate)(parsedDate) && (0, date_fns_1.isBefore)(parsedDate, new Date()) && ((0, date_fns_1.isToday)(parsedDate) || (0, date_fns_1.isBefore)(parsedDate, new Date()));
};
exports.isValidDateFormat = isValidDateFormat;
const formatDateIso = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
};
exports.formatDateIso = formatDateIso;
