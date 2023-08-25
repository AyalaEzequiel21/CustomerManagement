package com.SoftGestionClientes.Services;

import com.SoftGestionClientes.Dto.ClientDto;
import com.SoftGestionClientes.Enums.ECategoryPrice;
import com.SoftGestionClientes.Enums.ERole;
import com.SoftGestionClientes.Model.Client;

import java.util.List;

public interface IClientService {
    List<ClientDto> getClientByName(String name);
    List<ClientDto> getClientByCategoryPrice(ECategoryPrice categoryPrice);
    List<ClientDto> getAllClients();
    List<ClientDto> getAllClientsInactive();
    ClientDto getClientById(Long id);
    ClientDto createClient(ClientDto client, ERole userRole);
    ClientDto updateClient(ClientDto client, ERole userRole);
    void deleteClientById(Long id, ERole userRole);
}
