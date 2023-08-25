package com.SoftGestionClientes.Services.ServiceImpl;

import com.SoftGestionClientes.Dto.PaymentDto;
import com.SoftGestionClientes.Enums.EPaymentMethod;
import com.SoftGestionClientes.Exception.BadRequestException;
import com.SoftGestionClientes.Exception.NotFoundException;
import com.SoftGestionClientes.Model.Client;
import com.SoftGestionClientes.Model.Payment;
import com.SoftGestionClientes.Repository.IClientRepository;
import com.SoftGestionClientes.Repository.IPaymentRepository;
import com.SoftGestionClientes.Services.IPaymentService;
import com.SoftGestionClientes.Utils.ClientUtils;
import com.SoftGestionClientes.Utils.Converts.PaymentConverter;
import com.SoftGestionClientes.Utils.Converts.PaymentUtils;
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
    private IClientRepository clientRepository;

    @Autowired
    private ClientUtils clientUtils;

    @Autowired
    private IPaymentRepository paymentRepository;

    @Autowired
    private PaymentConverter paymentConverter;

    @Autowired
    private PaymentUtils paymentUtils;

    @Autowired
    private DateValidator dateValidator;

    /**
     * Retrieves a list of payments as DTOs for a specific client.
     * @param clientId ID of the client
     * @return List of PaymentDto objects.
     */
    @Override
    public List<PaymentDto> getPaymentByClientId(Long clientId) {
        // validate the client
        paymentUtils.validateClient(clientId);
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
        if(!paymentSaved.getAmount().equals(payment.getAmount())){
            // Add the original amount from the customer's balance
            clientUtils.updateClientBalance(clientSaved, paymentSaved.getAmount(), true);
            // Subtract the new amount from the customer's balance
            clientUtils.updateClientBalance(clientSaved, payment.getAmount(), false);
        }
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
    @Transactional
    public void deletePaymentById(Long id) {
        // get a payment or run an exception
        Payment paymentSaved = paymentRepository.findById(id).orElseThrow(() -> new NotFoundException("Payment not found"));
        // get the client of payment
        Client client = paymentSaved.getClient();
        // add the amount payment to balance client
        clientUtils.updateClientBalance(client, paymentSaved.getAmount(), true);
        // delete the payment
        paymentRepository.deleteById(id);
    }
}
