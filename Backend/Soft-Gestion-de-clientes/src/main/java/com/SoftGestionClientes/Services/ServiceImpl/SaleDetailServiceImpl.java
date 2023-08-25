package com.SoftGestionClientes.Services.ServiceImpl;

import com.SoftGestionClientes.Dto.SaleDetailDto;
import com.SoftGestionClientes.Exception.AlreadyRegisterException;
import com.SoftGestionClientes.Exception.BadRequestException;
import com.SoftGestionClientes.Exception.NotFoundException;
import com.SoftGestionClientes.Model.SaleDetail;
import com.SoftGestionClientes.Repository.ISaleDetailRepository;
import com.SoftGestionClientes.Services.ISaleDetailService;
import com.SoftGestionClientes.Utils.Converts.SaleDetailConverter;
import com.SoftGestionClientes.Utils.SaleDetailUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SaleDetailServiceImpl implements ISaleDetailService {

    @Autowired
    private ISaleDetailRepository saleDetailRepository;

    @Autowired
    private SaleDetailConverter saleDetailConverter;

    @Autowired
    private SaleDetailUtils saleDetailUtils;


    /**
     * Retrieves a list of sales detail by sale id.
     * @param saleId for find all details
     * @return a List of ReportDto objects representing all sales detail of a sale.
     */
    @Override
    public List<SaleDetailDto> getAllSaleDetailsBySaleId(Long saleId) {
        // get all sale details of a sale
        List<SaleDetail> saleDetailsSaved = saleDetailRepository.findBySaleId(saleId);
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
    @Transactional
    public SaleDetailDto createSaleDetail(SaleDetailDto saleDetail) {
        // check if quantity is valid
        saleDetailUtils.validateQuantity(saleDetail.getQuantity());
        // check that the product is active
        saleDetailUtils.validateIfProductIsActive(saleDetail.getProduct());
        // check if exists the saleDetail and run an exception
        if (saleDetailRepository.existsById(saleDetail.getId())){
            throw new AlreadyRegisterException("Sale detail has been registered");
        }
        //check if sale exists
        saleDetailUtils.validateIfExistsSale(saleDetail.getSale());
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
    @Transactional
    public SaleDetailDto updateSaleDetail(SaleDetailDto saleDetail) {
        // check if quantity is valid
        saleDetailUtils.validateQuantity(saleDetail.getQuantity());
        // check that the product is active
        saleDetailUtils.validateIfProductIsActive(saleDetail.getProduct());
        // get saleDetail saved
        SaleDetail saleDetailSaved = saleDetailRepository.findById(saleDetail.getId()).orElseThrow(()-> new NotFoundException("Sale detail not found"));
        // check that the client match in both sale detail
        if (saleDetailSaved.getSale().getClient() != saleDetailConverter.convertToEntity(saleDetail, SaleDetail.class).getSale().getClient()){
            throw new BadRequestException("The client does not match");
        }// check that the sale match in both sale detail
        if (!saleDetailSaved.getSale().getId().equals(saleDetail.getId())){
            throw new BadRequestException("The sale does not match");
        }
        // get the provisional total of sale detail
        double newProvisionalTotal = saleDetailUtils.getProvisionalTotal(saleDetail);
        // set the new provisional total
        saleDetail.setProvisionalTotal(newProvisionalTotal);
        // save th sale detail
        SaleDetail newSaleDetailSaved = saleDetailRepository.save(saleDetailConverter.convertToEntity(saleDetail, SaleDetail.class));
        // returns the dto of sale detail created
        return saleDetailConverter.convertToDto(newSaleDetailSaved, SaleDetailDto.class);
    }

    /**
     * get a sale detail by id.
     * @param id of sale detail to find
     * @return a saleDetailDto of saleDetail found
     */
    @Override
    public SaleDetailDto getSaleDetailById(Long id) {
        // get sale detail by id or run an exception if is not found
        SaleDetail saleDetailSaved = saleDetailRepository.findById(id).orElseThrow(()-> new NotFoundException("Sale detail is not found"));
        //return a dto of sale detail saved
        return saleDetailConverter.convertToDto(saleDetailSaved, SaleDetailDto.class);
    }

    /**
     * delete a sale detail by id.
     * @param id of sale detail to delete
     *
     */
    @Override
    public void deleteSaleDetailById(Long id) {
        // first check if exists the sale detail else run an exception
        if (!saleDetailRepository.existsById(id)){
            throw new NotFoundException("Sale detail is not found");
        }
        //delete sale detail
        saleDetailRepository.deleteById(id);
    }
}
