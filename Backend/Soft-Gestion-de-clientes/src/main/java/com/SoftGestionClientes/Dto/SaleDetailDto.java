package com.SoftGestionClientes.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SaleDetailDto {
    private Long id;
    private SaleDto sale;
    private ProductDto product;
    private Double quantity;
}
