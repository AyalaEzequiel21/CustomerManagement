package com.SoftGestionClientes.Model;

import com.SoftGestionClientes.Enums.ECategoryPrice;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "client")
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreationTimestamp
    @Column(name = "register_date")
    private LocalDate registerDate;

    @NotBlank
    private String name;
    @NotBlank
    private String phone;

    @Enumerated(EnumType.STRING)
    private ECategoryPrice categoryPrice;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Sale> sales = new HashSet<>();

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Payment> payments = new HashSet<>();

    private double balance = 0.0;

    private boolean isActive = true;

}
