package com.SoftGestionClientes.Services;

import com.SoftGestionClientes.Dto.PaymentDto;

import java.time.LocalDate;
import java.util.List;

public interface IPaymentService {
    List<PaymentDto> getPaymentByClientId(Long clientId);
    List<PaymentDto> getPaymentsByPaymentDate(LocalDate paymentDate);
    List<PaymentDto> getAllPayments();
    PaymentDto createPayment(PaymentDto payment);
    PaymentDto updatePayment(PaymentDto payment);
    PaymentDto getPaymentById(Long id);
    void deletePaymentById(Long id);
}
