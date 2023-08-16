package com.SoftGestionClientes.Services.ServiceImpl;

import com.SoftGestionClientes.Dto.ClientDto;
import com.SoftGestionClientes.Exception.AlreadyRegisterException;
import com.SoftGestionClientes.Exception.NotFoundException;
import com.SoftGestionClientes.Model.Client;
import com.SoftGestionClientes.Repository.IClientRepository;
import com.SoftGestionClientes.Services.IClientService;
import com.SoftGestionClientes.Utils.Converts.ClientConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClientServiceImpl implements IClientService {

    @Autowired
    IClientRepository clientRepository;

    @Autowired
    ClientConverter clientConverter;

    /**
     * Retrieves a list of active clients as DTOs.
     * @param name of client
     * @return List of ClientDto objects representing active clients by name.
     */
    @Override
    public List<ClientDto> getClientByName(String name) {
        // get a list with clients with that name
        List<Client> clientsSaved = clientRepository.findByName(name);
        // if the list is empty return an error
        if (clientsSaved.isEmpty()){
            throw new NotFoundException("No clients found with that name.");
        }
        // returns a list with dtos of all active clients filtered by her name
        return clientsSaved.stream().filter(Client::isActive)
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
        if (clientsSaved.isEmpty()){
            throw new NotFoundException("Clients not found");
        }
        // returns a list with dtos of all active clients
        return clientsSaved.stream().filter(Client::isActive)
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
        Client clientSaved = clientRepository.findById(id).orElseThrow(() -> new NotFoundException("No client found with id: " + id));
        // validate if client is active
        if (!clientSaved.isActive()){
            throw new NotFoundException("Client with id: " + id +" is inactive");
        }
        // return the dto of client found
        return clientConverter.convertToDto(clientSaved, ClientDto.class);

    }

    /**
     * Create a client.
     * @param client to register
     * @return a ClientDto object representing active client.
     */
    @Override
    public ClientDto createClient(ClientDto client) {
        // create future client
        Client clientSaved;
        // validate if the name has already been registered
        if (clientRepository.existsByName(client.getName())){
            // if has been registered run an exception
            throw new AlreadyRegisterException("Name has already been registered");
        }
        // the client created is saved
        clientSaved = clientRepository.save(clientConverter.convertToEntity(client, Client.class));
        // return a dto of client created
        return clientConverter.convertToDto(clientSaved, ClientDto.class);
    }

    /**
     * Update a client.
     * @param client to update
     * @return a ClientDto object representing active client.
     */
    @Override
    public ClientDto updateClient(ClientDto client) {
        // create future client updated
        Client clientUpdated;
        // validate if client exists
        if (!clientRepository.existsById(client.getId())){
            // if not exists run an exception
            throw new NotFoundException("No client found");
        }
        // if client exists then save the new client
        clientUpdated = clientRepository.save(clientConverter.convertToEntity(client, Client.class));
        // return the dto of client updated
        return clientConverter.convertToDto(clientUpdated, ClientDto.class);
    }

    /**
     * Modify a client as inactive.
     * @param id of client
     *
     */
    @Override
    public void deleteClientById(Long id) {
        // get the client by id, if not exists run an exception
        Client clientSaved = clientRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("No client found with id: " + id));
        // modify client as inactive
        clientSaved.setActive(false);
        // save client modified
        clientRepository.save(clientSaved);
    }
}
