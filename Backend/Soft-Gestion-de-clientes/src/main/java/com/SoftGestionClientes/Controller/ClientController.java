package com.SoftGestionClientes.Controller;

import com.SoftGestionClientes.Dto.ClientDto;
import com.SoftGestionClientes.Enums.ECategoryPrice;
import com.SoftGestionClientes.Enums.ERole;
import com.SoftGestionClientes.Services.ServiceImpl.ClientServiceImpl;
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
        // returns a reponse entity with status OK and the data
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<Object> createClient(@RequestBody ClientDto client){
        // initialize the data
        data = new HashMap<>();
        // create the client
        ClientDto clientCreated = clientService.createClient(client, ERole.BILLER);
        // add client created to data
        data.put("sucessfull", clientCreated);
        // returns a reponse entity with status CREATED and the data
        return new ResponseEntity<>(data, HttpStatus.CREATED);
    }

    @PutMapping("/update")
    public ResponseEntity<Object> updateClient(@RequestBody ClientDto client){
        // initialize the data
        data = new HashMap<>();
        // update the client
        ClientDto clientUpdated = clientService.updateClient(client);
        // add the client updated to data
        data.put("Client updated", clientUpdated);
        // returns  a reponse entity with status OK and the data
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClient(@PathVariable Long id){
        // delete client
        clientService.deleteClientById(id, ERole.BILLER);
        return new ResponseEntity<>("Client has been deleted", HttpStatus.NO_CONTENT);
    }

}

