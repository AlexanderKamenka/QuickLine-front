export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validatePhone = (phone) => {
    const re = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return re.test(phone);
};

export const validateRequired = (value) => {
    return value && value.toString().trim().length > 0;
};

export const validateMinLength = (value, minLength) => {
    return value && value.length >= minLength;
};

export const validateMaxLength = (value, maxLength) => {
    return value && value.length <= maxLength;
};

export const validateNumber = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
};

export const validatePositiveNumber = (value) => {
    return validateNumber(value) && parseFloat(value) > 0;
};