package com.SoftGestionClientes.Utils;

import com.SoftGestionClientes.Dto.ClientDto;
import com.SoftGestionClientes.Dto.PaymentDto;
import com.SoftGestionClientes.Dto.SaleDetailDto;
import com.SoftGestionClientes.Dto.SaleDto;
import com.SoftGestionClientes.Exception.NotFoundException;
import com.SoftGestionClientes.Model.Client;
import com.SoftGestionClientes.Model.Payment;
import com.SoftGestionClientes.Model.Sale;
import com.SoftGestionClientes.Repository.ISaleRepository;
import com.SoftGestionClientes.Services.ServiceImpl.ClientServiceImpl;
import com.SoftGestionClientes.Services.ServiceImpl.PaymentServiceImpl;
import com.SoftGestionClientes.Utils.Converts.ClientConverter;
import com.SoftGestionClientes.Utils.Converts.SaleConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
public class SaleUtils {
    @Autowired
    ISaleRepository saleRepository;

    @Autowired
    SaleConverter saleConverter;
    @Autowired
    ClientServiceImpl clientService;

    @Autowired
    PaymentServiceImpl paymentService;
    @Autowired
    ClientConverter clientConverter;


    public void validateSale(SaleDto sale){
        if (!saleRepository.existsById(sale.getId())){
            throw new NotFoundException("Sale not found");
        }
    }

    public void validateList(List<Sale> sales){
        if (sales.isEmpty()){
            throw new NotFoundException("Sales not found");
        }
    }
    public void validateSetDetails(Set<SaleDetailDto> details){
        if (details.isEmpty()){
            throw new NotFoundException("Sales not found");
        }
    }

    public void validateClient(Long clientId){
        ClientDto clientSaved = clientService.getClientById(clientId);
    }

    public double getTotalSale(Set<SaleDetailDto> details){
        double total = 0.0;
        for (SaleDetailDto saleDetail : details){
            total = total + saleDetail.getProvisionalTotal();
        }
        return total;
    }

    public void addTotalSaleToBalance(Sale sale){
        ClientDto client = clientService.getClientById(sale.getClient().getId());
        client.setBalance(client.getBalance() + sale.getTotalSale());
        clientService.updateClient(client);
    }
    public void subtractTotalSaleToBalance(Sale sale){
        ClientDto client = clientService.getClientById(sale.getClient().getId());
        client.setBalance(client.getBalance() - sale.getTotalSale());
        clientService.updateClient(client);
    }

    public void processPayment(PaymentDto payment){
        paymentService.createPayment(payment);
    }

    public void processDelete(Long id){
        // get sale by id
        Sale saleSaved = saleRepository.findById(id).orElseThrow(() -> new NotFoundException("Sale not found"));
        // get the payment of sale
        Payment payment = saleSaved.getPayment();
        // get client of sale
        Client client = saleSaved.getClient();
        // delete payment
        paymentService.deletePaymentById(payment.getId());
        // update the balance client
        subtractTotalSaleToBalance(saleSaved);
    }
}
