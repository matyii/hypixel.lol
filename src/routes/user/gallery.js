const fs = require("fs");
const express = require('express');
const checkUploadkey = require('../../functions/generateKey.js')
const router = express.Router();

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated() && req.user.accessToken) {
      return next();
    }
    res.redirect("/login");
};

router.get("/",isAuthenticated, async (req, res) => {
    try {

        const profile = req.user;
        const id = profile["id"]
        const username = profile["username"]
        const uploadKey = checkUploadkey(username, id)

        const perPage = 12;
        const currentPage = parseInt(req.query.page) || 1;
        const fetch = await import('node-fetch');
        const response = await fetch.default(`http://localhost/api/uploads/${uploadKey[0]}?page=${currentPage}`);
        const images = await response.json();

        const totalImagesCount = images.length;

        const totalPages = Math.ceil(totalImagesCount / perPage);

        res.render('gallery', { images, currentPage, perPage, totalPages, totalImagesCount });
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;