//Bucket
const {
  initBucket
} = require("../bucket/initBucket");
const {
  readBucket
} = require("../bucket/readBucket");
const {
  appendBucket
} = require("../bucket/appendBucket");
//Enums
const { statusCode } = require("../enums/http/statusCode");
//Helpers
const { bodyResponse } = require("../helpers/http/bodyResponse");
const {
  validateHeadersParams,
} = require("../helpers/validator/http/requestHeadersParams");
const { validateAuthHeaders } = require("../helpers/auth/headers");
const {
  validateBodyAddObjectParams,
} = require("../helpers/validator/http/requestBodyUploadObjectParams");


//Const/Vars
let content;
let jsonInit;
let uuid;
let bodyObj;
let checkContent;
let validateReqParams;
let validateAuth;
let validateBodyAddObject;

/**
 * @description add an object inside the s3 bucket 
 * @param {Object} event Object type
 * @returns a body response with http code, message and event
 */
module.exports.handler = async (event) => {
  try {
    //Init
    jsonInit = [];
    bodyObj=null;
    uuid = "";
    checkContent = false;

    bodyObj = await JSON.parse(event.body);

    console.log(bodyObj);

    //-- start with validation Headers  ---
    validateReqParams = await validateHeadersParams(event);

    if (!validateReqParams) {
      return await bodyResponse(
        statusCode.BAD_REQUEST,
        "Bad request, check missing or malformed headers",
        event
      );
    }

    validateAuth = await validateAuthHeaders(event);

    if (!validateAuth) {
      return await bodyResponse(
        statusCode.UNAUTHORIZED,
        "Not authenticated, check x_api_key and Authorization",
        event
      );
    }
        //-- end with validation Headers  ---


      //-- start with validation Body  ---

      validateBodyAddObject = await validateBodyAddObjectParams(bodyObj);

      if (!validateBodyAddObject) {
        return await bodyResponse(
          statusCode.BAD_REQUEST,
          "Bad request, check request attributes. Missing or incorrect",
          event
        );
      }
     // -- end with validation Body  ---


    // await initBucket.put();

    // content = await readBucket.get();
    // console.log(content);

    // checkContent = content != null ? true : false;

    // if (checkContent) {
    //   //Added unique identificator
    //   uuid = parseInt(Math.random() * 10000000 + 100000000);
    //   event.payer_uuid = uuid;

    //   //Convert to json to save
    //   content = await JSON.parse(content);
    //   content.push(event);

    //   //Json format
    //   appendPayer = await JSON.stringify(content, null, 2);

    //   await appendBucket.put(appendPayer);
    // } else {
    //   return;

    // }
  } catch (error) {
    console.log(error);
  }

}