package com.SoftGestionClientes.Services.ServiceImpl;

import com.SoftGestionClientes.Dto.ProductDto;
import com.SoftGestionClientes.Exception.NotFoundException;
import com.SoftGestionClientes.Model.Product;
import com.SoftGestionClientes.Repository.IProductRepository;
import com.SoftGestionClientes.Services.IProductService;
import com.SoftGestionClientes.Utils.Converts.ProductConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements IProductService {
    @Autowired
    IProductRepository productRepository;

    @Autowired
    ProductConverter productConverter;

    /**
     * Retrieves a list of active products filtered by name as DTOs.
     * @param name of product
     * @return List of ProductDto objects representing active products by name.
     */
    @Override
    public List<ProductDto> getProductByName(String name) {
        // get all products
        List<Product> productsSaved = productRepository.findByName(name);
        // verify if list is empty, if empty run an exception
        if (productsSaved.isEmpty()){
            throw new NotFoundException("Products not found with the name: " + name);
        }
        // return a list with dtos of all active products filtered by name
        return productsSaved.stream()
                .filter(Product::isActive)
                .map(product -> productConverter.convertToDto(product, ProductDto.class))
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a list of active products as DTOs.
     *
     * @return List of ProductDto objects representing active products.
     */
    @Override
    public List<ProductDto> getAllProducts() {
        // get all active products
        List<Product> productsSaved = productRepository.findAll();
        // validate if the list is empty run an exception
        if (productsSaved.isEmpty()){
            throw new NotFoundException("Products not found");
        }
        // return a list with dtos of all active products
        return productsSaved.stream()
                .filter(Product::isActive)
                .map(product ->productConverter.convertToDto(product, ProductDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public ProductDto getProductById(Long id) {
        return null;
    }

    @Override
    public ProductDto registerProduct(ProductDto product) {
        return null;
    }

    @Override
    public ProductDto updateProduct(ProductDto product) {
        return null;
    }

    @Override
    public void deleteProductById(Long id) {

    }

    private Product getAndValidateProduct(Long id){
        Product productSave = productRepository.findById(id).orElseThrow(()-> new NotFoundException("Product not found"));
        if (!productSave.isActive()){
            throw new NotFoundException("Product not found or inactive");
        }
        return productSave;
    }
}
