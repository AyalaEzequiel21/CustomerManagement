package com.SoftGestionClientes.Utils;

import com.SoftGestionClientes.Dto.ProductDto;
import com.SoftGestionClientes.Exception.BadRequestException;
import com.SoftGestionClientes.Exception.NotFoundException;
import com.SoftGestionClientes.Model.Product;
import com.SoftGestionClientes.Repository.IProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductUtils {
    @Autowired
    IProductRepository productRepository;

    /**
     * get the product by id and validate if is active
     * receive the id to search
     * return an active product
     */
    public Product getProductAndValidate(Long id){
        Product productSaved = productRepository.findById(id)
                .orElseThrow(()-> new NotFoundException("Product not found or is inactive"));

        if (!productSaved.isActive()){
            throw new NotFoundException("Product not found or is inactive");
        }
        return productSaved;
    }

    /**
     * check if both prices are more than 0 or run an exception
     * receive a product with prices
     *
     */
    public void validatePrices(ProductDto product){
       if (product.getPriceNoClient() <= 0 || product.getPriceClient() <= 0){
           throw new BadRequestException("The prices cannot be less or equals that 0");
       }
    }

    /**
     * check if the list is empty and run an exception
     * receive a list od entities
     *
     */
    public void validateList(List<Product> list){
        if (list.isEmpty()){
            throw new NotFoundException("Product not found");
        }
    }

    /**
     * filter the active products
     * receive a list of product
     * return a list with only active products
     */
    public List<Product> filterActiveProducts(List<Product> products){
        return products.stream().filter(Product::isActive)
                .collect(Collectors.toList());
    }

    /**
     * filter the inactive products
     * receive a list of product
     * return a list with only inactive products
     */
    public List<Product> filterInactiveProducts(List<Product> products){
        return products.stream().filter(product -> !product.isActive())
                .collect(Collectors.toList());
    }
}
