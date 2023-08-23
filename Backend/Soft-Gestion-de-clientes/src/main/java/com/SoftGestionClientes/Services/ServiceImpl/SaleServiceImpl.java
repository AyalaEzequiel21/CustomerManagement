package com.SoftGestionClientes.Services.ServiceImpl;

import com.SoftGestionClientes.Dto.SaleDto;
import com.SoftGestionClientes.Exception.BadRequestException;
import com.SoftGestionClientes.Exception.NotFoundException;
import com.SoftGestionClientes.Model.Sale;
import com.SoftGestionClientes.Repository.ISaleRepository;
import com.SoftGestionClientes.Services.ISaleService;
import com.SoftGestionClientes.Utils.Converts.SaleConverter;
import com.SoftGestionClientes.Utils.DateValidator;
import com.SoftGestionClientes.Utils.SaleUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    @Transactional
    public SaleDto registerSale(SaleDto sale) {
        // check if exists the client
        saleUtils.validateClient(sale.getClient().getId());
        // check if the saleDetails is not empty
        saleUtils.validateSetDetails(sale.getDetail());
        // get the total sale
        double totalSale = saleUtils.getTotalSale(sale.getDetail());
        //set the new totalSale
        sale.setTotalSale(totalSale);
        // save the sale
        Sale saleSaved = saleRepository.save(saleConverter.convertToEntity(sale, Sale.class));
        // add total sale to balance client
        saleUtils.addTotalSaleToBalance(saleSaved);
        // if exists any payment, process payment
        if (sale.getPayment() != null){
            saleUtils.processPayment(sale.getPayment());
        }
        //returns dto of sale created
        return saleConverter.convertToDto(saleSaved, SaleDto.class);
    }

    /**
     * Update a sale.
     * @param  sale to update
     * @return a dto of sale updated.
     */
    @Override
    @Transactional
    public SaleDto updaterSale(SaleDto sale) {
        // get the last version saved
        Sale saleSaved = saleRepository.findById(sale.getId()).orElseThrow(() -> new NotFoundException("Sale not found"));
        // check if match bot clients, the saved and the new
        if (!sale.getClient().getId().equals(saleSaved.getClient().getId())){
            throw new BadRequestException("The client does not match");
        }
        // check if the list is not empty
        saleUtils.validateSetDetails(sale.getDetail());
        // subtract the last total to balance client
        saleUtils.subtractTotalSaleToBalance(saleSaved);
        // get the total sale
        double totalSale = saleUtils.getTotalSale(sale.getDetail());
        // set the new total
        sale.setTotalSale(totalSale);
        // save the sale updated
        Sale saleUpdatedSaved = saleRepository.save(saleConverter.convertToEntity(sale, Sale.class));
        // add total sale to balance client
        saleUtils.addTotalSaleToBalance(saleUpdatedSaved);
        // returns a dto of sale updated
        return saleConverter.convertToDto(saleUpdatedSaved, SaleDto.class);
    }

    /**
     * Retrieves a salle by id.
     * @param  id of sale to find
     * @return a dto of sale found.
     */
    @Override
    public SaleDto getSaleById(Long id) {
        // get the sale by id
        Sale saleSaved = saleRepository.findById(id).orElseThrow(() -> new NotFoundException("Sale not found"));
        // returns a dto ofm sale found
        return saleConverter.convertToDto(saleSaved, SaleDto.class);
    }

    /**
     * Delete a salle by id.
     * @param  id of sale to delete
     */
    @Override
    public void deleteSaleById(Long id) {

    }
}
