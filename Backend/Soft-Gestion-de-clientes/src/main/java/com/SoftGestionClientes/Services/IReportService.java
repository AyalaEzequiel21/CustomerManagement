package com.SoftGestionClientes.Services;

import com.SoftGestionClientes.Dto.ReportDto;
import com.SoftGestionClientes.Enums.ERole;

import java.time.LocalDate;
import java.util.List;

public interface IReportService {
    List<ReportDto> getReportByDate(LocalDate reportDate);
    List<ReportDto> getAllReports();
    ReportDto createReport(ReportDto report, ERole userRole);
    ReportDto updateReport(ReportDto report);
    ReportDto getReportById(Long id);
    void deleteReportById(Long id);
}
