'use strict';
/**
 * @description get a json with the http status code, a message and input
 * @param {Number} statusCode Number type
 * @param {String} message String type
 * @param {Object} input Object type
 * @returns a json for the lambda response
 */
const bodyResponse = async (statusCode, message, input) => {
  try {
    return {
      statusCode: statusCode,
      body: JSON.stringify(
        {
          message: message,
        },
        null,
        2,
      ),
    };
  } catch (error) {
    console.error(
      `Error in bodyResponse() function. Caused by ${error}. Specific stack is ${error.stack}`,
    );
  }
};

module.exports = { bodyResponse };
