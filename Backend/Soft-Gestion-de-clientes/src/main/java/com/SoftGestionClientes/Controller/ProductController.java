package com.SoftGestionClientes.Controller;

import com.SoftGestionClientes.Dto.ProductDto;
import com.SoftGestionClientes.Exception.AlreadyRegisterException;
import com.SoftGestionClientes.Exception.BadRequestException;
import com.SoftGestionClientes.Exception.NotFoundException;
import com.SoftGestionClientes.Services.ServiceImpl.ProductServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/pradera/products")
public class ProductController {

    @Autowired
    private ProductServiceImpl productService;

    HashMap<String, Object> data;

    @GetMapping
    public ResponseEntity<Object> getAllProducts(){
        // initialize the data
        data = new HashMap<>();
        // get all products
        List<ProductDto> productsSaved = productService.getAllProducts();
        // add products to data
        data.put("data", productsSaved);
        // return a response with the data and status OK
        return new ResponseEntity<>(data, HttpStatus.OK);
    }
    @GetMapping("/inactive")
    public ResponseEntity<Object> getAllInactiveProducts(){
        // initialize the data
        data = new HashMap<>();
        // get all products inactive
        List<ProductDto> inactiveProducts = productService.getAllInactiveProducts();
        // add the products to data
        data.put("data", inactiveProducts);
        // return a response with status OK and the list with inactive products
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @GetMapping("/{name}")
    public ResponseEntity<Object> getProductsByName(@PathVariable String name){
        // initialize the data
        data = new HashMap<>();
        // get the products by name
        List<ProductDto> productsSaved = productService.getProductByName(name);
        // add products to data
        data.put("data", productsSaved);
        // return a response with status OK and products found
        return new ResponseEntity<>(data, HttpStatus.OK);
    }
    @GetMapping("/id/{id}")
    public ResponseEntity<Object> getProductsById(@PathVariable Long id){
        // initialize the data
        data = new HashMap<>();
        // get the product by id
        ProductDto productsSaved = productService.getProductById(id);
        // add product to data
        data.put("data", productsSaved);
        // return a response with status OK and product found
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<Object> registerProduct(@RequestBody ProductDto product){
        // initialize the data
        data = new HashMap<>();
        // create the new product
        ProductDto productRegistered = productService.registerProduct(product);
        // add the new product to data
        data.put("successful", productRegistered);
        // returns a response with product registered and status CREATED
        return new ResponseEntity<>(data, HttpStatus.CREATED);
    }

    @PutMapping("/update")
    public ResponseEntity<Object> updatedProduct(@RequestBody ProductDto product){
        // initialize the data
        data = new HashMap<>();
        // update the product
        ProductDto productUpdated = productService.updateProduct(product);
        // add the product updated to data
        data.put("Product updated", productUpdated);
        // return a response with status OK and the product
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteProductById(@PathVariable Long id){

        // delete product by id
        productService.deleteProductById(id);
        // return a response
        return new ResponseEntity<>("Product deleted", HttpStatus.NO_CONTENT);
    }


    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Object> handleBadReqException(BadRequestException e){
        // create a custom response to BadRequestException
        data = new HashMap<>();
        data.put("error", "Bad Request");
        data.put("message", e.getMessage());

        return new ResponseEntity<>(data, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Object> handleNotFoundException(NotFoundException e){
        // create a custom response to BadRequestException
        data = new HashMap<>();
        data.put("error", "Not Found");
        data.put("message", e.getMessage());

        return new ResponseEntity<>(data, HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(AlreadyRegisterException.class)
    public ResponseEntity<Object> handleAlreadyRegisterException(AlreadyRegisterException e){
        // create a custom response to BadRequestException
        data = new HashMap<>();
        data.put("error", "Already Register");
        data.put("message", e.getMessage());

        return new ResponseEntity<>(data, HttpStatus.ALREADY_REPORTED);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGenericException(Exception e){
        data = new HashMap<>();
        data.put("error", "Internal Error");
        data.put("message", e.getMessage());

        return new ResponseEntity<>(data, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
