//Const/vars
let objFormat;

/**
 * @description Convert to string format
 * @param {Object} obj Object type
 * @returns a object string with this format
 */
const formatToJson = async (obj) => {
    objFormat = null;
    try {
        if (typeof obj != 'object') {
            //Convert to json to save
            objFormat = await JSON.parse(obj);
          }
    } catch (error) {
        console.log(error);
    }
    return objFormat;
}

module.exports = {
    formatToJson
}