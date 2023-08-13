package com.SoftGestionClientes.Services.ServiceImpl;

import com.SoftGestionClientes.Dto.ClientDto;
import com.SoftGestionClientes.Model.Client;
import com.SoftGestionClientes.Repository.IClientRepository;
import com.SoftGestionClientes.Services.IClientService;
import com.SoftGestionClientes.Utils.Converts.ClientConverter;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class ClientServiceImpl implements IClientService {

    @Autowired
    IClientRepository clientRepository;

    @Autowired
    ClientConverter clientConverter;
    @Override
    public List<ClientDto> getClientByName(String name) {

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

    @Override
    public ClientDto getClientById(Long id) {
        return null;
    }

    @Override
    public ClientDto createClient(ClientDto client) {
        return null;
    }

    @Override
    public ClientDto updateClient(ClientDto client) {
        return null;
    }

    @Override
    public void deleteClientById(Long id) {

    }
}
