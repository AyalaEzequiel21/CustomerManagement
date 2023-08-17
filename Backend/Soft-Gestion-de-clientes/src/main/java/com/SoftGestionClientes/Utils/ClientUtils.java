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

    /**
     * get a client by id and validate if is active and register
     * receive the id client
     *
     */
    public Client getClientAndValidate(Long id){
        Client clientSaved = clientRepository.findById(id)
                .orElseThrow(()-> new NotFoundException("Client not found or is inactive"));

        if (!clientSaved.isActive()){
            throw new NotFoundException("Client not found or is inactive");
        }
        return clientSaved;
    }

    /**
     * update client balance
     * receive a client a payment, amount and whether to add or subtract
     *
     */
    public void updateClientBalance(Client client, double paymentAmount, boolean isAddition){
        double newBalance;
        if (isAddition){
            newBalance = client.getBalance() + paymentAmount;
        } else{
            newBalance = client.getBalance() - paymentAmount;
        }
        client.setBalance(newBalance);
        clientRepository.save(client);
    }
}
