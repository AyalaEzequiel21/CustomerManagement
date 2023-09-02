package com.SoftGestionClientes.Repository;

import com.SoftGestionClientes.Enums.EPaymentMethod;
import com.SoftGestionClientes.Model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IPaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByClientId(Long clientId); // find by client id;
    List<Payment> findByPaymentDate(LocalDate paymentDate); // find by date of payment
    List<Payment> findByPaymentMethod(EPaymentMethod paymentMethod); // find by payment method

}
