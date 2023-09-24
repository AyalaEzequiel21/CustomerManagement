import {format} from "date-fns"

export const formatDate = (date: Date) => {
    const formattedDate = format(date, "yyyy/MM/dd")
    return formattedDate
}