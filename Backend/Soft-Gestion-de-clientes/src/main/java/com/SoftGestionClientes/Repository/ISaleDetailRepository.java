package com.SoftGestionClientes.Repository;

import com.SoftGestionClientes.Model.SaleDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ISaleDetailRepository extends JpaRepository<SaleDetail, Long> {
}
