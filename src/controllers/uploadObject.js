'use strict';
//Enums
const {
  validateHeadersMessage,
} = require('../enums/validation/errors/status-message');
const { statusCode } = require('../enums/http/statusCode');
//Helpers
const { bodyResponse } = require('../helpers/http/bodyResponse');
const {
  validateHeadersParams,
} = require('../helpers/validator/http/requestHeadersParams');
const { validateAuthHeaders } = require('../helpers/auth/headers');
const {
  validateBodyAddObjectParams,
} = require('../helpers/validator/http/requestBodyAddObjectParams');
const { generateUUID } = require('../helpers/math/generateUuid');
const { formatToString } = require('../helpers/format/formatToString');
const { formatToJson } = require('../helpers/format/formatToJson');
const {
  initBucketIfEmpty,
} = require('../helpers/bucket/operations/initBucket');
const { readBucket } = require('../helpers/bucket/operations/readBucket');
const { appendBucket } = require('../helpers/bucket/operations/appendBucket');
//Const
// validate msg
const HEADERS_PARAMS_ERROR_MESSAGE =
  validateHeadersMessage.HEADERS_PARAMS_ERROR_MESSAGE;
const HEADERS_AUTH_ERROR_MESSAGE =
  validateHeadersMessage.HEADERS_AUTH_ERROR_MESSAGE;
//status-code
const INTERNAL_SERVER_ERROR_CODE = statusCode.INTERNAL_SERVER_ERROR;
const INTERNAL_SERVER_ERROR_MESSAGE =
  'An unexpected error has occurred. The object could not be stored inside the bucket';
const BAD_REQUEST_CODE = statusCode.BAD_REQUEST;
const UNAUTHORIZED_CODE = statusCode.UNAUTHORIZED;
const OK_CODE = statusCode.OK;
const UPLOAD_OBJECT_ERROR_DETAIL = 'Error in uploadObject lambda.';
//Body Add Object
const VALIDATE_BODY_ADD_OBJECT_ERROR =
  'It is not possible to upload the object to the bucket since the attributes passed to the body of the request are not valid';
//Vars
let eventBody;
let eventHeaders;
let bucketContent;
let validateReqParams;
let validateAuth;
let validateBodyAddObject;
let newObject;
let newObjectResult;
let msgResponse;
let msgLog;

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

    eventBody = await formatToJson(event.body);

    validateBodyAddObject = await validateBodyAddObjectParams(eventBody);

    if (!validateBodyAddObject) {
      return await bodyResponse(
        BAD_REQUEST_CODE,
        VALIDATE_BODY_ADD_OBJECT_ERROR,
      );
    }
    // -- end with validation Body  ---

    //-- start with bucket operations  ---

    await initBucketIfEmpty();

    bucketContent = await readBucket();

    if (bucketContent == null) {
      return await bodyResponse(
        INTERNAL_SERVER_ERROR_CODE,
        INTERNAL_SERVER_ERROR_MESSAGE,
      );
    }
    //Added unique identificator for the object
    eventBody.uuid = await generateUUID();

    bucketContent = await formatToJson(bucketContent);

    await bucketContent.push(eventBody);

    newObject = await formatToString(bucketContent);

    newObjectResult = await appendBucket(newObject);

    if (newObjectResult != null) {
      return await bodyResponse(OK_CODE, eventBody);
    } else {
      return await bodyResponse(
        INTERNAL_SERVER_ERROR_CODE,
        INTERNAL_SERVER_ERROR_MESSAGE,
      );
    }

    //-- end with bucket operations  ---
  } catch (error) {
    msgResponse = UPLOAD_OBJECT_ERROR_DETAIL;
    msgLog = msgResponse + `Caused by ${error}`;
    console.log(msgLog);

    return await bodyResponse(INTERNAL_SERVER_ERROR_CODE, msgResponse);
  }
};
