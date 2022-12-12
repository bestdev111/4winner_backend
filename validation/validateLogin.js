const validator = require('validator');
const isEmpty = require('./isEmpty');

const validateLogin = (data) => {
  const errors = {};
  data.userName = !isEmpty(data.userName) ? data.userName : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  if (validator.isEmpty(data.userName)) {
    errors.name = 'UserName is required';
  }
  if (!validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must have 6 and 30 chars';
  }
  if (validator.isEmpty(data.password)) {
    errors.password = 'Password is required';
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateLogin;
