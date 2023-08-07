package com.SoftGestionClientes.Model;

import com.SoftGestionClientes.Enums.ECategoryPrice;

import java.time.LocalDate;
import java.util.Set;

public class Customer {
    private Long id;
    private LocalDate registerDate;
    private String name;
    private String phone;
    private ECategoryPrice categoryPrice;
    private Set<Sale> sales;
    private Set<Payment> payments;

}
