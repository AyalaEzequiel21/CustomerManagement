package com.SoftGestionClientes.Model;

import com.SoftGestionClientes.Enums.EPaymentMethod;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreationTimestamp
    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Client client;

    @ManyToOne
    @JoinColumn(name = "report_id")
    private Report report;

    private Double amount;

    private EPaymentMethod paymentMethod;

    @OneToOne
    @JoinColumn(name = "sale_id")
    private Sale sale;

}
