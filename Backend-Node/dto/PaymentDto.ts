export class PaymentDto {
    constructor(
        public clientId: string,
        public amount: number,
        public payment_method: string
    ){}
}
