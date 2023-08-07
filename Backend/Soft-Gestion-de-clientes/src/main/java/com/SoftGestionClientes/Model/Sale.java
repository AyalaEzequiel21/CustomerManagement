package com.SoftGestionClientes.Model;

import java.time.LocalDate;
import java.util.Set;

public class Sale {
    private Long id;
    private LocalDate saleDate;
    private Customer customer;
    private Set<Product> products;
}
