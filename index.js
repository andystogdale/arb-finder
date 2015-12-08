var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){
  
  var myurl = "http://www.oddschecker.com/football/football-coupons/bumper-coupon";
  //var myurl = "http://www.oddschecker.com/football/english/fa-cup";
  var arbCount = 0;
  console.log('scrape requested');

  var options = {
    url: myurl,
    headers: {
      'User-Agent': 'myrequest'
    }
  };
  
  function callback(error, response, html){

        // First we'll check to make sure no errors occurred when making the request
	console.log('hit here');
        if(!error){
		//console.log(html);
            var $ = cheerio.load(html);
	    
	    $('.match-on').filter(function(){
		console.log('in the loop');
                 var data = $(this);
		var home = parseFloat(data.children().eq(1).attr('data-best-odds'));
		var draw = parseFloat(data.children().eq(2).attr('data-best-odds'));
		var away = parseFloat(data.children().eq(3).attr('data-best-odds'));
		if( ((1/home) + (1/draw) + (1/away)) < 1) {
			arbCount++;
		}
            });
	    console.log("returning nicely");
	    res.send("Arb Count: " + arbCount);
        }
        else {
		console.log('in the shit');
		s += "shit";
		res.send(s);
        }
    };

  request(options, callback);
   
});

app.listen('8097')

console.log('Magic happens on port 8097');

exports = module.exports = app;
