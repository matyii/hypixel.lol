const express = require('express');
const router = express.Router();
const fs = require('fs');

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated() && req.user.accessToken) {
    return next();
  }
  res.redirect('/login');
};

router.get('/', isAuthenticated, (req, res) => {
  const data = JSON.parse(fs.readFileSync('./src/data/keys.json'));
  const profile = req.user;
  const id = profile['id'];

  let embedTitle = '';
  let embedDescription = '';
  let embedColour = '';

  Object.keys(data).forEach((key) => {
    if (data[key].discord_id === id) {
      embedTitle = data[key]['embed']['embedTitle'] || '';
      embedDescription = data[key]['embed']['embedDescription'] || '';
      embedColour = data[key]['embed']['embedColor'] || '';
    }
  });

  res.render('embedConfig', {
        embedTitle: embedTitle,
        embedDescription: embedDescription,
        embedColour: embedColour
    });
});

router.post('/', async (req, res) => {
  try {
    const { 'embed-title': title, 'embed-description': description, 'embed-color': color } = req.body;
    const data = JSON.parse(fs.readFileSync('./src/data/keys.json'));
    const userId = req.user.id;

    Object.keys(data).forEach((key) => {
      if (data[key].discord_id === userId) {
        data[key]['embed']['embedTitle'] = title;
        data[key]['embed']['embedDescription'] = description;
        data[key]['embed']['embedColor'] = color;
      }
    });

    fs.writeFile('./src/data/keys.json', JSON.stringify(data, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error writing to file');
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
