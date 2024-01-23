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
const { readBucket } = require('../helpers/bucket/operations/readBucket');
const { findByUuid } = require('../helpers/bucket/operations/findByUuid');
//Const
// validate msg
const HEADERS_PARAMS_ERROR_MESSAGE =
  validateHeadersMessage.HEADERS_PARAMS_ERROR_MESSAGE;
const HEADERS_AUTH_ERROR_MESSAGE =
  validateHeadersMessage.HEADERS_AUTH_ERROR_MESSAGE;
//status-code
const INTERNAL_SERVER_ERROR_CODE = statusCode.INTERNAL_SERVER_ERROR;
const INTERNAL_SERVER_ERROR_MESSAGE =
  'An unexpected error has occurred. Cannot read bucket.';
const BAD_REQUEST_CODE = statusCode.BAD_REQUEST;
const BAD_REQUEST_UUID_MESSAGE =
  'The object requested is not found inside the bucket according to the uuid ';
const UNAUTHORIZED_CODE = statusCode.UNAUTHORIZED;
const OK_CODE = statusCode.OK;
const GET_OBJECT_ERROR_DETAIL = 'Error in get-object lambda function.';
//Vars
let eventHeaders;
let bucketContent;
let validateReqParams;
let validateAuth;
let uuidInput;
let obj;
let msgResponse;
let msgLog;

/**
 * @description get an object from the s3 bucket
 * @param {Object} event Object type
 * @returns a body response with http code and message
 */

module.exports.handler = async (event) => {
  try {
    //Init
    bucketContent = null;
    uuidInput = null;
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

    //-- start with bucket operations  ---

    uuidInput = parseInt(await event.pathParameters.uuid);

    bucketContent = await readBucket();

    obj = await findByUuid(bucketContent, uuidInput);

    if (obj != null) {
      return await bodyResponse(OK_CODE, obj);
    } else if (obj == null) {
      return await bodyResponse(
        BAD_REQUEST_CODE,
        BAD_REQUEST_UUID_MESSAGE + uuidInput,
      );
    } else {
      return await bodyResponse(
        INTERNAL_SERVER_ERROR_CODE,
        INTERNAL_SERVER_ERROR_MESSAGE,
      );
    }
    //-- end with bucket operations  ---
  } catch (error) {
    msgResponse = GET_OBJECT_ERROR_DETAIL;
    msgLog = msgResponse + `Caused by ${error}`;
    console.log(msgLog);

    return await bodyResponse(INTERNAL_SERVER_ERROR_CODE, msgResponse);
  }
};
