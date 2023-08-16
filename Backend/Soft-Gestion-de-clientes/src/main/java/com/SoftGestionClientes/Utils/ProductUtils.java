package com.SoftGestionClientes.Utils;

import com.SoftGestionClientes.Dto.ProductDto;
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

    public boolean validatePrices(ProductDto product){
        boolean response = false;
        if (product.getPriceClient() > 0 && product.getPriceNoClient() > 0){
            response = true;
        }
        return response;
    }
}
