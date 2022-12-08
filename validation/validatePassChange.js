
const validator = require('validator');
const isEmpty = require('./isEmpty');

const validatePassChange = (data) => {
  const errors = {};

  data.newPass = !isEmpty(data.newPass) ? data.newPass : '';
  data.confirmPass = !isEmpty(data.confirmPass)
    ? data.confirmPass
    : '';
  if (!validator.isLength(data.newPass, { min: 6, max: 30 })) {
    errors.password = 'Password must have between 6 and 30 chars';
  }

  if (validator.isEmpty(data.newPass)) {
    errors.newPass = 'Password is required';
  }

  if (!validator.isLength(data.confirmPass, { min: 6, max: 30 })) {
    errors.confirmPass = 'Password must have between 6 and 30 chars';
  }

  if (validator.isEmpty(data.confirmPass)) {
    errors.confirmPass = 'Confirm Password is required';
  }
  if (!validator.equals(data.newPass, data.confirmPass)) {
    errors.confirmPass = 'Password and Confirm Password must match';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validatePassChange;
