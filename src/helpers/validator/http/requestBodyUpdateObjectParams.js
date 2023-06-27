"use strict";
//External
const { Validator } = require("node-input-validator");
//Const/vars
let validateCheck;
let validatorObj;
let eventBodyObj;

/**
 * @description We validate the request body parameters for update an object to the bucket
 * @param {object} eventBody event.body type
 * @returns a boolean
 */
const validateBodyUpdateObjectParams = async (eventBody) => {
  try {
    eventBodyObj = null;
    validatorObj = null;
    validateCheck = false;

    if (eventBody != null) {
      eventBodyObj = {
        data: {
          type: await eventBody["type"],
          format: await eventBody["format"],
          description: await eventBody["description"],
          url: await eventBody["url"],
        },
      };

      validatorObj = new Validator(
        {
          eventBodyObj,
        },
        {
          "eventBodyObj.data.type": "string|minLength:3|maxLength:50",
          "eventBodyObj.data.format": "string|minLength:2|maxLength:50",
          "eventBodyObj.data.description": "string|minLength:3|maxLength:100",
          "eventBodyObj.data.url": "string|minLength:3|maxLength:2000",
        }
      );
      validateCheck = await validatorObj.check();
    }
  } catch (error) {
    console.error(
      `ERROR in function validateBodyUpdateObjectParams(). Caused by ${error} . Specific stack is ${error.stack} `
    );
  }

  return validateCheck;
};

module.exports = {
  validateBodyUpdateObjectParams,
};
