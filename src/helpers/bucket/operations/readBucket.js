'use strict';
//External
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { sdkStreamMixin } = require('@aws-sdk/util-stream-node');
//Bucket
const { newClientS3 } = require('../config/clientS3');
//Const/Vars
let objectString;
let clientS3;
let resp;

/**
 * @description read bucket objects
 * @returns a list of objects
 */
const readBucket = async () => {
  try {
    //Checks
    objectString = '';

    clientS3 = await newClientS3();

    resp = await clientS3.send(
      new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: process.env.BUCKET_KEY,
      }),
    );

    // this throws if Body is undefined
    objectString = await sdkStreamMixin(resp.Body).transformToString();

    return objectString;
  } catch (error) {
    console.error(
      `ERROR in function readBucket(). Caused by ${error} . Specific stack is ${error.stack} `,
    );
  }
};

module.exports = {
  readBucket,
};
