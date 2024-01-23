'use strict';
//Const/vars
let newUUID;

/**
 * @description Generate uuid
 * @returns a integer
 * @example 109401114
 */
const generateUUID = async () => {
  try {
    newUUID = null;

    newUUID = parseInt(Math.random() * 10000000 + 100000000);
  } catch (error) {
    console.error(
      `ERROR in function generateUUID(). Caused by ${error} . Specific stack is ${error.stack} `,
    );
  }
  return newUUID;
};

module.exports = {
  generateUUID,
};
