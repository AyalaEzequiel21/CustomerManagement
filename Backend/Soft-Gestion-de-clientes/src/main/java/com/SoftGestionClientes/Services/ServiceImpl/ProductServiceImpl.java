package com.SoftGestionClientes.Services.ServiceImpl;

import com.SoftGestionClientes.Dto.ProductDto;
import com.SoftGestionClientes.Exception.AlreadyRegisterException;
import com.SoftGestionClientes.Exception.NotFoundException;
import com.SoftGestionClientes.Model.Product;
import com.SoftGestionClientes.Repository.IProductRepository;
import com.SoftGestionClientes.Services.IProductService;
import com.SoftGestionClientes.Utils.Converts.ProductConverter;
import com.SoftGestionClientes.Utils.ProductUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements IProductService {
    @Autowired
    private ProductUtils productUtils;

    @Autowired
    private IProductRepository productRepository;

    @Autowired
    private ProductConverter productConverter;

    /**
     * Retrieves a list of active products filtered by name as DTOs.
     * @param name of product
     * @return List of ProductDto objects representing active products by name.
     */
    @Override
    public List<ProductDto> getProductByName(String name) {
        // get all products
        List<Product> productsSaved = productRepository.findByName(name);
        // filter the active products
        List<Product> activeProducts = productUtils.filterActiveProducts(productsSaved);
        // verify if list is empty, if empty run an exception
        productUtils.validateList(activeProducts);
        // return a list with dtos of all active products filtered by name
        return activeProducts.stream()
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
        // filter the active products
        List<Product> activeProducts = productUtils.filterActiveProducts(productsSaved);
        // validate if the list is empty run an exception
        productUtils.validateList(activeProducts);
        // return a list with dtos of all active products
        return activeProducts.stream()
                .map(product ->productConverter.convertToDto(product, ProductDto.class))
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a list of inactive products as DTOs.
     *
     * @return List of ProductDto objects representing inactive products.
     */
    public List<ProductDto> getAllInactiveProducts() {
        // get all active products
        List<Product> productsSaved = productRepository.findAll();
        // filter all products inactive
        List<Product> inactiveProducts = productUtils.filterInactiveProducts(productsSaved);
        // validate if the list is empty run an exception
        productUtils.validateList(inactiveProducts);
        // return a list with dtos of all active products
        return inactiveProducts.stream()
                .map(product ->productConverter.convertToDto(product, ProductDto.class))
                .collect(Collectors.toList());
    }

    /**
     * Retrieves an active product as DTO.
     * @param id product
     * @return ProductDto object representing active products.
     */
    @Override
    public ProductDto getProductById(Long id) {
        // get the product saved by id or run an exception if the product is not found or inactive
        Product productSaved = productUtils.getProductAndValidate(id);
        //return dto of product saved
        return productConverter.convertToDto(productSaved, ProductDto.class);
    }

    /**
     * Create a product.
     * @param product to save
     * @return ProductDto object representing the product created.
     */
    @Override
    public ProductDto registerProduct(ProductDto product) {
        // Validates that the prices are greater than 0
        productUtils.validatePrices(product);
        // Validates if a product with the same name already exists
        if (productRepository.existsByName(product.getName())){
            throw new AlreadyRegisterException("There is already a product with that name");
        }
        // Save the product
        Product productSaved = productRepository.save(productConverter.convertToEntity(product, Product.class));
        // return dto of product saved
        return productConverter.convertToDto(productSaved, ProductDto.class);
    }

    /**
     * Update a product.
     * @param product to update
     * @return ProductDto object representing the product updated.
     */
    @Override
    public ProductDto updateProduct(ProductDto product) {
        // Validates that the prices are greater than 0
        productUtils.validatePrices(product);
        // get the product saved
        Product productSaved = productUtils.getProductAndValidate(product.getId());
        if (!productSaved.getName().equals(product.getName()) && productRepository.existsByName(product.getName())){
            throw new AlreadyRegisterException("There is already a product with that name");
        } else {
            // Save the product updated
            Product productUpdated = productRepository.save(productConverter.convertToEntity(product, Product.class));
            // return dto of product saved
            return productConverter.convertToDto(productUpdated, ProductDto.class);
        }
    }

    /**
     * Delete a product.
     * @param id product to delete
     *
     */
    @Override
    public void deleteProductById(Long id) {
        // get the product saved by id or run an exception if the product is not found or inactive
        Product productSaved = productUtils.getProductAndValidate(id);
        // modify status to inactive
        productSaved.setActive(false);
        // save the product modified
        productRepository.save(productSaved);
    }

}
