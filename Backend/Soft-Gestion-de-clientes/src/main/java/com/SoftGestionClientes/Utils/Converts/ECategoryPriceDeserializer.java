package com.SoftGestionClientes.Utils.Converts;

import com.SoftGestionClientes.Enums.ECategoryPrice;
import com.SoftGestionClientes.Exception.BadRequestException;
import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;

public class ECategoryPriceDeserializer extends StdDeserializer<ECategoryPrice> {
    public ECategoryPriceDeserializer(){
        super(ECategoryPrice.class);
    }

    @Override
    public ECategoryPrice deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException, JacksonException {
        String value = jsonParser.getValueAsString();
        try{
            return ECategoryPrice.valueOf(value);
        } catch (IllegalArgumentException ex){
            throw new BadRequestException("Invalid category");
        }
    }
}
