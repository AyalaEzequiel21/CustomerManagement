package com.SoftGestionClientes.Dto;

import com.SoftGestionClientes.Enums.EReportStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReportDto {
    private Long id;
    private LocalDate reportDate;
    private Set<PaymentDto> payments;
    private EReportStatus status;
}
