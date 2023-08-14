package com.SoftGestionClientes.Utils;

import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DateValidator {
    public boolean isDateBeforeToday(LocalDate date){
        LocalDate today = LocalDate.now();
        return date.isBefore(today);
    }
}
