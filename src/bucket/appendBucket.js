"use strict";
//External
const {
    PutObjectCommand
} = require("@aws-sdk/client-s3");

//Bucket
const { newClientS3 } = require('./clientS3');
//Const/Vars
let clientS3;

/**
 * @description append bucket objects
 * @param {Object} event Object type
 */
const appendBucket = async (appendData) => {
    try {

        clientS3 = await newClientS3();

        clientS3.send(
            new PutObjectCommand({
                Bucket: process.env.BUCKET_NAME,
                Key: process.env.BUCKET_KEY,
                Body: await appendData,
            })
        );
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    appendBucket
};