package com.SoftGestionClientes.Services.ServiceImpl;

import com.SoftGestionClientes.Dto.PaymentDto;
import com.SoftGestionClientes.Enums.EPaymentMethod;
import com.SoftGestionClientes.Model.Client;
import com.SoftGestionClientes.Model.Payment;
import com.SoftGestionClientes.Repository.IPaymentRepository;
import com.SoftGestionClientes.Services.IPaymentService;
import com.SoftGestionClientes.Utils.Converts.PaymentConverter;
import com.SoftGestionClientes.Utils.PaymentUtils;
import com.SoftGestionClientes.Utils.DateValidator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import static java.rmi.server.LogStream.log;

@Slf4j
@Service
public class PaymentServiceImpl implements IPaymentService {

    @Autowired
    private IPaymentRepository paymentRepository;

    @Autowired
    private PaymentConverter paymentConverter;

    @Autowired
    private PaymentUtils paymentUtils;

    @Autowired
    private DateValidator dateValidator;

    private String tag = "Payment service";

    /**
     * Retrieves a list of payments as DTOs for a specific client.
     * @param clientId ID of the client
     * @return List of PaymentDto objects.
     */
    @Override
    public List<PaymentDto> getPaymentsByClientId(Long clientId) {
        // validate the client
        Client client  = paymentUtils.getAndValidateClient(clientId);
        // get the payments by client id
        List<Payment> paymentsSaved = paymentRepository.findByClientId(clientId);
        // check if the list is not empty
        paymentUtils.validateList(paymentsSaved);
        // returns a list with dtos of all payments of a client
        return paymentsSaved.stream()
                .map(payment -> paymentConverter.convertToDto(payment, PaymentDto.class))
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a list of payments as DTOs.
     *
     * @return List of PaymentDto objects.
     */
    @Override
    public List<PaymentDto> getAllPayments() {
        // get all payments
        List<Payment> paymentsSaved = paymentRepository.findAll();
        // check if the lis is not empty
        paymentUtils.validateList(paymentsSaved);
        // return a list with dtos of all payments
        return paymentsSaved.stream()
                .map(payment -> paymentConverter.convertToDto(payment, PaymentDto.class))
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a list of payments as DTOs for a specific date.
     * @param paymentDate date of payment
     * @return List of PaymentDto objects.
     */
    @Override
    public List<PaymentDto> getPaymentsByPaymentDate(LocalDate paymentDate) {
        // check if th date is valid
        dateValidator.isDateAfterToday(paymentDate);
        // get all payments by date payment
        List<Payment> paymentsSaved = paymentRepository.findByPaymentDate(paymentDate);
        // check if the list is not empty
        paymentUtils.validateList(paymentsSaved);
        // return a list with dtos of all payments by a date
        return paymentsSaved.stream()
                .map(payment -> paymentConverter.convertToDto(payment, PaymentDto.class))
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a list of payments as DTOs for a specific payment method.
     * @param paymentMethod of payment
     * @return List of PaymentDto objects.
     */
    @Override
    public List<PaymentDto> getPaymentsByPaymentMethod(EPaymentMethod paymentMethod) {
        // get all payments by her payment method
        List<Payment> paymentsSaved = paymentRepository.findByPaymentMethod(paymentMethod);
        // validate if the list is empty or run an exception
        paymentUtils.validateList(paymentsSaved);
        // returns a list with dtos of payments filtered by payment method
        return paymentsSaved.stream()
                .map(payment -> paymentConverter.convertToDto(payment, PaymentDto.class))
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
        paymentUtils.validateAmount(payment);
        log.info("Amount validated from " + tag);
        // get client registered and active
        Client clientSaved = paymentUtils.getAndValidateClient(payment.getClient().getId());
        log.info("Client obtained from " + tag);
        // update client balance
        paymentUtils.subtractPaymentAmountToClientBalance(clientSaved, payment.getAmount());
        log.info("Payment subtracted from " + tag);
        // save payment
        Payment paymentSaved = paymentRepository.save(paymentConverter.convertToEntity(payment, Payment.class));
        log.info("Payment saved from " + tag);
        // update the client with the new payment
        paymentUtils.addPaymentToClientList(clientSaved, paymentSaved);
        log.info("Payment added to client set from " + tag);
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
        paymentUtils.validateAmount(payment);
       // get the prev payment
        Payment oldPayment = paymentUtils.getPaymentValidated(payment.getId());
        // get client validated
        Client clientSaved = paymentUtils.getAndValidateClient(payment.getClient().getId());
        // check if both payments are not equals
        if(!oldPayment.getAmount().equals(payment.getAmount())){
            // Add previous payment amount
            paymentUtils.addPaymentAmountToClientBalance(clientSaved, oldPayment.getAmount());
            // Subtract the new amount to the client balance
            paymentUtils.subtractPaymentAmountToClientBalance(clientSaved, payment.getAmount());
        }
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
        Payment paymentSaved = paymentUtils.getPaymentValidated(id);
        //return dto of payment
        return paymentConverter.convertToDto(paymentSaved, PaymentDto.class);
    }

    /**
     * delete a payment by id
     * @param id of payment
     *
     */
    @Override
    @Transactional
    public void deletePaymentById(Long id) {
        // get a payment or run an exception
        Payment paymentSaved = paymentUtils.getPaymentValidated(id);
        // get the client of payment
        Client client = paymentUtils.getAndValidateClient(paymentSaved.getClient().getId());
        // add the amount payment to balance client
        paymentUtils.addPaymentAmountToClientBalance(client, paymentSaved.getAmount());
        // delete the payment
        paymentRepository.deleteById(id);
    }
}
