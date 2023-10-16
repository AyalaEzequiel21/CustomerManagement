export class PaymentDto {
    constructor(
        public clientId: string,
        public amount: number,
        public paymentMethod: string,
        public reportId: string
    ){}
}