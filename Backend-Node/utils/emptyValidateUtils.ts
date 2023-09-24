// function to validate if a list is not empty
export const isEmptyList = (value: any) => {
    if (Array.isArray(value) || typeof value === 'string') {
      return value.length === 0;
    }
      
    if (value instanceof Map || value instanceof Set) {
      return value.size === 0;
    }
      
    if (typeof value === 'object') {
      return Object.keys(value).length === 0;
    }
      
    return value == null;   
}