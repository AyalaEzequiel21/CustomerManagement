package com.SoftGestionClientes.Services;

import com.SoftGestionClientes.Dto.SaleDetailDto;
import com.SoftGestionClientes.Dto.SaleDto;

import java.util.List;

public interface ISaleDetailService {
    List<SaleDetailDto> getAllSaleDetailsBySaleId(Long saleId);
    SaleDetailDto createSaleDetail(SaleDetailDto saleDetail);
    SaleDetailDto updateSaleDetail(SaleDetailDto saleDetail);
    SaleDetailDto getSaleDetailById(Long id);
    void deleteSaleDetailById(Long id);
}
