package com.SoftGestionClientes.Services.ServiceImpl;

import com.SoftGestionClientes.Dto.OrderListDto;
import com.SoftGestionClientes.Exception.NotFoundException;
import com.SoftGestionClientes.Model.OrderList;
import com.SoftGestionClientes.Repository.IOrderListRepository;
import com.SoftGestionClientes.Services.IOrderListService;
import com.SoftGestionClientes.Utils.Converts.OrderListConverter;
import com.SoftGestionClientes.Utils.DateValidator;
import com.SoftGestionClientes.Utils.OrderListUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderListServiceImpl implements IOrderListService {

    @Autowired
    IOrderListRepository orderListRepository;

    @Autowired
    OrderListConverter orderListConverter;

    @Autowired
    OrderListUtils orderListUtils;

    @Autowired
    DateValidator dateValidator;

    /**
     * Retrieves a list of orders list as DTOs by date.
     * @param orderDate of order list
     * @return List of OrderListDto objects.
     */
    @Override
    public List<OrderListDto> getOrdersListByDate(LocalDate orderDate) {
        // verify if the date is valid or run an exception
        dateValidator.isDateAfterToday(orderDate);
        // get orders by date
        List<OrderList> ordersSaved = orderListRepository.findByOrderDate(orderDate);
        // if list is empty run an exception
        orderListUtils.validateList(ordersSaved);
        // returns a list with dtos of all orders
        return ordersSaved.stream()
                .map(orderList -> orderListConverter.convertToDto(orderList, OrderListDto.class))
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a list of orders list as DTOs.
     *
     * @return List of OrderListDto objects.
     */
    @Override
    public List<OrderListDto> getAllOrdersList() {
        // get all orders
        List<OrderList> ordersSaved = orderListRepository.findAll();
        // if list is empty run an exception
        orderListUtils.validateList(ordersSaved);
        // return a list with dtos of all orders
        return ordersSaved.stream().map(orderList -> orderListConverter.convertToDto(orderList, OrderListDto.class))
                .collect(Collectors.toList());
    }

    /**
     * create an order list.
     * @param orderList to register
     * @return OrderListDto registered.
     */
    @Override
    public OrderListDto createOrderList(OrderListDto orderList) {
        // check sales
        orderListUtils.validateSales(orderList.getSales());
        // save the order list
        OrderList orderListSaved = orderListRepository.save(orderListConverter.convertToEntity(orderList, OrderList.class));
        // return the dto of order created
        return orderListConverter.convertToDto(orderListSaved, OrderListDto.class);
    }

    /**
     * update an order list.
     * @param orderList to update
     * @return OrderListDto updated.
     */
    @Override
    public OrderListDto updateOrderList(OrderListDto orderList) {
        // if not exists an order with that id run an exception
        if (!orderListRepository.existsById(orderList.getId())){
            throw new NotFoundException("Order list not found");
        }
        // if date not valid run an exception
        dateValidator.isDateAfterToday(orderList.getOrderDate());
        // check sales
        orderListUtils.validateSales(orderList.getSales());
        // save the order updated
        OrderList orderListUpdated = orderListRepository.save(orderListConverter.convertToEntity(orderList, OrderList.class));
        // return the dto of order updated
        return orderListConverter.convertToDto(orderListUpdated, OrderListDto.class);
    }

    /**
     * Retrieves an order list as DTOs by id.
     * @param id of order list
     * @return OrderListDto objects.
     */
    @Override
    public OrderListDto getOrderListById(Long id) {
        // get order by id or run an exception if not exists
        OrderList orderSaved = orderListRepository.findById(id).orElseThrow(() -> new NotFoundException("Order list not found"));
        // return the dto of order found
        return orderListConverter.convertToDto(orderSaved, OrderListDto.class);
    }

    /**
     * No implement
     *
     */
    @Override
    public void deleteOrderListById(Long id) {

    }
}
