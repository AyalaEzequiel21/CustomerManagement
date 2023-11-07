import { parse, isDate, isBefore, isToday } from 'date-fns';
import es from 'date-fns/locale/es'; // Importa el locale para español

export const isValidDateFormat = (date: string): boolean => {
    const dateFormatRegex = /^\d{2}\/\d{2}\/\d{4}$/ // FORMAT MUST BE A DATE 
    if (!dateFormatRegex.test(date)) {
        return false;
    }

    const parsedDate = parse(date, 'dd/MM/yyyy', new Date(), { locale: es }); // Utiliza el locale 'es' para español

    return isDate(parsedDate) && isBefore(parsedDate, new Date()) && (isToday(parsedDate) || isBefore(parsedDate, new Date()));
}

export const formatDateIso = (dateString: Date) => {
    const date = new Date(dateString)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    const formattedDate = `${day}/${month}/${year}`
    return formattedDate
}