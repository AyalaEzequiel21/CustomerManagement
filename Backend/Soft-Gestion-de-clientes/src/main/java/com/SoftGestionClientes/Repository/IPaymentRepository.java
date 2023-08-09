package com.SoftGestionClientes.Repository;

import com.SoftGestionClientes.Model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IPaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByClientId(Long clientId); // find by client id;
}
