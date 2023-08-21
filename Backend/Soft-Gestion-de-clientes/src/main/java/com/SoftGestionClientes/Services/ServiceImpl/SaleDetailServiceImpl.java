package com.SoftGestionClientes.Services.ServiceImpl;

import com.SoftGestionClientes.Dto.SaleDetailDto;
import com.SoftGestionClientes.Exception.AlreadyRegisterException;
import com.SoftGestionClientes.Model.SaleDetail;
import com.SoftGestionClientes.Repository.ISaleDetailRepository;
import com.SoftGestionClientes.Services.ISaleDetailService;
import com.SoftGestionClientes.Utils.Converts.SaleDetailConverter;
import com.SoftGestionClientes.Utils.SaleDetailUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SaleDetailServiceImpl implements ISaleDetailService {

    @Autowired
    ISaleDetailRepository saleDetailRepository;

    @Autowired
    SaleDetailConverter saleDetailConverter;

    @Autowired
    SaleDetailUtils saleDetailUtils;


    /**
     * Retrieves a list of sales detail by sale id.
     * @param saleId for find all details
     * @return a List of ReportDto objects representing all sales detail of a sale.
     */
    @Override
    public List<SaleDetailDto> getAllSaleDetailsBySale(Long saleId) {
        // get all sale details of a sale
        List<SaleDetail> saleDetailsSaved = saleDetailRepository.findBySale(saleId);
        // check if the list is empty and run an exception
        saleDetailUtils.validateList(saleDetailsSaved);
        // returns a list with dtos of all sale details
        return saleDetailsSaved.stream()
                .map(detail -> saleDetailConverter.convertToDto(detail, SaleDetailDto.class))
                .collect(Collectors.toList());
    }

    /**
     * Create a sale detail.
     * @param saleDetail to create
     * @return a saleDetailDto of saleDetail created
     */
    @Override
    public SaleDetailDto createSaleDetail(SaleDetailDto saleDetail) {
        // check if quantity is valid
        saleDetailUtils.validateQuantity(saleDetail.getQuantity());
        // check if exists the saleDetail and run an exception
        if (saleDetailRepository.existsById(saleDetail.getId())){
            throw new AlreadyRegisterException("Sale detail has been registered");
        }
        // get the provisional total of sale detail
        double newProvisionalTotal = saleDetailUtils.getProvisionalTotal(saleDetail);
        // set the new provisional total
        saleDetail.setProvisionalTotal(newProvisionalTotal);
        // save th sale detail
        SaleDetail saleDetailSaved = saleDetailRepository.save(saleDetailConverter.convertToEntity(saleDetail, SaleDetail.class));
        // returns the dto of sale detail created
        return saleDetailConverter.convertToDto(saleDetailSaved, SaleDetailDto.class);
    }

    /**
     * Update a sale detail.
     * @param saleDetail to update
     * @return a saleDetailDto of saleDetail updated
     */
    @Override
    public SaleDetailDto updateSaleDetail(SaleDetailDto saleDetail) {
        return null;
    }

    @Override
    public SaleDetailDto getSaleDetailById(Long id) {
        return null;
    }

    @Override
    public void deleteSaleDetailById(Long id) {

    }
}
