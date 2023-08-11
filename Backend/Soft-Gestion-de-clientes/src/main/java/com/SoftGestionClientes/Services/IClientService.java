package com.SoftGestionClientes.Services;

import com.SoftGestionClientes.Dto.ClientDto;
import com.SoftGestionClientes.Model.Client;

import java.util.List;

public interface IClientService {
    List<ClientDto> getClientByName(String name);
    ClientDto getClientById(Long id);
    ClientDto createClient(Client client);
}
