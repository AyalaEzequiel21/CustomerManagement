package com.SoftGestionClientes.Services;

import com.SoftGestionClientes.Dto.OrderListDto;

import java.time.LocalDate;
import java.util.List;

public interface IOrderListService {
    List<OrderListDto> getOrdersListByDate(LocalDate orderDate);
    List<OrderListDto> getAllOrdersList();
    OrderListDto createOrderList(OrderListDto orderList);
    OrderListDto updateOrderList(OrderListDto orderList);
    OrderListDto getOrderListById(Long id);
    void deleteOrderListById(Long id);
}
