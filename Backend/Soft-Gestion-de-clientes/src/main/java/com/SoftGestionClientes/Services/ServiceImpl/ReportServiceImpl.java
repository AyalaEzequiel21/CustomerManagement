package com.SoftGestionClientes.Services.ServiceImpl;

import com.SoftGestionClientes.Dto.ReportDto;
import com.SoftGestionClientes.Enums.EReportStatus;
import com.SoftGestionClientes.Enums.ERole;
import com.SoftGestionClientes.Exception.BadRequestException;
import com.SoftGestionClientes.Exception.NotFoundException;
import com.SoftGestionClientes.Model.Report;
import com.SoftGestionClientes.Repository.IReportRepository;
import com.SoftGestionClientes.Services.IReportService;
import com.SoftGestionClientes.Utils.Converts.ReportConverter;
import com.SoftGestionClientes.Utils.DateValidator;
import com.SoftGestionClientes.Utils.ReportUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportServiceImpl implements IReportService {

    @Autowired
    DateValidator dateValidator;

    @Autowired
    IReportRepository reportRepository;

    @Autowired
    ReportConverter reportConverter;

    @Autowired
    ReportUtils reportUtils;

    @Autowired
    PaymentProcessingServiceImpl paymentProcessingService;

    /**
     * Retrieves a list of reports by a date.
     * @param reportDate date of report
     * @return List of ReportDto objects representing reports filtered by date.
     */
    @Override
    public List<ReportDto> getReportByDate(LocalDate reportDate) {
        // verify if date is valid or run an exception
        dateValidator.isDateAfterToday(reportDate);
        // get all reports saved with same date
        List<Report> reportsSaved = reportRepository.findByReportDate(reportDate);
        // if the list is empty run an exception
        reportUtils.validateReports(reportsSaved);
        // return a list with dtos of all reports with some date
        return reportsSaved.stream()
                .map(report -> reportConverter.convertToDto(report, ReportDto.class))
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a list of all reports.
     *
     * @return List of ReportDto objects representing all reports.
     */
    @Override
    public List<ReportDto> getAllReports() {
        // get all reports saved
        List<Report> reportsSaved = reportRepository.findAll();
        //if the list is empty run an exception
        reportUtils.validateReports(reportsSaved);
        // returns a list with dtos of all reports
        return reportsSaved.stream()
                .map(report -> reportConverter.convertToDto(report, ReportDto.class))
                .collect(Collectors.toList());
    }

    /**
     * Create a report.
     * @param report to save
     * @return Dto of report saved.
     */
    @Override
    public ReportDto createReport(ReportDto report, ERole userRole) {
        // validate if the list of payments is empty, if it is an exception is executed
        reportUtils.validatePayments(report);
        // verify userRole
        if (userRole == ERole.DELIVERY){
            // set the status of report as PENDING_VALIDATION if userRole is DELIVERY
            report.setStatus(EReportStatus.PENDING_VALIDATION);
        }else{
            // set the status of report as VALIDATE if userRole is ADMIN or BILLER
            report.setStatus(EReportStatus.VALIDATED);
        }
        // save the report with status modified
        Report reportSaved = reportRepository.save(reportConverter.convertToEntity(report, Report.class));
        // convert report to dto
        ReportDto reportDto = reportConverter.convertToDto(reportSaved, ReportDto.class);
        // if report is validated process all payments
        if (reportSaved.getStatus() == EReportStatus.VALIDATED){
            paymentProcessingService.processPayments(reportDto);
        }
        // returns a dto of report saved
        return reportDto;
    }

    @Override
    public ReportDto updateReport(ReportDto report, ERole userRole) {
        // validate if the list of payments is empty, if it is an exception is executed
        reportUtils.validatePayments(report);
        // verify if exists the report
        Report reportSaved = reportRepository.findById(report.getId()).orElseThrow(() -> new NotFoundException("Report not found"));
        // verify that status of report saved is pending and status of report to update is validated
        if (reportSaved.getStatus() == EReportStatus.PENDING_VALIDATION && report.getStatus() == EReportStatus.VALIDATED){
            // if is valid, process all payments
            paymentProcessingService.processPayments(report);
        }
        // save the new report
        Report reportUpdated = reportRepository.save(reportConverter.convertToEntity(report, Report.class));
        // return dto of report updated
        return reportConverter.convertToDto(reportUpdated, ReportDto.class);
    }

    @Override
    public ReportDto getReportById(Long id) {
        return null;
    }

    @Override
    public void deleteReportById(Long id) {

    }
}
