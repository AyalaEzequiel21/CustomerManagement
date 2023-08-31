package com.SoftGestionClientes.Model;


import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "product", uniqueConstraints = {@UniqueConstraint(columnNames = {"name"})})
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NonNull
    private String name;
    private String description;
    @NonNull
    @Column(name = "price_client")
    private double priceClient;
    @NonNull
    @Column(name = "price_no_client")
    private double priceNoClient;
    private boolean isActive = true;
}
