package com.SoftGestionClientes.Services.ServiceImpl;

import com.SoftGestionClientes.Dto.ReportDto;
import com.SoftGestionClientes.Exception.BadRequestException;
import com.SoftGestionClientes.Exception.NotFoundException;
import com.SoftGestionClientes.Model.Report;
import com.SoftGestionClientes.Repository.IReportRepository;
import com.SoftGestionClientes.Services.IReportService;
import com.SoftGestionClientes.Utils.Converts.ReportConverter;
import com.SoftGestionClientes.Utils.DateValidator;
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

    /**
     * Retrieves a list of reports by a date.
     * @param reportDate date of report
     * @return List of ReportDto objects representing reports filtered by date.
     */
    @Override
    public List<ReportDto> getReportByDate(LocalDate reportDate) {
        // verify if date is valid or run an exception
        if (!dateValidator.isDateBeforeToday(reportDate)){
            throw new BadRequestException("The date is not valid");
        }
        // get all reports saved with same date
        List<Report> reportsSaved = reportRepository.findByReportDate(reportDate);
        // if the list is empty run an exception
        if (reportsSaved.isEmpty()){
            throw new NotFoundException("Reports not found with that date");
        }
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
        if (reportsSaved.isEmpty()){
            throw new NotFoundException("Reports not found");
        }
        // returns a list with dtos of all reports
        return reportsSaved.stream()
                .map(report -> reportConverter.convertToDto(report, ReportDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public ReportDto createReport(ReportDto report) {
        if (report.getPayments().isEmpty()){
            throw new BadRequestException("Cannot create a report without payments");
        }
        return null;
    }

    @Override
    public ReportDto updateReport(ReportDto report) {
        return null;
    }

    @Override
    public ReportDto getReportById(Long id) {
        return null;
    }

    @Override
    public void deleteReportById(Long id) {

    }
}
