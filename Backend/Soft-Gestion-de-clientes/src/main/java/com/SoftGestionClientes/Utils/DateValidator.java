package com.SoftGestionClientes.Utils;

import com.SoftGestionClientes.Exception.BadRequestException;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Component
public class DateValidator {
    // check if the date is valid (must be before that today)
    public void isDateAfterToday(LocalDate date){
        LocalDate today = LocalDate.now();
        if (date.isAfter(today)){
            throw new BadRequestException("The date is not valid");
        };
    }

    // convert a string to localDate
    public LocalDate parseDateStringToLocalDate(String dateString) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        return LocalDate.parse(dateString, formatter);
    }
}
