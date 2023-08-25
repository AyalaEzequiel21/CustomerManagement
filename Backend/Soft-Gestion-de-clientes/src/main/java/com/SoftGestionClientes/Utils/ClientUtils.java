package com.SoftGestionClientes.Utils;

import com.SoftGestionClientes.Dto.ClientDto;
import com.SoftGestionClientes.Enums.ERole;
import com.SoftGestionClientes.Exception.BadRequestException;
import com.SoftGestionClientes.Exception.NotAuthorized;
import com.SoftGestionClientes.Exception.NotFoundException;
import com.SoftGestionClientes.Model.Client;
import com.SoftGestionClientes.Repository.IClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.naming.NoPermissionException;
import java.util.List;
import java.util.stream.Collectors;

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

    public List<Client> filterClientsActive(List<Client> clients){
        return clients.stream().filter(Client::isActive)
                .collect(Collectors.toList());
    }

    public void validateAttributesClient(ClientDto client){
        if (client.getBalance() < 0.0){
            throw new BadRequestException("The balance cannot be less that 0");
        }
        if (!client.isActive()){
            throw new BadRequestException("Cannot create a client inactive");
        }
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

    public void validateList(List<Client> clients){
        if (clients.isEmpty()){
            throw new NotFoundException("Clients not found");
        }
    }

    public void validateRoleUser(ERole role) {
        if (role == ERole.DELIVERY){
            throw new NotAuthorized("You have not authorization");
        }
    }


}
