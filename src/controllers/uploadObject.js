"use strict";
//Enums
const {
  statusCode
} = require("../enums/http/statusCode");
//Helpers
const {
  bodyResponse
} = require("../helpers/http/bodyResponse");
const {
  validateHeadersParams,
} = require("../helpers/validator/http/requestHeadersParams");
const {
  validateAuthHeaders
} = require("../helpers/auth/headers");
const {
  validateBodyAddObjectParams,
} = require("../helpers/validator/http/requestBodyAddObjectParams");
const {
  generateUUID,
} = require("../helpers/math/generateUuid");
const {
  formatToString
} = require("../helpers/format/formatToString");
const {
  formatToJson
} = require("../helpers/format/formatToJson");
const {
  initBucketIfEmpty
} = require("../helpers/bucket/operations/initBucket");
const {
  readBucket
} = require("../helpers/bucket/operations/readBucket");
const {
  appendBucket
} = require("../helpers/bucket/operations/appendBucket");

//Const/Vars
let eventBody;
let eventHeaders;
let bucketContent;
let validateReqParams;
let validateAuth;
let validateBodyAddObject;
let newObject;
let newObjectResult;
let msg;
let code;

/**
 * @description add an object inside the s3 bucket 
 * @param {Object} event Object type
 * @returns a body response with http code and message.
 */
module.exports.handler = async (event) => {
  try {
    //Init
    bucketContent = null;
    newObject = null;
    newObjectResult = null;
    msg = null;
    code = null;


    //-- start with validation Headers  ---
    eventHeaders = await event.headers;

    validateReqParams = await validateHeadersParams(eventHeaders);

    if (!validateReqParams) {
      return await bodyResponse(
        statusCode.BAD_REQUEST,
        "Bad request, check missing or malformed headers"
      );
    }

    validateAuth = await validateAuthHeaders(eventHeaders);

    if (!validateAuth) {
      return await bodyResponse(
        statusCode.UNAUTHORIZED,
        "Not authenticated, check x_api_key and Authorization"
      );
    }
    //-- end with validation Headers  ---


    //-- start with validation Body  ---

    eventBody = await formatToJson(event.body);

    validateBodyAddObject = await validateBodyAddObjectParams(eventBody);

    if (!validateBodyAddObject) {
      return await bodyResponse(
        statusCode.BAD_REQUEST,
        "Bad request, check request attributes. Missing or incorrect"
      );
    }
    // -- end with validation Body  ---


    //-- start with bucket operations  ---

    await initBucketIfEmpty();

    bucketContent = await readBucket();

    if (bucketContent == null) {
      return await bodyResponse(
        statusCode.INTERNAL_SERVER_ERROR,
        "An unexpected error has occurred. The object could not be stored inside the bucket."
      );
    }
    //Added unique identificator for the object
    eventBody.uuid = await generateUUID();

    bucketContent = await formatToJson(bucketContent);

    await bucketContent.push(eventBody);

    newObject = await formatToString(bucketContent);

    newObjectResult = await appendBucket(newObject);

    if (newObjectResult != null) {
      return await bodyResponse(
        statusCode.OK,
        eventBody
      );
    } else {
      return await bodyResponse(
        statusCode.INTERNAL_SERVER_ERROR,
        "An unexpected error has occurred. The object could not be stored inside the bucket."
      )
    }

    //-- end with bucket operations  ---

  } catch (error) {
    code = statusCode.INTERNAL_SERVER_ERROR;
    msg = `Error in UPLOAD OBJECT lambda. Caused by ${error}. Stack error type : ${error.stack}`;
    console.error(msg);

    return await bodyResponse(code, msg);
  }

}