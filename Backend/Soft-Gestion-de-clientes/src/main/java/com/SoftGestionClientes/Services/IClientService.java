package com.SoftGestionClientes.Services;

import com.SoftGestionClientes.Dto.ClientDto;
import com.SoftGestionClientes.Enums.ECategoryPrice;
import com.SoftGestionClientes.Enums.ERole;
import com.SoftGestionClientes.Model.Client;

import java.util.List;

public interface IClientService {
    List<ClientDto> getClientByName(String name); // get all clients that her name contains NAME
    List<ClientDto> getClientByCategoryPrice(ECategoryPrice categoryPrice); // get  clients with a certain CATEGORY PRICE
    List<ClientDto> getAllClients(); // get all active clients
    List<ClientDto> getAllClientsInactive(); // get all inactive clients
    ClientDto getClientById(Long id); // get a client by ID
    ClientDto createClient(ClientDto client, ERole userRole); // create a new client
    ClientDto updateClient(ClientDto client); // update a client that exists
    void deleteClientById(Long id, ERole userRole); // delete a client
}
