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
        List<Client> clientsSaved = clientRepository.findByName(name);

        if (clientsSaved.isEmpty()){
            return clientsSaved.stream().filter(client -> client.isActive())
                    .map(client -> clientConverter.convertToDto(client, ClientDto.class))
                    .collect(Collectors.toList());
        }
        throw new NotFoundException("No clients found with that name.");
    }

    /**
     * Retrieves a list of active clients as DTOs.
     *
     * @return List of ClientDto objects representing active clients.
     */
    @Override
    public List<ClientDto> getAllClients() {
        List<Client> clientsSaved = clientRepository.findAll();
        return clientsSaved.stream().filter(client -> client.isActive())
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
        List<Client> clientsInactive = clientRepository.findAllByIsActiveFalse();
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
        Client clientSaved = clientRepository.findById(id).orElseThrow(() -> new NotFoundException("No client found with id: " + id));
        if (!clientSaved.isActive()){
            throw new NotFoundException("Client with id: " + id +" is inactive");
        }
        return clientConverter.convertToDto(clientSaved, ClientDto.class);

    }

    /**
     * Create a client.
     * @param client to register
     * @return a ClientDto object representing active client.
     */
    @Override
    public ClientDto createClient(ClientDto client) {
        Client clientSaved;
        if (clientRepository.existsByName(client.getName())){
            throw new AlreadyRegisterException("Name has already been registered");
        }
        clientSaved = clientRepository.save(clientConverter.convertToEntity(client, Client.class));
        return clientConverter.convertToDto(clientSaved, ClientDto.class);
    }

    /**
     * Update a client.
     * @param client to update
     * @return a ClientDto object representing active client.
     */
    @Override
    public ClientDto updateClient(ClientDto client) {
        Client clientUpdated;
        if (clientRepository.existsById(client.getId())){
            clientUpdated = clientRepository.save(clientConverter.convertToEntity(client, Client.class));
            return clientConverter.convertToDto(clientUpdated, ClientDto.class);
        }
        throw new NotFoundException("No client found");
    }

    /**
     * Modify a client as inactive.
     * @param id of client
     *
     */
    @Override
    public void deleteClientById(Long id) {
        Client clientSaved = clientRepository.findById(id).orElseThrow(() -> new NotFoundException("No client found with id: " + id));
        clientSaved.setActive(false);
        clientRepository.save(clientSaved);
    }
}
