// routes
var express = require('express');
var router = express.Router();

router.use(function timeLog(req, res, next) {
    console.log("the router request is: " + JSON.stringify(req.headers))
    next();
});

router.use('/', require('./home'));

module.exports = router;
