package com.SoftGestionClientes.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponseException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(AlreadyRegisterException.class)
    public ResponseEntity<ErrorResponseException> handleAlreadyRegisterException(AlreadyRegisterException ex){
        ErrorResponseException errorResponse = new ErrorResponseException(HttpStatus.ALREADY_REPORTED, ex);
        return new ResponseEntity<>(errorResponse, HttpStatus.ALREADY_REPORTED);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponseException> handleBadRequestException(BadRequestException ex){
        ErrorResponseException errorResponse = new ErrorResponseException(HttpStatus.BAD_REQUEST, ex);
        return  new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponseException> handleNotFoundException(NotFoundException ex){
        ErrorResponseException errorResponse = new ErrorResponseException(HttpStatus.NOT_FOUND, ex);
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(PaymentProcessingException.class)
    public ResponseEntity<ErrorResponseException> handlePaymentProcessingException(PaymentProcessingException ex){
        ErrorResponseException errorResponse = new ErrorResponseException(HttpStatus.NOT_IMPLEMENTED, ex);
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_IMPLEMENTED);
    }


}
