package com.SoftGestionClientes.Utils;

import com.SoftGestionClientes.Dto.ClientDto;
import com.SoftGestionClientes.Enums.ERole;
import com.SoftGestionClientes.Exception.BadRequestException;
import com.SoftGestionClientes.Exception.NotAuthorized;
import com.SoftGestionClientes.Exception.NotFoundException;
import com.SoftGestionClientes.Model.Client;
import com.SoftGestionClientes.Model.Payment;
import com.SoftGestionClientes.Repository.IClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
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

    /**
     * Filter all active clients
     * receive a list of clients
     * return a list with active clients
     */
    public List<Client> filterClientsActive(List<Client> clients){
        return clients.stream().filter(Client::isActive)
                .collect(Collectors.toList());
    }

    /**
     * Check if all arguments are valid
     * receive a client
     *
     */
    public void validateAttributesClient(ClientDto client){
        if (client.getName() == null || client.getPhone() == null || client.getCategoryPrice() == null){
            throw new BadRequestException("Need to enter some data");
        }
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

    /**
     * Check if the list is empty and run an exception
     * receive a list with clients
     *
     */
    public void validateList(List<Client> clients){
        if (clients.isEmpty()){
            throw new NotFoundException("Clients not found");
        }
    }

    /**
     * Check if the role is valid and run an exception
     * receive a role user
     *
     */
    public void validateRoleUser(ERole role) {
        if (role == ERole.DELIVERY){
            throw new NotAuthorized("You have not authorization");
        }
    }

    /**
     * Add a payment to the list of clients payment
     * receive a Client to add the payment and the payment to add.
     *
     */
    public void addPayment(Client client, Payment payment){
        Set<Payment> newPayments = client.getPayments();
        newPayments.add(payment);
        client.setPayments(newPayments);
        clientRepository.save(client);
    }


}
