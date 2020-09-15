const express = require("express");

const request = require('request');

//to decode the jwt auth token and generate the json, from jwt.org
const jwt = require('jsonwebtoken');
var router = express.Router();

var exchangeUrl = "https://oauth2.googleapis.com/token"
var grant_type="authorization_code"
var client_id="%CLIENT_ID%"
var client_secret="%CLIENT_SECRET%"
var redirect_uri="http://localhost:9000/testAPI"

var redirectUIEndpoint = "http://localhost:3000"

var tokenRes;

router.get("/", async function(req, res, next) {

	code = req.query.code;
	tokenRes = await tokenRequest(code);
	console.log(tokenRes);
	var idToken = tokenRes.id_token;
	var redirectUIUrlWithAuthToken = redirectUIEndpoint + "?authToken=" + idToken;
	res.redirect(redirectUIUrlWithAuthToken);

});


router.get("/decode", function(req, res, next) {
	var token = req.query.authToken;
	var decodedTokenJson = jwt.decode(token);

	var resp = {"decodedTokenJson" : decodedTokenJson}

	console.log(decodedTokenJson)
	res.send(resp);

});

 function fireTokenReq(code) {
	tokenRequest(code);
}


function tokenRequest(code) {

	tokenExchangePayload = {"client_id" : client_id , 
					"client_secret" : client_secret ,
					"code" : code ,
					 "grant_type" : grant_type ,
					 "redirect_uri" : redirect_uri
					  }; 

	exchangeUrl += "?client_id=" + client_id + 
					"&client_secret=" + client_secret +
					"&code=" + code +
					 "&grant_type=" + grant_type +
					 "&redirect_uri=" + redirect_uri

	return new Promise((resolve, reject) => {
        request.post(exchangeUrl,tokenExchangePayload, (error, response, body) => {
            if (error) reject(error);
            if (response.statusCode != 200) {
                reject('Invalid status code <' + response.statusCode + '>');
            }
            resolve(JSON.parse(body));
        });
    });




	

	//request.post(exchangeUrl, tokenExchangePayload, callback);

}

function callback(err, res, body) {
	tokenRes = JSON.parse(body);

	//console.log(tokenRes)
	//console.log(tokenRes.id_token)

    decoded = jwt.decode(tokenRes.id_token);

	//console.log(decoded);
    return tokenRes;
}
module.exports = router;
