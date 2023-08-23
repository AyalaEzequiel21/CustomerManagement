package com.SoftGestionClientes.Utils.Converts;

import com.SoftGestionClientes.Dto.ClientDto;
import com.SoftGestionClientes.Exception.NotFoundException;
import com.SoftGestionClientes.Model.Payment;
import com.SoftGestionClientes.Repository.IClientRepository;
import com.SoftGestionClientes.Services.ServiceImpl.ClientServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PaymentUtils {
    @Autowired
    ClientServiceImpl clientService;

    @Autowired
    IClientRepository clientRepository;

    public void validateClient(Long clientId){
        // I get the client validating if exists and if is active
        ClientDto client = clientService.getClientById(clientId);
    }

    public void validateList(List<Payment> payments){
        if (payments.isEmpty()){
            throw new NotFoundException("Payments not found");
        }
    }
}
