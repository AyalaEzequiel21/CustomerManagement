package com.SoftGestionClientes.Services.ServiceImpl;

import com.SoftGestionClientes.Dto.SaleDto;
import com.SoftGestionClientes.Model.Sale;
import com.SoftGestionClientes.Repository.ISaleRepository;
import com.SoftGestionClientes.Services.ISaleService;
import com.SoftGestionClientes.Utils.Converts.SaleConverter;
import com.SoftGestionClientes.Utils.DateValidator;
import com.SoftGestionClientes.Utils.SaleUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SaleServiceImpl implements ISaleService {
    @Autowired
    DateValidator dateValidator;

    @Autowired
    SaleConverter saleConverter;

    @Autowired
    ISaleRepository saleRepository;

    @Autowired
    SaleUtils saleUtils;

    /**
     * Retrieves a list of sales by client id.
     * @param clientId for find all sales
     * @return a List of SaleDto objects representing all sales of client.
     */
    @Override
    public List<SaleDto> getSalesByClientId(Long clientId) {
        // check if exists the client and is active
        saleUtils.validateClient(clientId);
        //get all sales of client
        List<Sale> salesSaved = saleRepository.findByClientId(clientId);
        // check that the lis is empty
        saleUtils.validateList(salesSaved);
        // returns a lis with dtos of all sales by client id
        return salesSaved.stream()
                .map(sale -> saleConverter.convertToDto(sale, SaleDto.class))
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a list of sales by sale sate.
     * @param saleDate for find all sales
     * @return a List of SaleDto objects representing all sales of a date.
     */
    @Override
    public List<SaleDto> getSalesBySaleDate(LocalDate saleDate) {
        // validate if date is correct
        dateValidator.isDateAfterToday(saleDate);
        // get all sales of that date
        List<Sale> salesSaved = saleRepository.findBySaleDate(saleDate);
        // validate that the lis is not empty
        saleUtils.validateList(salesSaved);
        // returns a list with dtos of all sales by date
        return salesSaved.stream()
                .map(sale -> saleConverter.convertToDto(sale, SaleDto.class))
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a list of all sales.
     *
     * @return a List of SaleDto objects representing all sales.
     */
    @Override
    public List<SaleDto> getAllSales() {
        // get all sales
        List<Sale> salesSaved = saleRepository.findAll();
        // check if the list is not empty
        saleUtils.validateList(salesSaved);
        // returns a list with dtos of all sales
        return salesSaved.stream()
                .map(sale -> saleConverter.convertToDto(sale, SaleDto.class))
                .collect(Collectors.toList());
    }

    /**
     * Create a sale.
     * @param  sale to create
     * @return a dto of sale created.
     */
    @Override
    public SaleDto registerSale(SaleDto sale) {
        return null;
    }

    @Override
    public SaleDto updaterSale(SaleDto sale) {
        return null;
    }

    @Override
    public SaleDto getSaleById(Long id) {
        return null;
    }

    @Override
    public void deleteSaleById(Long id) {

    }
}
