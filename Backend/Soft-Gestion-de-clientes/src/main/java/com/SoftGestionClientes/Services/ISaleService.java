package com.SoftGestionClientes.Services;

import com.SoftGestionClientes.Dto.SaleDto;

import java.util.List;

public interface ISaleService {
    List<SaleDto> getSalesByClientId(Long clientId);
    List<SaleDto> getAllSales();
    SaleDto registerSale(SaleDto sale);
    SaleDto updaterSale(SaleDto sale);
    SaleDto getSaleById(Long id);
    void deleteSaleById(Long id);
}
