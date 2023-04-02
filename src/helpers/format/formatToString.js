
/**
 * @description Convert to string format
 * @param {Object} obj Object type
 * @returns a object string with this format
 */
const formatToString = async (obj) => {
    try {
        if (typeof obj != 'string') {
            obj = JSON.stringify(obj, null, 2);
        }
    } catch (error) {
        console.log(error);
    }
    return obj;
}

module.exports = {
    formatToString
}