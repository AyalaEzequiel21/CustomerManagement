export const validateNumberFormat = (value: string) => {
    const parts = value.split(".");
    if (parts.length > 2) return false; // No debe tener más de un punto decimal
    if (parts[0] && !/^\d+$/.test(parts[0])) return false; // Parte entera debe ser un número
    if (parts[1] && !/^\d{1,2}$/.test(parts[1])) return false; // Parte decimal debe tener 1 o 2 dígitos
    return true;
  }