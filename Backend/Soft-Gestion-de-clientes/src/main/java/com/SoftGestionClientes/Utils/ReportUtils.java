package com.SoftGestionClientes.Utils;

import com.SoftGestionClientes.Dto.ClientDto;
import com.SoftGestionClientes.Dto.PaymentDto;
import com.SoftGestionClientes.Dto.ReportDto;
import com.SoftGestionClientes.Enums.EReportStatus;
import com.SoftGestionClientes.Exception.NotFoundException;
import com.SoftGestionClientes.Exception.PaymentProcessingException;
import com.SoftGestionClientes.Repository.IClientRepository;
import com.SoftGestionClientes.Services.ServiceImpl.PaymentServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Component
public class ReportUtils {
    @Autowired
    PaymentServiceImpl paymentService;

    @Autowired
    IClientRepository clientRepository;

    @Transactional
    public void processPayments(ReportDto report){
        // verify if status is validated or run an exception
        if (report.getStatus() == EReportStatus.PENDING_VALIDATION){
            throw new PaymentProcessingException("Report is not validated");
        }
        // get all payments of report
        Set<PaymentDto> provisionalPayments = report.getPayments();
        // process each payment
        for (PaymentDto payment : provisionalPayments){
            // get the client
            ClientDto client = payment.getClient();
            //verify if client exists or run an exception
            if (!clientRepository.existsById(client.getId())){
                throw new NotFoundException("Some client was not found.");
            }
            // create the payment and save
            paymentService.createPayment(payment);
        }
    }
}
