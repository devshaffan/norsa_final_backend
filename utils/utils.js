
const crypto = require('crypto');
const getUniqueString = (numBytes) => {
    const random = crypto.randomBytes(numBytes || 12).toString('hex');
    const date = Date.now().toString(16);
    return `${random}-${date}`;
}
module.exports = {
    getUniqueString,
}