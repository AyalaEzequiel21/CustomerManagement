package com.SoftGestionClientes.Repository;

import com.SoftGestionClientes.Enums.ECategoryPrice;
import com.SoftGestionClientes.Model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IClientRepository extends JpaRepository<Client, Long> {

    List<Client> findByName(String name); // find clients by name
    List<Client> findByCategoryPrice(ECategoryPrice categoryPrice); // find clients by category
    Boolean existsByName(String name); // verify if exists user by name
}
