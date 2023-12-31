package com.SoftGestionClientes.Controller;

import com.SoftGestionClientes.Dto.ClientDto;
import com.SoftGestionClientes.Enums.ECategoryPrice;
import com.SoftGestionClientes.Enums.ERole;
import com.SoftGestionClientes.Exception.AlreadyRegisterException;
import com.SoftGestionClientes.Exception.BadRequestException;
import com.SoftGestionClientes.Exception.NotFoundException;
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

    /**
     * Retrieves a list of active clients
     *
     * @return a response with the list of clients and status OK
     */
    @GetMapping
    public ResponseEntity<Object> getAllClients(){
        // initialize the data
        data = new HashMap<>();
        // get all clients
        List<ClientDto> clients = clientService.getAllClients();
        // add clients to data
        data.put("data", clients);
        // return a response entity with status OK and the data
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    /**
     * Retrieves a list of inactive clients
     *
     * @return a response with the list of clients and status OK
     */
    @GetMapping("/inactive")
    public ResponseEntity<Object> getAllInactiveProducts(){
        // initialize the data
        data = new HashMap<>();
        // get all clients inactive
        List<ClientDto> inactiveClients = clientService.getAllClientsInactive();
        // add the clients to data
        data.put("data", inactiveClients);
        // return a response with status OK and the list with inactive clients
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    /**
     * Retrieves a list of active clients by Name
     * @param clientName for to search
     * @return a response with the list of clients and status OK
     */
    @GetMapping("/{clientName}")
    public ResponseEntity<Object> getClientsByName(@PathVariable String clientName){
        // initialize the data
        data = new HashMap<>();
        // get clients by a name
        List<ClientDto> clientsByName = clientService.getClientByName(clientName);
        // add clients to data
        data.put("data", clientsByName);
        // return a response entity with status OK and the data
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    /**
     * Retrieves an active client by id
     * @param clientId for to search
     * @return a response with the client and status OK
     */
    @GetMapping("/id/{clientId}")
    public ResponseEntity<Object> getClientById(@PathVariable Long clientId){
        // initialize the data
        data = new HashMap<>();
        // get the client by id
        ClientDto clientSaved = clientService.getClientById(clientId);
        // add the client to data
        data.put("data", clientSaved);
        //return a response with status OK and the client
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    /**
     * Retrieves a list of active clients by category price
     * @param categoryPrice for to search
     * @return a response with the list of clients and status OK
     */
    @GetMapping("/categories/{categoryPrice}")
    public ResponseEntity<Object> getClientsByCategoryPrice(@PathVariable ECategoryPrice categoryPrice){
        // initialize the data
        data = new HashMap<>();
        // get clients by the category price
        List<ClientDto> clientsByCategory = clientService.getClientByCategoryPrice(categoryPrice);
        // add clients to data
        data.put("data", clientsByCategory);
        // returns a response entity with status OK and the data
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    /**
     * Create a client
     * @param client for to create
     * @return a response with the client created and status CREATED
     */
    @PostMapping("/register")
    public ResponseEntity<Object> createClient(@RequestBody ClientDto client){
        // initialize the data
        data = new HashMap<>();
        // create the client
        ClientDto clientCreated = clientService.createClient(client, ERole.BILLER);
        // add client created to data
        data.put("successful", clientCreated);
        // returns a response entity with status CREATED and the data
        return new ResponseEntity<>(data, HttpStatus.CREATED);
    }

    /**
     * Update a client
     * @param client for to update
     * @return a response with the client updated and status OK
     */
    @PutMapping("/update")
    public ResponseEntity<Object> updateClient(@RequestBody ClientDto client){
        // initialize the data
        data = new HashMap<>();
        // update the client
        ClientDto clientUpdated = clientService.updateClient(client);
        // add the client updated to data
        data.put("Client updated", clientUpdated);
        // returns  a response entity with status OK and the data
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    /**
     * Delete a client
     * @param clientId for to delete
     * @return a response with status NO CONTENT
     */
    @DeleteMapping("/{clientId}")
    public ResponseEntity<?> deleteClient(@PathVariable Long clientId){
        // delete client
        clientService.deleteClientById(clientId, ERole.BILLER);
        return new ResponseEntity<>("Client has been deleted", HttpStatus.NO_CONTENT);
    }

    ////////////////////
    // EXCEPTION HANDLERS
    ////////////////////

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Object> handleBadReqException(BadRequestException e){
        // create a custom response to BadRequestException
        data = new HashMap<>();
        data.put("error", "Bad Request");
        data.put("message", e.getMessage());

        return new ResponseEntity<>(data, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Object> handleNotFoundException(NotFoundException e){
        // create a custom response to BadRequestException
        data = new HashMap<>();
        data.put("error", "Not Found");
        data.put("message", e.getMessage());

        return new ResponseEntity<>(data, HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(AlreadyRegisterException.class)
    public ResponseEntity<Object> handleAlreadyRegisterException(AlreadyRegisterException e){
        // create a custom response to BadRequestException
        data = new HashMap<>();
        data.put("error", "Already Register");
        data.put("message", e.getMessage());

        return new ResponseEntity<>(data, HttpStatus.ALREADY_REPORTED);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGenericException(Exception e){
        data = new HashMap<>();
        data.put("error", "Internal Error");
        data.put("message", e.getMessage());

        return new ResponseEntity<>(data, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

