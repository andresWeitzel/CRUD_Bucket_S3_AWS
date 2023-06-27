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
  let eventHeaders;
  let validateReqParams;
  let validateAuth;
  let obj;
  let indexObj;
  let uuidInput;
  let bucketContent;
  let bucketContentResult;
  let msg;
  let code;
  
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
      uuidInput  = null;
      indexObj = null;
      bucketContentResult = null;
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
  

  
      //-- start with bucket operations  ---
  
      await initBucketIfEmpty();
  
      uuidInput = parseInt(await event.pathParameters.uuid);
  
      bucketContent = await readBucket();
  
      obj = await findByUuid(bucketContent, uuidInput);
  
      if (obj == null) {
        return await bodyResponse(
          statusCode.BAD_REQUEST,
          "The object requested according to the uuid, is not found inside the bucket.")
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
            statusCode.OK,
            `Removed object with uuid ${uuidInput} successfully.`
          );
        }
  
      } else {
        return await bodyResponse(
          statusCode.INTERNAL_SERVER_ERROR,
          "An unexpected error has occurred. The object could not removed from the bucket."
        )
      }
  
  
    } catch (error) {
      code = statusCode.INTERNAL_SERVER_ERROR;
      msg = `Error in DELETE OBJECT lambda. Caused by ${error}. Stack error type : ${error.stack}`;
      console.error(msg);

      return await requestResult(code, msg);
    }
  
  }