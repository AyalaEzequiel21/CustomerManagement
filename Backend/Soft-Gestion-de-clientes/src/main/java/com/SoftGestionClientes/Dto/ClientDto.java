package com.SoftGestionClientes.Dto;

import com.SoftGestionClientes.Enums.ECategoryPrice;
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
public class ClientDto {
    private Long id;
    private LocalDate registerDate;
    private String name;
    private String phone;
    private ECategoryPrice category;
    private Set<SaleDto> sales;
    private Set<PaymentDto> payments;
    private Double balance;
}
