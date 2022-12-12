
const validator = require('validator');
const isEmpty = require('./isEmpty');

const validateRegister = (data, isCreatingCustomer = 0) => {
  const errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.userName = !isEmpty(data.userName) ? data.userName : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.passwordConfirm = !isEmpty(data.passwordConfirm) ? data.passwordConfirm : '';

  if (!validator.isLength(data.userName, { min: 2, max: 30 })) {
    errors.name = 'userName must be between 2 and 30 chars';
  }

  if (validator.isEmpty(data.userName)) {
    errors.name = 'userName field is required';
  }
  if (!validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 chars';
  }

  if (validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }
  if(!isCreatingCustomer){
    if (!validator.isLength(data.password, { min: 6, max: 30 })) {
      errors.password = 'Password must have between 6 and 30 chars';
    }
  
    if (validator.isEmpty(data.password)) {
      errors.password = 'Password is required';
    }
  
    if (!validator.isLength(data.passwordConfirm, { min: 6, max: 30 })) {
      errors.passwordConfirm = 'Password must have between 6 and 30 chars';
    }
  
    if (validator.isEmpty(data.passwordConfirm)) {
      errors.passwordConfirm = 'Confirm Password is required';
    }
    if (!validator.equals(data.password, data.passwordConfirm)) {
      errors.passwordConfirm = 'Password and Confirm Password must match';
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateRegister;
