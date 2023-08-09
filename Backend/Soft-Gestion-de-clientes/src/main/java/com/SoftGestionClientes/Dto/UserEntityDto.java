package com.SoftGestionClientes.Dto;

import com.SoftGestionClientes.Enums.ERole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserEntityDto {
    private Long id;
    private String name;
    private String password;
    private ERole role;
}
