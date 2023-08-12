package com.SoftGestionClientes.Services;

import com.SoftGestionClientes.Dto.SaleDetailDto;

import java.util.List;

public interface ISaleDetailService {
    List<SaleDetailDto> getAllSaleDetails();
    SaleDetailDto createSaleDetail(SaleDetailDto saleDetail);
    SaleDetailDto updateSaleDetail(SaleDetailDto saleDetail);
    SaleDetailDto getSaleDetailById(Long id);
    void deleteSaleDetailById(Long id);
}
