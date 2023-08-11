package com.SoftGestionClientes.Repository;

import com.SoftGestionClientes.Model.OrderList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IOrderListRepository extends JpaRepository<OrderList, Long> {
    List<OrderList> findByOrderDate(LocalDate orderDate);  // find orders by date

}
