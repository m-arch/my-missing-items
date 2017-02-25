//loading envirnoment
require('dotenv').config();

//third party requirements
const express = require('express');
const app = express();
const port = 3000
const bodyParser = require('body-parser');
var Q = require('q');
const logic = require('./logic');
// ------------------------------------------------------- END of third party package requirements ------------------------------------------------

//environment varialbes
var mode = process.env.DEV_ENV

//connection to database
var DB = require('./db')

console.log("connecting....");
DB.connect(mode, function(err, id){
    if (err){
	console.log("unable to connect, " + id + " database");
	assert.equal(null, err);
    }else{
	//initializing database
	//setup admin user
	//Starting the application
	app.listen(port, () => {
	    console.log('app listening on '+ port)	    
	});
    }
});


//-----------------------------------------------------------END of Requirements ------------------------------------------------------------------
app.set('trust proxy', 1); // trust first proxy


//static content use
app.use('/', express.static('public'));



//grabbing post information using body-parser
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));


//setting routes
app.use('/', require('./routes'));



//setting viewing engine to pug, pug will look for view files in ./views
app.set('view engine', 'pug')

//page does not exist and error handling
app.get('/error', (request, response) => {  
    throw new Error ('oops')
})


app.use((err, request, response, next) => {
    console.log(err)
    response.status(500).send('Broken link!')
    next();
})


// setTimeout(function(){
//     Q.fcall(logic.createSuppliersInventoryFolder, ["MS", "MS", "MS"])
// 	.then(function(path){
// 	    return logic.makePhotosZip(path);
// 	})
// 	.then(function(){
// 	    console.log("done");
// 	})
// 	.catch(function(err){
// 	    console.log(err);
// 	});
// }, 1000);
