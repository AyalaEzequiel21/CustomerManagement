package com.SoftGestionClientes.Model;

import java.time.LocalDate;

public class Payment {
    private Long id;
    private LocalDate paymentDate;
    private Customer customer;
    private Float amount;
}
