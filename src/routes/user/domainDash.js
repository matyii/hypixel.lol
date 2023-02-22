const express = require('express');
const router = express.Router();
const fs = require('fs');
const axios = require('axios');

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated() && req.user.accessToken) {
    return next();
  }
  res.redirect('/login');
};

router.get('/', isAuthenticated, async (req, res) => {
    const data = JSON.parse(fs.readFileSync('./src/data/keys.json'));
    const accessToken = req.session.access_token;
    req.session.accessToken = accessToken;
    const profile = req.user;
    const id = profile['id'];
  
    const response = await axios.get('http://localhost/api/domains');
    const domainsData = response.data;
    let domain = null;
    let subdomain = null;
  
    Object.keys(data).forEach((key) => {
        if (data[key].discord_id === id) {
            domain = data[key].domain;
            subdomain = data[key].subdomain;
        }
      });
      
    const selectedDomain = domain || domainsData[0];

  res.render('domainConfig', { domain: domain, subdomain: subdomain, domains: domainsData, selectedDomain: selectedDomain });
});

router.post('/', async (req, res) => {
    try {
      const { subdomain, domain } = req.body;

      req.session.subdomain = subdomain;
      req.session.domain = domain;
  
      let data = JSON.parse(fs.readFileSync('./src/data/keys.json'));

      const userId = req.user.id;
      
      Object.keys(data).forEach((key) => {
        if (data[key].discord_id === userId) {
          data[key].domain = domain;
          data[key].subdomain = subdomain;
        }
      });

      fs.writeFile('./src/data/keys.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error writing to file');
        } else {
          res.redirect('/dashboard/domain');
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

module.exports = router;