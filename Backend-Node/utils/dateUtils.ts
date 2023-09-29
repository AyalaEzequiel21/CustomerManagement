
export const formatDateIso = (dateString: Date) => {
    const date = new Date(dateString)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    const formattedDate = `${day}/${month}/${year}`
    return formattedDate
}


export const isValidDateFormat = (date: string): boolean => {
    const dateFormatRegex = /^\d{2}\/\d{2}\/\d{4}$/ // FORMAT MUST BE A DATE 

    return dateFormatRegex.test(date) // CHECK ID THE DATE IS VALID
}