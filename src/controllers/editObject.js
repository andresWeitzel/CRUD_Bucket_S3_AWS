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
  validateBodyUpdateObjectParams,
} = require("../helpers/validator/http/requestBodyUpdateObjectParams");


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
let newUUID;
let obj;

/**
 * @description edit an object in s3 bucket based on its uuid
 * @param {Object} event Object type
 * @returns a body response with http code and message
 */
module.exports.handler = async (event) => {
  try {
    //Init
    jsonInit = [];
    bodyObj = null;
    uuid = "";
    bucketContent = null;
    obj = null;


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

    let uuidInput = parseInt(await event.pathParameters.uuid);


    bucketContent = await readBucket();

    while (bucketContent != null || bucketContent != undefined) {
      bucketContent = await JSON.parse(bucketContent);

      obj = null;
      for (i of bucketContent) {
        objUuid = i.uuid;

        checkObjUuid = objUuid == uuidInput ? true : false;

        if (checkObjUuid) {
          obj = i;
          break;
        }
      }

      break;
    }

    if (obj == null) {
      return await bodyResponse(
        statusCode.BAD_REQUEST,
        "The object requested according to the id, is not found inside the bucket.")
    } else if (obj != null) {


      console.log('=== PRE SPLICE ===', bucketContent);

      let indexObj = await bucketContent.indexOf(obj);

      await bucketContent.splice(indexObj, 1);

      //Added unique identificator for the object
      newUUID = parseInt(Math.random() * 10000000 + 100000000);
      eventBody.uuid = newUUID;


      console.log('=== POST CONFIG ===', bucketContent);

      console.log('=== EVENT BODY ===', eventBody);


      if (typeof bucketContent != 'object') {
        //Convert to json to save
        bucketContent = await JSON.parse(bucketContent);
      }
      
      await bucketContent.push(eventBody);



      // //convert json to string format to save
      // let newObject = JSON.stringify(bucketContent, null, 2);

      // let newObjectResult = await appendBucket(newObject);

      // if (newObjectResult != null) {
      //   return await bodyResponse(
      //     statusCode.OK,
      //     eventBody
      //   );
      // }

      return await bodyResponse(
        statusCode.OK,
        'debugging'
      );

    } else {
      return await bodyResponse(
        statusCode.INTERNAL_SERVER_ERROR,
        "An unexpected error has occurred. The object could not update inside the bucket."
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