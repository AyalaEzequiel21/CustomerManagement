package com.SoftGestionClientes.Controller;

import com.SoftGestionClientes.Dto.ClientDto;
import com.SoftGestionClientes.Enums.ECategoryPrice;
import com.SoftGestionClientes.Enums.ERole;
import com.SoftGestionClientes.Services.ServiceImpl.ClientServiceImpl;
import com.SoftGestionClientes.Utils.DateValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/pradera/clients")
public class ClientController {

    @Autowired
    private ClientServiceImpl clientService;

    HashMap<String, Object> data;

    @GetMapping
    public ResponseEntity<Object> getAllClients(){
        // initialize the data
        data = new HashMap<>();
        // get all clients
        List<ClientDto> clients = clientService.getAllClients();
        // add clients to data
        data.put("data", clients);
        // return a reponse entity with status OK and the data
        return new ResponseEntity<>(data, HttpStatus.OK);
    }
    @GetMapping("/{name}")
    public ResponseEntity<Object> getClientsByName(@PathVariable String name){
        // initialize the data
        data = new HashMap<>();
        // get clients by a name
        List<ClientDto> clientsbyName = clientService.getClientByName(name);
        // add clients to data
        data.put("data", clientsbyName);
        // return a reponse entity with status OK and the data
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @GetMapping("/{categoryPrice}")
    public ResponseEntity<Object> getClientsByCategoryPrice(@PathVariable ECategoryPrice categoryPrice){
        // initialize the data
        data = new HashMap<>();
        // get clients by the category price
        List<ClientDto> clientsByCategory = clientService.getClientByCategoryPrice(categoryPrice);
        // add clients to data
        data.put("data", clientsByCategory);
        // return a reponse entity with status OK and the data
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Object> createClient(@RequestBody ClientDto client, ERole userRole){
        // initialize the data
        data = new HashMap<>();
        // create the client
        ClientDto clientCreated = clientService.createClient(client, userRole);
        // add client created to data
        data.put("sucessfull", clientCreated);
        // return a reponse entity with status CREATED and the data
        return new ResponseEntity<>(data, HttpStatus.CREATED);
    }
}
