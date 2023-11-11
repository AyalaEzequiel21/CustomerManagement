"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentDto = void 0;
class PaymentDto {
    constructor(clientId, amount, payment_method) {
        this.clientId = clientId;
        this.amount = amount;
        this.payment_method = payment_method;
    }
}
exports.PaymentDto = PaymentDto;
