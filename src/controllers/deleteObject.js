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
  'An unexpected error has occurred. The object could not delete from the bucket.';
const BAD_REQUEST_CODE = statusCode.BAD_REQUEST;
const BAD_REQUEST_UUID_MESSAGE =
  'The object requested from delete is not found inside the bucket according to the uuid ';
const BAD_REQUEST_DELETE_OBJECT_MESSAGE =
  'The object has been deleted correctly according to the id ';
const UNAUTHORIZED_CODE = statusCode.UNAUTHORIZED;
const OK_CODE = statusCode.OK;
const DELETE_OBJECT_ERROR_DETAIL = 'Error in delete-object lambda function.';
//Vars
let eventHeaders;
let validateReqParams;
let validateAuth;
let obj;
let indexObj;
let uuidInput;
let bucketContent;
let bucketContentResult;
let msgResponse;
let msgLog;

/**
 * @description Function to delete an object according to its uuid from the s3 repository
 * @param {Object} event Object type
 * @returns a body response with http code and message
 */
module.exports.handler = async (event) => {
  try {
    //Init
    obj = null;
    bucketContent = null;
    uuidInput = null;
    indexObj = null;
    bucketContentResult = null;
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

      //convert json to string format to save if is not a string format
      bucketContent = await formatToString(bucketContent);

      bucketContentResult = await appendBucket(bucketContent);

      //-- end with bucket operations  ---

      if (bucketContentResult != null) {
        return await bodyResponse(
          OK_CODE,
          BAD_REQUEST_DELETE_OBJECT_MESSAGE + uuidInput,
        );
      }
    } else {
      return await bodyResponse(
        INTERNAL_SERVER_ERROR_CODE,
        INTERNAL_SERVER_ERROR_MESSAGE,
      );
    }
  } catch (error) {
    msgResponse = DELETE_OBJECT_ERROR_DETAIL;
    msgLog = msgResponse + `Caused by ${error}`;
    console.log(msgLog);

    return await bodyResponse(INTERNAL_SERVER_ERROR_CODE, msgResponse);
  }
};
