//Bucket
const {
  initBucketIfEmpty
} = require("../bucket/initBucket");
const {
  readBucket
} = require("../bucket/readBucket");
const {
  appendBucket
} = require("../bucket/appendBucket");
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


//Const/Vars
let eventBody;
let eventHeaders;
let jsonInit;
let body;
let bucketContent;
let validateReqParams;
let validateAuth;
let validateBodyAddObject;
let newObject;

/**
 * @description add an object inside the s3 bucket 
 * @param {Object} event Object type
 * @returns a body response with http code and message.
 */
module.exports.handler = async (event) => {
  try {
    //Init
    jsonInit = [];
    bodyObj = null;
    bucketContent = null;
    newObject = null;


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

    newObject = await formatToJson(bucketContent);

    bucketContent.push(eventBody);

    newObject = await formatToString(bucketContent);

    let newObjectResult = await appendBucket(newObject);

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
    console.log(error);
    return await bodyResponse(
      statusCode.INTERNAL_SERVER_ERROR,
      "An unexpected error has occurred. Try again"
    );
  }

}