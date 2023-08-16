package com.SoftGestionClientes.Utils;

import com.SoftGestionClientes.Exception.NotFoundException;
import com.SoftGestionClientes.Model.Client;
import com.SoftGestionClientes.Repository.IClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ClientUtils {

    @Autowired
    IClientRepository clientRepository;

    public Client getClientAndValidate(Long id){
        Client clientSaved = clientRepository.findById(id)
                .orElseThrow(()-> new NotFoundException("Client not found or is inactive"));

        if (!clientSaved.isActive()){
            throw new NotFoundException("Client not found or is inactive");
        }
        return clientSaved;
    }
}
