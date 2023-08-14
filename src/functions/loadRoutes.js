const { green } = require('colorette')
function loadRoutes(app, routes) {
    routes.forEach(route => {
      app.use(route.endpoint, require(route.location));
      console.log(`${green("[SUCCESS]")} "${route.endpoint}" has been successfully loaded from "${route.location}"`);
    });
} 
module.exports = loadRoutes;  