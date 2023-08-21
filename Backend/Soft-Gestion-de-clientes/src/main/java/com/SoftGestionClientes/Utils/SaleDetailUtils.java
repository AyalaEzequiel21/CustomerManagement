package com.SoftGestionClientes.Utils;

import com.SoftGestionClientes.Dto.ClientDto;
import com.SoftGestionClientes.Dto.ProductDto;
import com.SoftGestionClientes.Dto.SaleDetailDto;
import com.SoftGestionClientes.Dto.SaleDto;
import com.SoftGestionClientes.Enums.ECategoryPrice;
import com.SoftGestionClientes.Exception.BadRequestException;
import com.SoftGestionClientes.Exception.NotFoundException;
import com.SoftGestionClientes.Model.SaleDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SaleDetailUtils {

    @Autowired
    SaleUtils saleUtils;

    public void validateList(List<SaleDetail> salesDetail){
        if (salesDetail.isEmpty()){
            throw new NotFoundException("Sales details not found");
        }
    }

    public void validateQuantity(double quantity){
        if (quantity < 0.0){
            throw new BadRequestException("The quantity cannot be less that zero");
        }
    }

    public void validateIfProductIsActive(ProductDto product){
        if (!product.isActive()){
            throw new BadRequestException("The product joined is inactive");
        }
    }

    public void validateIfExistsSale(SaleDto sale){
        saleUtils.validateSale(sale);
    }

    public double getProvisionalTotal(SaleDetailDto saleDetail){
        double provisionalTotal = 0.0;
        ECategoryPrice categoryPrice = getCategory(saleDetail.getSale().getClient());
        if (categoryPrice == ECategoryPrice.CARGADOR){
            provisionalTotal = saleDetail.getQuantity() * saleDetail.getProduct().getPriceClient();
        }else {
            provisionalTotal = saleDetail.getQuantity() * saleDetail.getProduct().getPriceNoClient();
        }
        return provisionalTotal;
    }

    private ECategoryPrice getCategory(ClientDto client){
        return client.getCategory();
    }
}
