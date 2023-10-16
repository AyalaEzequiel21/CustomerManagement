import { PaymentDto } from "../../dto/PaymentDto";


export const isValidPaymentDto = (payment: any): payment is PaymentDto => {
    return (
        payment instanceof PaymentDto &&
        typeof payment.clientId === "string" &&
        typeof payment.amount === "number" &&
        typeof payment.payment_method === "string" 
    )
}