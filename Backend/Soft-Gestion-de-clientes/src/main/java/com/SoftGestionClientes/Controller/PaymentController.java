package com.SoftGestionClientes.Controller;

import com.SoftGestionClientes.Dto.PaymentDto;
import com.SoftGestionClientes.Services.ServiceImpl.PaymentServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/pradera/payments")
public class PaymentController {
    @Autowired
    PaymentServiceImpl paymentService;

    HashMap<String, Object> data;

    @GetMapping
    public ResponseEntity<Object> getAllPayments(){
        // initialize the data
        data = new HashMap<>();
        // get all payments
        List<PaymentDto> paymentsSaved = paymentService.getAllPayments();
        // add the payments to data
        data.put("data", paymentsSaved);
        // returns a response with status OK and the payments
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<Object> createPayment(@RequestBody PaymentDto payment){
        // initialize the data
        data = new HashMap<>();
        // create the new payment
        PaymentDto newPayment = paymentService.createPayment(payment);
        // add the new payment to data
        data.put("Successful", newPayment);
        // return a response with status CREATED and the new payment
        return new ResponseEntity<>(data, HttpStatus.CREATED);
    }
}
