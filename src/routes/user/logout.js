const express=require('express')
const router=express.Router()

function requiresAuth(req, res, next) {
    if (req.session && req.session.isAuthenticated) {
      return next();
    } else {
      res.redirect('/login');
    }
}

router.get('/', requiresAuth,function(req, res) {
    req.session.destroy(function(err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/');
      }
    });
  });
module.exports=router;