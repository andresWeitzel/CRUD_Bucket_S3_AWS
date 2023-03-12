//Bucket
const {
  initBucket
} = require("../bucket/initBucket");
const {
  readBucket
} = require("../bucket/readBucket");
const {
  appendBucket
} = require("../bucket/appendBucket");
//Enums
const { statusCode } = require("../enums/http/statusCode");
//Helpers
const { bodyResponse } = require("../helpers/http/bodyResponse");
const {
  validateHeadersParams,
} = require("../helpers/validator/http/requestHeadersParams");
const { validateAuthHeaders } = require("../helpers/auth/headers");
// const {
//   validateBodyAddUserParams,
// } = require("../helpers/http/users/requestBodyAddUserParams");


//Const/Vars
let content;
let jsonInit;
let uuid;
let headersObj;
let body;
let checkContent;
let validateReqParams;
let validateAuth;

module.exports.handler = async (event) => {
  try {
    //Event
    // headersObj =  JSON.parse(await event.headers);
    // bodyObj =  JSON.parse(await event.body);

    //Init
    jsonInit = [];
    content = "";
    uuid = "";
    checkContent = false;


    //-- start with validation Headers  ---
    validateReqParams = await validateHeadersParams(event);

    if (!validateReqParams) {
      return await bodyResponse(
        statusCode.BAD_REQUEST,
        "Bad request, check missing or malformed headers",
        event
      );
    }

    validateAuth = await validateAuthHeaders(event);

    if (!validateAuth) {
      return await bodyResponse(
        statusCode.UNAUTHORIZED,
        "Not authenticated, check x_api_key and Authorization",
        event
      );
    }
    //-- end with validation Headers  ---

    // await initBucket.put();

    // content = await readBucket.get();
    // console.log(content);

    // checkContent = content != null ? true : false;

    // if (checkContent) {
    //   //Added unique identificator
    //   uuid = parseInt(Math.random() * 10000000 + 100000000);
    //   event.payer_uuid = uuid;

    //   //Convert to json to save
    //   content = await JSON.parse(content);
    //   content.push(event);

    //   //Json format
    //   appendPayer = await JSON.stringify(content, null, 2);

    //   await appendBucket.put(appendPayer);
    // } else {
    //   return;

    // }
  } catch (error) {
    console.log(error);
  }

}