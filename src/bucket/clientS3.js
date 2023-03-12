"use strict";

//External
const {
    S3Client
} = require("@aws-sdk/client-s3");


/**
 * @description define the credentials and endpoint for a new s3 client
 * @param {Object} event Object type
 */
const newClientS3 = async () => {
    try {
        const client = new S3Client({
            forcePathStyle: true,
            credentials: {
                // This specific key is required when working offline
                accessKeyId: "S3RVER",
                secretAccessKey: "S3RVER",
            },
            endpoint: "http://localhost:4569",
        });

       return client;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    newClientS3
};