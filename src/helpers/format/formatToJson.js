
/**
 * @description Convert to string format
 * @param {Object} obj Object type
 * @returns a object string with this format
 */
const formatToJson = async (obj) => {
    try {
        if (typeof obj != 'object') {
            //Convert to json to save
            obj = await JSON.parse(obj);
          }
    } catch (error) {
        console.log(error);
    }
    return obj;
}

module.exports = {
    formatToJson
}