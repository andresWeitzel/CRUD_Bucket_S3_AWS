"use strict";

//External
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { sdkStreamMixin } = require("@aws-sdk/util-stream-node");
//Const/Vars
let objectString;

const get = async()=> {
  try {
      //Checks
  objectString = "";

    const client = new S3Client({
      forcePathStyle: true,
      credentials: {
        // This specific key is required when working offline
        accessKeyId: "S3RVER",
        secretAccessKey: "S3RVER",
      },
      endpoint: "http://localhost:4569",
    });

    let resp = await client.send(
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

module.exports = { get };
