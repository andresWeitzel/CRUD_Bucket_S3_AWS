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
  validateBodyUpdateObjectParams,
} = require("../helpers/validator/http/requestBodyUpdateObjectParams");
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
const {
    findByUuid
  } = require("../helpers/bucket/operations/findByUuid");


//Const/Vars
let eventBody;
let eventHeaders;
let bucketContent;
let validateReqParams;
let validateAuth;
let validateBodyAddObject;
let obj;
let uuidInput;
let newObject;
let indexObj;
let newObjectResult;
let msg;
let code;

/**
 * @description edit an object in s3 bucket based on its uuid
 * @param {Object} event Object type
 * @returns a body response with http code and message
 */
module.exports.handler = async (event) => {
  try {
    //Init
    bucketContent = null;
    uuidInput = null;
    indexObj = null;
    newObjectResult = null;
    obj = null;
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

    eventBody = await JSON.parse(event.body);

    validateBodyAddObject = await validateBodyUpdateObjectParams(eventBody);

    if (!validateBodyAddObject) {
      return await bodyResponse(
        statusCode.BAD_REQUEST,
        "Bad request, check request attributes. Missing or incorrect"
      );
    }
    // -- end with validation Body  ---


    //-- start with bucket operations  ---

    await initBucketIfEmpty();

    uuidInput = parseInt(await event.pathParameters.uuid);

    bucketContent = await readBucket();

    obj = await findByUuid(bucketContent, uuidInput);

    if (obj == null) {
      return await bodyResponse(
        statusCode.BAD_REQUEST,
        `The object requested according to the uuid ${uuidInput}, is not found inside the bucket.`
      )

    } else if (obj != null) {

      bucketContent = await formatToJson(bucketContent);

      indexObj = await bucketContent.indexOf(obj);

      //Remove the object with the entered uuid
      await bucketContent.splice(indexObj, 1);

      //Get uuid of old object
      eventBody.uuid = await obj.uuid;

      //Store the new object in the inside content
      await bucketContent.push(eventBody);

      //convert json to string format to save if is not a string format
      newObject = await formatToString(bucketContent);

      newObjectResult = await appendBucket(newObject);

      //-- end with bucket operations  ---


      if (newObjectResult != null) {
        return await bodyResponse(
          statusCode.OK,
          eventBody
        );
      }

    } else {
      return await bodyResponse(
        statusCode.INTERNAL_SERVER_ERROR,
        "An unexpected error has occurred. The object could not update inside the bucket."
      )
    }


  } catch (error) {
    code = statusCode.INTERNAL_SERVER_ERROR;
    msg = `Error in EDIT OBJECT lambda. Caused by ${error}. Stack error type : ${error.stack}`;
    console.error(msg);

    return await requestResult(code, msg);
  }

}