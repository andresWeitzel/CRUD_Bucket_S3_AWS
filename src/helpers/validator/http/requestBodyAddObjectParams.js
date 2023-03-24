//External Imports
const { Validator } = require("node-input-validator");
//Const/vars
let validateCheck;
let validatorObj;
let eventBodyObj;

/**
 * @description We validate the request body parameters for upload an object to the bucket
 * @param {object} eventBody event.body type
 * @returns a boolean
 */
const validateBodyAddObjectParams = async (eventBody) => {
  eventBodyObj = null;
  validatorObj= null;
  validateCheck = false;
  
  try{
    if(eventBody!=null){

      eventBodyObj ={
        data:{
          type: await eventBody["type"],
          format: await eventBody["format"],
          description: await eventBody["description"],
          url: await eventBody["url"],
        }
      }

      validatorObj = new Validator(
        {
          eventBodyObj,
        },
        {
          "eventBodyObj.data.type": "required|string|minLength:3|maxLength:50",
          "eventBodyObj.data.format": "required|string|minLength:2|maxLength:50",
          "eventBodyObj.data.description": "string|minLength:3|maxLength:100",
          "eventBodyObj.data.url": "string|minLength:3|maxLength:2000",
        }
      );
      validateCheck = await validatorObj.check();
      
    }

  } catch (error) {
    console.log(error);
  }

  return validateCheck;
}

module.exports = {
    validateBodyAddObjectParams
}