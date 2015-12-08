var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
app.use(express.static(__dirname + '/public'));

var arbs = [];

app.get('/scrape', function(req, res) {
    update();
});

app.get('/arbs', function(req, res) {
    res.send(arbs);
});

function update() {  
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
        var newarbs = [];
        // First we'll check to make sure no errors occurred when making the request
        //console.log('hit here');
        if(!error){
		//console.log(html);
            var $ = cheerio.load(html);
	    
            $('.match-on').filter(function(){
                //console.log('in the loop');
                var data = $(this);
                var homeData = data.children().eq(1);
                var drawData = data.children().eq(2);
                var awayData = data.children().eq(3);
                var linkData = data.children().eq(4);
                
                var homeName = homeData.children().eq(0).children().eq(1).text();
                var awayName = awayData.children().eq(0).children().eq(1).text();
                var matchName = homeName + " vs " + awayName;
                
                var homePrice = parseFloat(homeData.attr('data-best-odds'));
                var drawPrice = parseFloat(drawData.attr('data-best-odds'));
                var awayPrice = parseFloat(awayData.attr('data-best-odds'));
                
                var totalPercentage = ((1/homePrice) + (1/drawPrice) + (1/awayPrice));
                var isInPlay = linkData.children().eq(0).hasClass('in-play');
                var linkAddress = "http://www.oddschecker.com" + linkData.children().eq(0).attr('href');
                
                if( totalPercentage < 1 && !isInPlay) {
                    arbCount++;
                    var arbObj = {
                        homePrice : homePrice,
                        homePercentage : 1/homePrice,
                        drawPrice : drawPrice,
                        drawPercentage : 1/drawPrice,
                        awayPrice : awayPrice,
                        awayPercentage : 1/awayPrice,
                        matchName : matchName,
                        totalPercentage : totalPercentage,
                        linkAddress : linkAddress
                    };
                    newarbs.push(arbObj);
                }
            });
            console.log("finished updating nicely");
            arbs = newarbs;
        }
        else {
            console.log('in the shit');
            s += "shit";
            res.send(s);
        }
    };

  request(options, callback);
   
}

update();

app.get('/', function(req, res) {
    res.sendfile('./public/index.html');
});

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
 
app.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", server_port " + server_port );
});



exports = module.exports = app;
