package com.SoftGestionClientes.Utils;

import com.SoftGestionClientes.Dto.PaymentDto;
import com.SoftGestionClientes.Exception.BadRequestException;
import com.SoftGestionClientes.Exception.NotFoundException;
import com.SoftGestionClientes.Model.Client;
import com.SoftGestionClientes.Model.Payment;
import com.SoftGestionClientes.Repository.IClientRepository;
import com.SoftGestionClientes.Repository.IPaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
public class PaymentUtils {

    @Autowired
    ClientUtils clientUtils;

    @Autowired
    IClientRepository clientRepository;

    @Autowired
    IPaymentRepository paymentRepository;

    // check if the client exists and is active or run an exception
    public Client getAndValidateClient(Long clientId){
        return clientUtils.getClientAndValidate(clientId);
    }

    // check if the list is empty and run an exception
    public void validateList(List<Payment> payments){
        if (payments.isEmpty()){
            throw new NotFoundException("Payments not found");
        }
    }

    // check if the amount id more than 0 and run an exception
    public void validateAmount(PaymentDto payment){
        if (payment.getAmount() <= 0){
            throw new BadRequestException("Amount cannot be less than 0");
        }
    }

    // subtract the payment amount to the client balance
    public void subtractPaymentAmountToClientBalance(Client client, double amount){
        clientUtils.updateClientBalance(client, amount, false);
    }

    public void addPaymentAmountToClientBalance(Client client, double amount){
        clientUtils.updateClientBalance(client, amount, true);
    }

    // add the new payment to the client list
    public void addPaymentToClientList(Client client, Payment payment){
        clientUtils.addPayment(client, payment);
    }

    // get the payment if exists or run an exception
    public Payment getPaymentValidated(Long id){
        return paymentRepository.findById(id).orElseThrow(() -> new NotFoundException("Payment not found"));
    }
}
