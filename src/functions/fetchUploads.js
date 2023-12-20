const mainDomain = require('./config.js')('maindomain');

async function fetchUploads(uploadkey) {
    try {
        const fetch = await import('node-fetch');
        const response = await fetch.default(`http://${mainDomain}/api/uploads/${uploadkey}`);
        const data = await response.json();
        const numberOfUploads = Object.keys(data).length;
        return numberOfUploads;
    } catch (error) {
        console.error(error);
    }
}

module.exports = fetchUploads;