'use strict';
//Enums
const { statusCode } = require('../enums/http/statusCode');
const {
  validateHeadersMessage,
} = require('../enums/validation/errors/status-message');
//Helpers
const { bodyResponse } = require('../helpers/http/bodyResponse');
const {
  validateHeadersParams,
} = require('../helpers/validator/http/requestHeadersParams');
const { validateAuthHeaders } = require('../helpers/auth/headers');
const {
  validateBodyUpdateObjectParams,
} = require('../helpers/validator/http/requestBodyUpdateObjectParams');
const { formatToString } = require('../helpers/format/formatToString');
const { formatToJson } = require('../helpers/format/formatToJson');
const {
  initBucketIfEmpty,
} = require('../helpers/bucket/operations/initBucket');
const { readBucket } = require('../helpers/bucket/operations/readBucket');
const { appendBucket } = require('../helpers/bucket/operations/appendBucket');
const { findByUuid } = require('../helpers/bucket/operations/findByUuid');
//Const
// validate msg
const HEADERS_PARAMS_ERROR_MESSAGE =
  validateHeadersMessage.HEADERS_PARAMS_ERROR_MESSAGE;
const HEADERS_AUTH_ERROR_MESSAGE =
  validateHeadersMessage.HEADERS_AUTH_ERROR_MESSAGE;
//statu-code
const INTERNAL_SERVER_ERROR_CODE = statusCode.INTERNAL_SERVER_ERROR;
const INTERNAL_SERVER_ERROR_MESSAGE =
  'An unexpected error has occurred. The object could not update inside the bucket.';
const BAD_REQUEST_CODE = statusCode.BAD_REQUEST;
const BAD_REQUEST_ADD_OBJECT_MESSAGE =
  'Bad request, check request attributes. Missing or incorrect';
const BAD_REQUEST_UUID_MESSAGE =
  'The object requested is not found inside the bucket according to the uuid ';
const UNAUTHORIZED_CODE = statusCode.UNAUTHORIZED;
const OK_CODE = statusCode.OK;
const EDIT_OBJECT_ERROR_DETAIL = 'Error in edit-object lambda function.';
//Vars
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
let msgResponse;
let msgLog;

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
    msgResponse = null;
    msgLog = null;

    //-- start with validation Headers  ---
    eventHeaders = await event.headers;

    validateReqParams = await validateHeadersParams(eventHeaders);

    if (!validateReqParams) {
      return await bodyResponse(BAD_REQUEST_CODE, HEADERS_PARAMS_ERROR_MESSAGE);
    }

    validateAuth = await validateAuthHeaders(eventHeaders);

    if (!validateAuth) {
      return await bodyResponse(UNAUTHORIZED_CODE, HEADERS_AUTH_ERROR_MESSAGE);
    }
    //-- end with validation Headers  ---

    //-- start with validation Body  ---

    eventBody = await JSON.parse(event.body);

    validateBodyAddObject = await validateBodyUpdateObjectParams(eventBody);

    if (!validateBodyAddObject) {
      return await bodyResponse(
        BAD_REQUEST_CODE,
        BAD_REQUEST_ADD_OBJECT_MESSAGE,
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
        BAD_REQUEST_CODE,
        BAD_REQUEST_UUID_MESSAGE + uuidInput,
      );
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
        return await bodyResponse(OK_CODE, eventBody);
      }
    } else {
      return await bodyResponse(
        INTERNAL_SERVER_ERROR_CODE,
        INTERNAL_SERVER_ERROR_MESSAGE,
      );
    }
  } catch (error) {
    msgResponse = EDIT_OBJECT_ERROR_DETAIL;
    msgLog = msgResponse + `Caused by ${error}`;
    console.log(msgLog);

    return await bodyResponse(INTERNAL_SERVER_ERROR_CODE, msgResponse);
  }
};
