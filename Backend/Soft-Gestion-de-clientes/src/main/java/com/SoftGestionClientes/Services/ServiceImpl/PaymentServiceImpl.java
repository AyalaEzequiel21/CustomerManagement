package com.SoftGestionClientes.Services.ServiceImpl;

import com.SoftGestionClientes.Dto.PaymentDto;
import com.SoftGestionClientes.Exception.BadRequestException;
import com.SoftGestionClientes.Exception.NotFoundException;
import com.SoftGestionClientes.Model.Client;
import com.SoftGestionClientes.Model.Payment;
import com.SoftGestionClientes.Repository.IClientRepository;
import com.SoftGestionClientes.Repository.IPaymentRepository;
import com.SoftGestionClientes.Services.IPaymentService;
import com.SoftGestionClientes.Utils.ClientUtils;
import com.SoftGestionClientes.Utils.Converts.PaymentConverter;
import com.SoftGestionClientes.Utils.DateValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentServiceImpl implements IPaymentService {
    @Autowired
    IClientRepository clientRepository;

    @Autowired
    ClientUtils clientUtils;

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
     * @return PaymentDto object.
     */
    @Transactional
    @Override
    public PaymentDto createPayment(PaymentDto payment) {
        //validate that amount is positive
        if (payment.getAmount() < 0){
            throw new BadRequestException("Amount cannot be less that zero");
        }
        // get client registered and active
        Client clientSaved = clientUtils.getClientAndValidate(payment.getClient().getId());
        // update client balance
        clientUtils.updateClientBalance(clientSaved, payment.getAmount(), false);
        // save payment
        Payment paymentSaved = paymentRepository.save(paymentConverter.convertToEntity(payment, Payment.class));
        // return dto of payment
        return paymentConverter.convertToDto(paymentSaved, PaymentDto.class);
    }

    /**
     * Update payment
     * @param payment to update
     * @return PaymentDto object.
     */
    @Transactional
    @Override
    public PaymentDto updatePayment(PaymentDto payment) {
        //validate that amount is positive
        if (payment.getAmount() < 0){
            throw new BadRequestException("Amount cannot be less that zero");
        }
        // get existing payment or run a exception
        Payment paymentSaved = paymentRepository.findById(payment.getId()).orElseThrow(()-> new NotFoundException("Payment not found"));
        // get client registered and active
        Client clientSaved = clientUtils.getClientAndValidate(payment.getClient().getId());
        // Add the original amount from the customer's balance
        clientUtils.updateClientBalance(clientSaved, paymentSaved.getAmount(), true);
        // Subtract the new amount from the customer's balance
        clientUtils.updateClientBalance(clientSaved, payment.getAmount(), false);
        // update client balance
        clientRepository.save(clientSaved);
        // update the new amount on payment saved
        paymentSaved.setAmount(payment.getAmount());
        // save the payment with new amount
        Payment newPayment = paymentRepository.save(paymentConverter.convertToEntity(payment, Payment.class));
        // return dto of payment
        return paymentConverter.convertToDto(newPayment, PaymentDto.class);
    }

    /**
     * get a payment by id
     * @param id of payment
     * @return PaymentDto object.
     */
    @Override
    public PaymentDto getPaymentById(Long id) {
        // find payment saved
        Payment paymentSaved = paymentRepository.findById(id).orElseThrow(()-> new NotFoundException("Payment with id: " + id +" not found"));
        //return dto of payment
        return paymentConverter.convertToDto(paymentSaved, PaymentDto.class);
    }

    /**
     * delete a payment by id
     * @param id of payment
     *
     */
    @Override
    public void deletePaymentById(Long id) {
        // validate if exists a payment with that id
        if (paymentRepository.existsById(id)){
            // if exists then delete payment
            paymentRepository.deleteById(id);
        }
    }
}
