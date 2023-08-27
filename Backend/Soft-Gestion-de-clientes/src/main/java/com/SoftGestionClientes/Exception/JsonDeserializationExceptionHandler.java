package com.SoftGestionClientes.Exception;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;


import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class JsonDeserializationExceptionHandler {

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseBody
    public ResponseEntity<Object> handleJsonDeserializationException(HttpMessageNotReadableException ex) {
        // create a custom response for JSON deserialization errors
        Map<String, Object> data = new HashMap<>();
        data.put("error", "Bad Request");
        data.put("message", "Invalid request data");

        return new ResponseEntity<>(data, HttpStatus.BAD_REQUEST);
    }
}