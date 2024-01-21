'use strict';
//Helpers
const { formatToJson } = require('../../format/formatToJson');

//Const-Vars
let obj;
let objUuid;
let checkObjUuid;

/**
 * @description Find an object inside the bucket based on the specified uuid
 * @param {Object} bucketContent Object type
 * @param {Integer} uuidInput Integer type
 * @returns a json object
 */
const findByUuid = async (bucketContent, uuidInput) => {
  try {
    obj = null;
    objUuid = null;
    checkObjUuid = false;

    while (bucketContent != null || bucketContent != undefined) {
      bucketContent = await formatToJson(bucketContent);

      for (let i of bucketContent) {
        objUuid = i.uuid;

        checkObjUuid = objUuid == uuidInput ? true : false;

        if (checkObjUuid) {
          obj = i;
          break;
        }
      }

      break;
    }
  } catch (error) {
    console.error(
      `ERROR in function findByUuid(). Caused by ${error} . Specific stack is ${error.stack} `,
    );
  }
  return obj;
};

module.exports = {
  findByUuid,
};
