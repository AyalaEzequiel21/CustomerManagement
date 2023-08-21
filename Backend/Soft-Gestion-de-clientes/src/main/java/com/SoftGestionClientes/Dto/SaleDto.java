package com.SoftGestionClientes.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SaleDto {
    private Long id;
    private LocalDate saleDate;
    private ClientDto client;
    private Set<SaleDetailDto> detail;
    private double totalSale;
    private PaymentDto payment;
}
