package com.SoftGestionClientes.Utils;

import com.SoftGestionClientes.Exception.BadRequestException;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DateValidator {
    public void isDateAfterToday(LocalDate date){
        LocalDate today = LocalDate.now();
        if (date.isAfter(today)){
            throw new BadRequestException("The date is not valid");
        };
    }
}
