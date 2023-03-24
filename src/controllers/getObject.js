//Bucket

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
let bucketContent;
let validateReqParams;
let validateAuth;


/**
 * @description get an object from the s3 bucket 
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
        let checkObjUuid=false;
        let objUuid=0;
        let obj=null;


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

        let uuidInput = parseInt( await event.pathParameters.uuid);


        bucketContent = await readBucket();

        while(bucketContent != null || bucketContent != undefined){
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

        if (obj != null) {
            return await bodyResponse(
                statusCode.OK,
                obj
            );
        }else if (obj == null) {
            return await bodyResponse(
                statusCode.BAD_REQUEST,
                "The object requested according to the id, is not found inside the bucket."
            )
        } else {
            return await bodyResponse(
                statusCode.INTERNAL_SERVER_ERROR,
                "An unexpected error has occurred. Cannot read bucket."
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