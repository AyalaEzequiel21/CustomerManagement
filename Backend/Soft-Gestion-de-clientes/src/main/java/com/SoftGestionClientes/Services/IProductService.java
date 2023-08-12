package com.SoftGestionClientes.Services;

import com.SoftGestionClientes.Dto.ProductDto;

import java.util.List;

public interface IProductService {
    List<ProductDto> getProductByName(String name);
    List<ProductDto> getAllProducts();
    ProductDto registerProduct(ProductDto product);
    ProductDto updateProduct(ProductDto product);
    void deleteProductById(Long id);
}
