package com.SoftGestionClientes.Model;

import com.SoftGestionClientes.Enums.EPaymentMethod;
import jakarta.persistence.*;
import lombok.*;
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
    @JoinColumn(name = "client_id")
    private Client client;

    @ManyToOne
    @JoinColumn(name = "report_id")
    private Report report;

    @NonNull
    private Double amount;

    @NonNull
    private EPaymentMethod paymentMethod;

    @OneToOne
    @JoinColumn(name = "sale_id")
    private Sale sale;
}
