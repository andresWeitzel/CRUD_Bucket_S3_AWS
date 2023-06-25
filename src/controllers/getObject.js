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
    readBucket
} = require("../helpers/bucket/operations/readBucket");
const {
    findByUuid
  } = require("../helpers/bucket/operations/findByUuid");
//Const/Vars
let eventBody;
let eventHeaders;
let jsonInit;
let bucketContent;
let validateReqParams;
let validateAuth;
let obj;


/**
 * @description get an object from the s3 bucket 
 * @param {Object} event Object type
 * @returns a body response with http code and message
 */

module.exports.handler = async (event) => {
    try {
        //Init
        jsonInit = [];
        bodyObj = null;
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


        //-- start with bucket operations  ---

        let uuidInput = parseInt( await event.pathParameters.uuid);

        bucketContent = await readBucket();

        obj = await findByUuid(bucketContent, uuidInput);

        if (obj != null) {
            return await bodyResponse(
                statusCode.OK,
                obj
            );
        }else if (obj == null) {
            return await bodyResponse(
                statusCode.BAD_REQUEST,
                `The object requested according to the uuid ${uuidInput}, is not found inside the bucket.`
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