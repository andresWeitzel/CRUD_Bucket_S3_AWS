//External Imports
const { Validator } = require("node-input-validator");
//Const/vars
let validateCheck;

/**
 * @description We validate the request body parameters for upload an object to the bucket
 * @param {object} body event.body type
 * @returns a boolean
 */
const validateBodyAddObjectParams = async (body) => {
  validateCheck = false;
  
  try{
    if(body!=null){
      validateCheck = new Validator(
        {
          body,
        },
        {
          "type": "required|string|minLength:3|maxLength:50",
          "description": "string|minLength:3|maxLength:100",
          "url": "string|minLength:3|maxLength:256",
        }
      );
      await validateCheck.check();
    }

  } catch (error) {
    console.log(error);
  }

  return validateCheck;
}

module.exports = {
    validateBodyAddObjectParams
}