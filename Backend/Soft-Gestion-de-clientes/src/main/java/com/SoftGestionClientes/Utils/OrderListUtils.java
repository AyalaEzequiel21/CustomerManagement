package com.SoftGestionClientes.Utils;

import com.SoftGestionClientes.Dto.OrderListDto;
import com.SoftGestionClientes.Dto.SaleDto;
import com.SoftGestionClientes.Exception.BadRequestException;
import com.SoftGestionClientes.Exception.NotFoundException;
import com.SoftGestionClientes.Model.OrderList;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
public class OrderListUtils {

    public void validateList(List<OrderList> orders){
        if (orders.isEmpty()){
            throw new NotFoundException("Orders not found");
        }
    }

    public void validateSales(Set<SaleDto> sales) {
        if (sales.isEmpty()){
            throw new BadRequestException("The order list cannot be empty");
        }
    }
}
