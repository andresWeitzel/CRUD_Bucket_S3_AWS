//Imports
const {
    readBucket
} = require("./readBucket");
const {
    appendBucket
} = require("./appendBucket");

//Const/Vars
let initJson;


/**
 * @description append bucket files
 * @param {Object} event Object type
 */
const put = async () => {
    try {
        //Data
        initJson = [];

        content = await readBucket.get();

        checkContent = content == undefined || content == null ? true : false;

        if (checkContent) {
            initJson = await JSON.stringify(initJson);

            await appendBucket.put(initJson);
        } else {
            return;
        }
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    put
};