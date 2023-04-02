//Const/vars
let objFormat;

/**
 * @description Convert to string format
 * @param {Object} obj Object type
 * @returns a object string with this format
 */
const formatToString = async (obj) => {
    objFormat = null;
    try {
        if (typeof obj != 'string') {
            objFormat = JSON.stringify(obj, null, 2);
        }
    } catch (error) {
        console.log(error);
    }
    return objFormat;
}

module.exports = {
    formatToString
}