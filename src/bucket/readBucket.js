"use strict";

//External
const {
  GetObjectCommand
} = require("@aws-sdk/client-s3");
const {
  sdkStreamMixin
} = require("@aws-sdk/util-stream-node");
//Bucket
const {
  newClientS3
} = require('./clientS3');
//Const/Vars
let objectString;
let clientS3;



/**
 * @description read bucket objects
 * @returns a list of objects
 */
const get = async () => {
  try {
    //Checks
    objectString = "";

    clientS3 = await newClientS3();

    let resp = await clientS3.send(
      new GetObjectCommand({
        Bucket: "local-bucket",
        Key: "bucketS3.json",
      })
    );

    // this throws if Body is undefined
    objectString = await sdkStreamMixin(resp.Body).transformToString();

    return objectString;

  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  get
};