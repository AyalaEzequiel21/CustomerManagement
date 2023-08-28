package com.SoftGestionClientes.Utils;

import com.SoftGestionClientes.Dto.ProductDto;
import com.SoftGestionClientes.Exception.BadRequestException;
import com.SoftGestionClientes.Exception.NotFoundException;
import com.SoftGestionClientes.Model.Product;
import com.SoftGestionClientes.Repository.IProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ProductUtils {
    @Autowired
    IProductRepository productRepository;

    public Product getProductAndValidate(Long id){
        Product productSaved = productRepository.findById(id)
                .orElseThrow(()-> new NotFoundException("Product not found or is inactive"));

        if (!productSaved.isActive()){
            throw new NotFoundException("Product not found or is inactive");
        }
        return productSaved;
    }

    public void validatePrices(ProductDto product){
       if (product.getPriceNoClient() <= 0 || product.getPriceClient() <= 0){
           throw new BadRequestException("The prices cannot be less or equals that 0");
       }
    }
}
