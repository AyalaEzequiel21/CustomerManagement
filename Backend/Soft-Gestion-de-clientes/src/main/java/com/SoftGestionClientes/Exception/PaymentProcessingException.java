package com.SoftGestionClientes.Exception;

public class PaymentProcessingException extends RuntimeException{
    public PaymentProcessingException(String message){
        super(message);
    }
}
