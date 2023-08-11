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
public class OrderListDto {
    private Long id;
    private LocalDate orderDate;
    private Set<SaleDto> sales;
}
