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
let appendPayer;
let jsonInit;
let uuid;
let checkContent;
let validateReqParams;


module.exports.handler = async (event) => {
  try {
    //Event
    headers = await JSON.parse(event.headers);
    body = await JSON.parse(event.body);

    //Init
    jsonInit = [];
    content = "";
    appendPayer = "";
    uuid = "";
    checkContent = false;


    //-- start with validation Headers  ---
    validateReqParams = await validateHeadersParams(headers);

    if (!validateReqParams) {
      return await bodyResponse(
        statusCode.BAD_REQUEST,
        "Bad request, check missing or malformed headers",
        event
      );
    }

    validateAuth = await validateAuthHeaders(headers);

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