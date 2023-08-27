package com.SoftGestionClientes.Dto;

import com.SoftGestionClientes.Enums.ECategoryPrice;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.HashSet;
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
    private ECategoryPrice categoryPrice;
    private Set<SaleDto> sales = new HashSet<>();
    private Set<PaymentDto> payments = new HashSet<>();
    private double balance = 0.0;
    private boolean isActive = true;
}
