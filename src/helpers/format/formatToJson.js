"use strict";
/**
 * @description Convert to json format
 * @param {Object} obj Object type
 * @returns an object json with this format
 */
const formatToJson = async (obj) => {
    try {
        obj = (typeof obj != "object") ? await JSON.parse(obj) : obj;
    
        return obj;
      } catch (error) {
        console.error(
          `Error in formatToJson(), caused by ${error}. Specific stack is ${error.stack}`
        );
      }
}

module.exports = {
    formatToJson
}