package com.SoftGestionClientes.Services.ServiceImpl;

import com.SoftGestionClientes.Dto.PaymentDto;
import com.SoftGestionClientes.Exception.BadRequestException;
import com.SoftGestionClientes.Exception.NotFoundException;
import com.SoftGestionClientes.Model.Client;
import com.SoftGestionClientes.Model.Payment;
import com.SoftGestionClientes.Repository.IClientRepository;
import com.SoftGestionClientes.Repository.IPaymentRepository;
import com.SoftGestionClientes.Services.IPaymentService;
import com.SoftGestionClientes.Utils.Converts.PaymentConverter;
import com.SoftGestionClientes.Utils.DateValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentServiceImpl implements IPaymentService {

    @Autowired
    IClientRepository clientRepository;

    @Autowired
    IPaymentRepository paymentRepository;

    @Autowired
    PaymentConverter paymentConverter;

    @Autowired
    DateValidator dateValidator;

    /**
     * Retrieves a list of payments as DTOs for a specific client.
     * @param clientId ID of the client
     * @return List of PaymentDto objects.
     */
    @Override
    public List<PaymentDto> getPaymentByClientId(Long clientId) {
        List<Payment> paymentsSaved = paymentRepository.findByClientId(clientId);
        if (paymentsSaved.isEmpty()){
            throw new NotFoundException("No payment found for this client");
        }
        return paymentsSaved.stream().map(payment -> paymentConverter.convertToDto(payment, PaymentDto.class))
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a list of payments as DTOs.
     *
     * @return List of PaymentDto objects.
     */
    @Override
    public List<PaymentDto> getAllPayments() {
        List<Payment> paymentsSaved = paymentRepository.findAll();
        return paymentsSaved.stream().map(payment -> paymentConverter.convertToDto(payment, PaymentDto.class))
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a list of payments as DTOs for a specific date.
     * @param paymentDate date of payment
     * @return List of PaymentDto objects.
     */
    @Override
    public List<PaymentDto> getPaymentsByPaymentDate(LocalDate paymentDate) {
        if (!dateValidator.isDateBeforeToday(paymentDate)){
            throw new BadRequestException("The date is not valid");
        }
        List<Payment> paymentsSaved = paymentRepository.findByPaymentDate(paymentDate);
        if (paymentsSaved.isEmpty()){
            throw new NotFoundException("No payment found on that date");
        }
        return paymentsSaved.stream().map(payment -> paymentConverter.convertToDto(payment, PaymentDto.class))
                .collect(Collectors.toList());
    }

    /**
     * Create a payment
     * @param payment to register
     * @return PaymentDto objects.
     */
    @Override
    public PaymentDto createPayment(PaymentDto payment) {
        if (payment.getAmount() < 0){
            throw new BadRequestException("Amount cannot be less that zero");
        }
        Client clientSaved = clientRepository.findById(payment.getClient().getId()).orElseThrow(()-> new NotFoundException("The client are not registered or is inactive"));
        if (!clientSaved.isActive()){
             throw new NotFoundException("The client are not registered or is inactive");
        }
        clientSaved.setBalance(clientSaved.getBalance() - payment.getAmount());
        clientRepository.save(clientSaved);
        Payment paymentSaved = paymentRepository.save(paymentConverter.convertToEntity(payment, Payment.class));
        return paymentConverter.convertToDto(paymentSaved, PaymentDto.class);
    }

    @Override
    public PaymentDto updatePayment(PaymentDto payment) {
        return null;
    }

    @Override
    public PaymentDto getPaymentById(Long id) {
        return null;
    }

    @Override
    public void deletePaymentById(Long id) {

    }
}
