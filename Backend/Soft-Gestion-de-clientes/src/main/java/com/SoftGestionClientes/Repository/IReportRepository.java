package com.SoftGestionClientes.Repository;

import com.SoftGestionClientes.Model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByReportDate(LocalDate reportDate);  // find reports by date
}
