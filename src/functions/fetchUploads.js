const mainDomain = require('./config.js')('maindomain');
function fetchUploads(uploadkey) {
    return fetch(`http://${mainDomain}/api/uploads/${uploadkey}`)
    .then(response => response.json())
    .then(data => {
        const numberOfUploads = Object.keys(data).length;
        return numberOfUploads
    })
    .catch(error => console.error(error));
}

module.exports = fetchUploads;