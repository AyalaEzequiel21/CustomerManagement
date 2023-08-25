package com.SoftGestionClientes.Services.ServiceImpl;

import com.SoftGestionClientes.Dto.ClientDto;
import com.SoftGestionClientes.Enums.ECategoryPrice;
import com.SoftGestionClientes.Enums.ERole;
import com.SoftGestionClientes.Exception.AlreadyRegisterException;
import com.SoftGestionClientes.Exception.NotFoundException;
import com.SoftGestionClientes.Model.Client;
import com.SoftGestionClientes.Repository.IClientRepository;
import com.SoftGestionClientes.Services.IClientService;
import com.SoftGestionClientes.Utils.ClientUtils;
import com.SoftGestionClientes.Utils.Converts.ClientConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClientServiceImpl implements IClientService {

    @Autowired
    private IClientRepository clientRepository;

    @Autowired
    private ClientUtils clientUtils;

    @Autowired
    private ClientConverter clientConverter;

    /**
     * Retrieves a list of active clients as DTOs.
     * @param name of client
     * @return List of ClientDto objects representing active clients by name.
     */
    @Override
    public List<ClientDto> getClientByName(String name) {
        // get a list with clients with that name
        List<Client> clientsSaved = clientRepository.findByName(name);
        // check if the lis is not empty
        clientUtils.validateList(clientsSaved);
        //get clients active
        List<Client> clientsActive = clientUtils.filterClientsActive(clientsSaved);
        // returns a list with dtos of all active clients filtered by her name
        return clientsActive.stream()
                .map(client -> clientConverter.convertToDto(client, ClientDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<ClientDto> getClientByCategoryPrice(ECategoryPrice categoryPrice) {
        // get clients by category price
        List<Client> clientsSaved = clientRepository.findByCategoryPrice(categoryPrice);
        // validate if the list is not empty
        clientUtils.validateList(clientsSaved);
        //get clients active
        List<Client> clientsActive = clientUtils.filterClientsActive(clientsSaved);
        // returns a list with dtos of all active clients filtered by her name
        return clientsActive.stream()
                .map(client -> clientConverter.convertToDto(client, ClientDto.class))
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a list of active clients as DTOs.
     *
     * @return List of ClientDto objects representing active clients.
     */
    @Override
    public List<ClientDto> getAllClients() {
        // get all clients saved
        List<Client> clientsSaved = clientRepository.findAll();
        //validate if the list is empty run an exception
        clientUtils.validateList(clientsSaved);
        //get the active clients
        List<Client> clientsActive = clientUtils.filterClientsActive(clientsSaved);
        // returns a list with dtos of all active clients
        return clientsActive.stream()
                .map(client -> clientConverter.convertToDto(client, ClientDto.class))
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a list of inactive clients as DTOs.
     *
     * @return List of ClientDto objects representing inactive clients.
     */
    @Override
    public List<ClientDto> getAllClientsInactive() {
        // get all clients inactive
        List<Client> clientsInactive = clientRepository.findAllByIsActiveFalse();
        // returns dtos of all clients inactive
        return clientsInactive.stream()
                .map(client -> clientConverter.convertToDto(client, ClientDto.class))
                .collect(Collectors.toList());
    }

    /**
     * Retrieves an active client as DTOs.
     * @param id of client
     * @return a ClientDto object representing active client.
     */
    @Override
    public ClientDto getClientById(Long id) {
        // get a client by id or run an exception
        Client clientSaved = clientUtils.getClientAndValidate(id);
        // return the dto of client found
        return clientConverter.convertToDto(clientSaved, ClientDto.class);

    }

    /**
     * Create a client.
     * @param client to register
     * @return a ClientDto object representing active client.
     */
    @Override
    public ClientDto createClient(ClientDto client, ERole userRole) {
        // check if role has authorization
        clientUtils.validateRoleUser(userRole);
        // validate if the name has already been registered
        if (clientRepository.existsByName(client.getName())){
            // if has been registered run an exception
            throw new AlreadyRegisterException("The name has already been registered");
        }
        //check attributes of client
        clientUtils.validateAttributesClient(client);
        // the client created is saved
        Client clientSaved  = clientRepository.save(clientConverter.convertToEntity(client, Client.class));
        // return a dto of client created
        return clientConverter.convertToDto(clientSaved, ClientDto.class);
    }

    /**
     * Update a client.
     * @param client to update
     * @return a ClientDto object representing active client.
     */
    @Override
    public ClientDto updateClient(ClientDto client, ERole userRole) {
        // check if role has authorization
        clientUtils.validateRoleUser(userRole);
        // validate if client exists
        if (!clientRepository.existsById(client.getId())){
            // if not exists run an exception
            throw new NotFoundException("Client not found");
        }
        //check attributes of client
        clientUtils.validateAttributesClient(client);
        // if client exists then save the new client
        Client clientUpdated = clientRepository.save(clientConverter.convertToEntity(client, Client.class));
        // return the dto of client updated
        return clientConverter.convertToDto(clientUpdated, ClientDto.class);
    }

    /**
     * Modify a client as inactive.
     * @param id of client
     *
     */
    @Override
    public void deleteClientById(Long id, ERole userRole) {
        // check if role has authorization
        clientUtils.validateRoleUser(userRole);
        // get the client by id, if not exists run an exception
        Client clientSaved = clientUtils.getClientAndValidate(id);
        // modify client as inactive
        clientSaved.setActive(false);
        // save client modified
        clientRepository.save(clientSaved);
    }
}
