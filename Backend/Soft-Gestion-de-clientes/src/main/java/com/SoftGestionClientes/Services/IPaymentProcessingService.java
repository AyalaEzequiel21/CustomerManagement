package com.SoftGestionClientes.Services;

import com.SoftGestionClientes.Dto.ReportDto;

public interface IPaymentProcessingService {
    void processPayments(ReportDto report);
}
