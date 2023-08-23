package com.SoftGestionClientes.Dto;

import com.SoftGestionClientes.Enums.EPaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentDto {
    private Long id;
    private LocalDate paymentDate;
    private ClientDto client;
    private ReportDto report;
    private Double amount;
    private EPaymentMethod paymentMethod;
    private SaleDto sale;
}
