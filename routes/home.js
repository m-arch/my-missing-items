var express     = require('express');
var router      = express.Router();


//Home
router.route('/')
    .get(getHomeHandler)
    .post(postHomeHandler)


function getHomeHandler(req, res){
    res.render('home', { });
}


function postHomeHandler(req, res){
    res.send({ success: true, redirect: 0})
}

//------------------------------ END OF ROUTES ----------------
module.exports = router;
