package com.SoftGestionClientes.Utils;

import com.SoftGestionClientes.Dto.ReportDto;
import com.SoftGestionClientes.Exception.BadRequestException;
import com.SoftGestionClientes.Model.Report;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ReportUtils {

    public void validatePayments(ReportDto report){
        if (report.getPayments().isEmpty()){
            throw new BadRequestException("Cannot create a report without payments");
        }
    }
    public void validateReports(List<Report> reports){
        if (reports.isEmpty()){
            throw new BadRequestException("Reports not found");
        }
    }
}
