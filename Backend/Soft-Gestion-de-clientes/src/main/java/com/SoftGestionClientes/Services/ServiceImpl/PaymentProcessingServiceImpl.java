package com.SoftGestionClientes.Services.ServiceImpl;

import com.SoftGestionClientes.Dto.ClientDto;
import com.SoftGestionClientes.Dto.PaymentDto;
import com.SoftGestionClientes.Dto.ReportDto;
import com.SoftGestionClientes.Enums.EReportStatus;
import com.SoftGestionClientes.Exception.NotFoundException;
import com.SoftGestionClientes.Exception.PaymentProcessingException;
import com.SoftGestionClientes.Repository.IClientRepository;
import com.SoftGestionClientes.Services.IPaymentProcessingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
public class PaymentProcessingServiceImpl implements IPaymentProcessingService {
    @Autowired
    private PaymentServiceImpl paymentService;

    @Autowired
    private IClientRepository clientRepository;

    @Override
    @Transactional
    public void processPayments(ReportDto report) {
        // verify if status is validated or run an exception
        if (report.getStatus() != EReportStatus.VALIDATED){
            throw new PaymentProcessingException("Report is not validated");
        }
        // get all payments of report
        Set<PaymentDto> provisionalPayments = report.getPayments();
        // process each payment
        for (PaymentDto payment : provisionalPayments){
           processingSinglePayment(payment);
        }
    }

    private void processingSinglePayment(PaymentDto payment){
        // validate if client exists
        validateClient(payment.getClient().getId());
        // if exists then save payment
        paymentService.createPayment(payment);
    }

    private void validateClient(Long clientId){
        //validate if client exists or run an exception
        if (!clientRepository.existsById(clientId)){
            throw new NotFoundException("Client not found");
        }
    }
}
