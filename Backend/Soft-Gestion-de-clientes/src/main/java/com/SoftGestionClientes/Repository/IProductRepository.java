package com.SoftGestionClientes.Repository;

import com.SoftGestionClientes.Model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByName(String name); // find products by name
    Boolean existsByName(String name);  // verify if exists product by name

}
