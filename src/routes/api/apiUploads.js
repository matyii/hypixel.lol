const fs = require('fs');
const express = require('express');
const router = express.Router();

router.get("/:uploadkey", (req, res) => {
    const uploadsData = JSON.parse(fs.readFileSync("./src/data/uploads.json"))
    const user = req.params["uploadkey"].split('_')[0];
    const uploads2 = Object.keys(uploadsData)
        .filter(key => uploadsData[key].user === user)
        .map(key => ({
            filename: key,
            rawUrl: uploadsData[key].rawUrl
        }));

    res.json(uploads2);
});

module.exports = router;