//External Imports
const { Validator } = require("node-input-validator");
//Const/vars
let validateCheck;

/**
 * @description We validate the request headers parameters
 * @param {Object} headers event.headers type
 * @returns a boolean
 * @example Content-Type, Authorization, etc
 */
const validateHeadersParams = async (headers) => {
  validateCheck = false;

  try{
    if(headers != null){
      validateCheck = new Validator(
        {
          headers,
        },
        {
          "headers": "required|object",
          "headers.Content-Type": "required|string",
          "headers.Authorization": "required|string|minLength:100",
          "headers.x-api-key": "required|string|minLength:30",
        }
      );
      await validateCheck.check()
    }

  } catch (error) {
    console.log(error);
  }

  return validateCheck;
}

module.exports = {
  validateHeadersParams
}