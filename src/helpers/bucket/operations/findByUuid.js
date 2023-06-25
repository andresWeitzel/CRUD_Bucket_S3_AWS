//Helpers
const {
    formatToJson
} = require("../../format/formatToJson");

//Const-Vars
let obj;
let objUuid;
let checkObjUuid;


/**
 * @description Find an object inside the bucket based on the specified uuid
 * @param {Object} bucketContent Object type
 * @param {Integer} uuidInput Integer type
 * @returns a json object
 */
const findByUuid = async (bucketContent, uuidInput) => {
    obj = null;
    objUuid = null;
    checkObjUuid = false;
    try {
        while (bucketContent != null || bucketContent != undefined) {
            bucketContent = await formatToJson(bucketContent);

            for (i of bucketContent) {
                objUuid = i.uuid;

                checkObjUuid = (objUuid == uuidInput) ? true : false;

                if (checkObjUuid) {
                    obj = i;
                    break;
                }
            }

            break;
        }
    } catch (error) {
        console.log(error);
    }
    return obj;
}

module.exports = {
    findByUuid
}