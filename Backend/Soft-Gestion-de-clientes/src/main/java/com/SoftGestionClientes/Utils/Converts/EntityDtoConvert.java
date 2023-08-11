package com.SoftGestionClientes.Utils.Converts;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;

public abstract class EntityDtoConvert<E, D> {

    @Autowired
    private ObjectMapper objectMapper;


    public D convertToDto(E entity, Class<D> dtoClass) {
        return  objectMapper.convertValue(entity, dtoClass);
    }

    public E convertToEntity(D dto, Class<E> entityClass){
        return objectMapper.convertValue(dto, entityClass);
    }
}
