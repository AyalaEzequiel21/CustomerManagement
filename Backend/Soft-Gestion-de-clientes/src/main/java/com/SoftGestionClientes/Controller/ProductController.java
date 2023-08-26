package com.SoftGestionClientes.Controller;

import com.SoftGestionClientes.Dto.ProductDto;
import com.SoftGestionClientes.Services.ServiceImpl.ProductServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
        // return a reponse with the data and status OK
        return new ResponseEntity<>(data, HttpStatus.OK);
    }
}
