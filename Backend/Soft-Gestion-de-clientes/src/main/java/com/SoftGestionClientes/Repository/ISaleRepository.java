package com.SoftGestionClientes.Repository;

import com.SoftGestionClientes.Model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ISaleRepository extends JpaRepository<Sale, Long> {
    List<Sale> findByClientId(Long clientId); // find sales by client id
    List<Sale> findBySaleDate(LocalDate saleDate); // find sales by sale date
}
