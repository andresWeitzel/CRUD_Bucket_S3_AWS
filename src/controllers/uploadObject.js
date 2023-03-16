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
} = require("../helpers/validator/http/requestBodyUploadObjectParams");


//Const/Vars
let eventBody;
let eventHeaders;
let jsonInit;
let uuid;
let body;
let bucketContent;
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
    bodyObj = null;
    uuid = "";
    bucketContent = null;


    //-- start with validation Headers  ---
    eventHeaders = await event.headers;

    validateReqParams = await validateHeadersParams(eventHeaders);

    if (!validateReqParams) {
      return await bodyResponse(
        statusCode.BAD_REQUEST,
        "Bad request, check missing or malformed headers",
        event
      );
    }

    validateAuth = await validateAuthHeaders(eventHeaders);

    if (!validateAuth) {
      return await bodyResponse(
        statusCode.UNAUTHORIZED,
        "Not authenticated, check x_api_key and Authorization",
        event
      );
    }
    //-- end with validation Headers  ---


    //-- start with validation Body  ---

    eventBody = await JSON.parse(event.body);

    validateBodyAddObject = await validateBodyAddObjectParams(eventBody);

    if (!validateBodyAddObject) {
      return await bodyResponse(
        statusCode.BAD_REQUEST,
        "Bad request, check request attributes. Missing or incorrect",
        event
      );
    }
    // -- end with validation Body  ---


    //-- start with bucket operations  ---

    await initBucketIfEmpty();

    bucketContent = await readBucket();

    if (bucketContent == null) {
      return await bodyResponse(
        statusCode.INTERNAL_SERVER_ERROR,
        "An unexpected error has occurred. The object could not be stored inside the bucket.",
        event
      );
    } else {
      //Added unique identificator for the object
      newUUID = parseInt(Math.random() * 10000000 + 100000000);
      eventBody.uuid = newUUID;

      //Convert to json to save
      bucketContent = await JSON.parse(bucketContent);
      bucketContent.push(eventBody);

      //convert json to string format to save
      let newObject = await JSON.stringify(bucketContent, null, 2);

      await appendBucket(newObject);

      return await bodyResponse(
        statusCode.OK,
        bucketContent,
        event
      );
    }
    //-- end with bucket operations  ---

  } catch (error) {
    console.log(error);
    return await bodyResponse(
      statusCode.INTERNAL_SERVER_ERROR,
      "An unexpected error has occurred. Try again",
      event
    );
  }

}