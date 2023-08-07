package com.SoftGestionClientes.Model;

import com.SoftGestionClientes.Enums.ECategoryPrice;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "clients")
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "register_date")
    private LocalDate registerDate;

    @NotBlank
    private String name;
    @NotBlank
    private String phone;
    @NotBlank
    private ECategoryPrice categoryPrice;
    private Set<Sale> sales = new HashSet<>();
    private Set<Payment> payments = new HashSet<>();

}
