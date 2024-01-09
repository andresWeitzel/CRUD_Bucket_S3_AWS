'use strict';
//Enums
const { statusCode } = require('../enums/http/statusCode');
//Helpers
const { bodyResponse } = require('../helpers/http/bodyResponse');
const {
  validateHeadersParams,
} = require('../helpers/validator/http/requestHeadersParams');
const { validateAuthHeaders } = require('../helpers/auth/headers');
const { readBucket } = require('../helpers/bucket/operations/readBucket');
const { findByUuid } = require('../helpers/bucket/operations/findByUuid');
//Const/Vars
let eventHeaders;
let bucketContent;
let validateReqParams;
let validateAuth;
let uuidInput;
let obj;
let msg;
let code;

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
    msg = null;
    code = null;

    //-- start with validation Headers  ---
    eventHeaders = await event.headers;

    validateReqParams = await validateHeadersParams(eventHeaders);

    if (!validateReqParams) {
      return await bodyResponse(
        statusCode.BAD_REQUEST,
        'Bad request, check missing or malformed headers',
      );
    }

    validateAuth = await validateAuthHeaders(eventHeaders);

    if (!validateAuth) {
      return await bodyResponse(
        statusCode.UNAUTHORIZED,
        'Not authenticated, check x_api_key and Authorization',
      );
    }
    //-- end with validation Headers  ---

    //-- start with bucket operations  ---

    uuidInput = parseInt(await event.pathParameters.uuid);

    bucketContent = await readBucket();

    obj = await findByUuid(bucketContent, uuidInput);

    if (obj != null) {
      return await bodyResponse(statusCode.OK, obj);
    } else if (obj == null) {
      return await bodyResponse(
        statusCode.BAD_REQUEST,
        `The object requested according to the uuid ${uuidInput}, is not found inside the bucket.`,
      );
    } else {
      return await bodyResponse(
        statusCode.INTERNAL_SERVER_ERROR,
        'An unexpected error has occurred. Cannot read bucket.',
      );
    }

    //-- end with bucket operations  ---
  } catch (error) {
    code = statusCode.INTERNAL_SERVER_ERROR;
    msg = `Error in GET OBJECT lambda. Caused by ${error}. Stack error type : ${error.stack}`;
    console.error(msg);

    return await bodyResponse(code, msg);
  }
};
