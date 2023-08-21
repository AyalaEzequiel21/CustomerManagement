package com.SoftGestionClientes.Utils;

import com.SoftGestionClientes.Dto.SaleDto;
import com.SoftGestionClientes.Exception.NotFoundException;
import com.SoftGestionClientes.Model.Client;
import com.SoftGestionClientes.Model.Sale;
import com.SoftGestionClientes.Repository.IClientRepository;
import com.SoftGestionClientes.Repository.ISaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SaleUtils {
    @Autowired
    ISaleRepository saleRepository;
    @Autowired
    IClientRepository clientRepository;

    public void validateSale(SaleDto sale){
        if (!saleRepository.existsById(sale.getId())){
            throw new NotFoundException("Sale not found");
        }
    }

    public void validateList(List<Sale> sales){
        if (sales.isEmpty()){
            throw new NotFoundException("Sales not found");
        }
    }

    public void validateClient(Long clientId){
        Client clientSaved = clientRepository.findById(clientId).orElseThrow(() -> new NotFoundException("Client not found"));
        if (!clientSaved.isActive()){
            throw new NotFoundException("Client not found");
        }
    }
}
