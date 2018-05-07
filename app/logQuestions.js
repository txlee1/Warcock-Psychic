var express = require('express');
var connect = require('connect');
var fs = require('fs');
var bodyParser  = require('body-parser');
var app = express();
var SpellChecker = require ('spellchecker');
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
 


app.use(bodyParser.json());

app.get('/', function(req, res){
    console.log('GET /')
    var html = fs.readFileSync('index.html');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(html);
});

app.get('/Warcock.png', function(req, res){
    console.log('get Warcock.png')
    var image = fs.readFileSync('Warcock.png');
    res.send(image);
});

app.post('/', function(req, res){
    console.log('POST /');
    console.dir(req.body);
    console.log("Question is "+ req.body.question);
    var spellResult=SpellChecker.checkSpelling(req.body.question);
    var questionArray=req.body.question.split(" ");
    console.dir(spellResult);

    var urlToPlay="";
    if (spellResult.length>0){
        console.log("There is a misspelled word in this question");
        urlToPlay = getResponseToMeaninglessQuestion();
    } else if(questionArray.length<2){
        console.log("Less than two words in question. This makes no sense");
        urlToPlay = getResponseToMeaninglessQuestion();
    }
    else{        
        urlToPlay=getResponseToMeaningfulQuestion();
        //Log question to a file so we can analyze them later
        var json = JSON.stringify(req.body);
        fs.appendFile("questions.json",json,function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    }

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(urlToPlay);
});

app.listen(server_port, server_ip_address, function () {
    console.log( "Listening on " + server_ip_address + ", port " + server_port )
  });

/*Global functions and variable*/
var urlMeaninglessQuestion = ["https://www.youtube.com/embed/BU2dgLYlFRg","https://www.youtube.com/embed/fmdRBDkU3mI", "https://www.youtube.com/embed/IcoZtZpgGcg"];
var urlMeaningful = ["https://www.youtube.com/embed/raE2wXNfLi0","https://www.youtube.com/embed/tb4NgNoIiLA", "https://www.youtube.com/embed/qRnhsw3ympk", "https://www.youtube.com/embed/r5wa-KzQo2A","https://www.youtube.com/embed/XAAAs44pSPs","https://www.youtube.com/embed/XtjP4fRkREc","https://www.youtube.com/embed/8tTbjyoluSM","https://www.youtube.com/embed/4tmZMjJuyJ0","https://www.youtube.com/embed/UV86Eu1eq3w"];

/* This function randomly selects a video as a response to a bogus question */
function getResponseToMeaninglessQuestion() {
    var vidNum=Math.floor(Math.random()*urlMeaninglessQuestion.length);
    var urlToPlay = urlMeaninglessQuestion[vidNum];
    return urlToPlay;
}
/* This function randomly selects a video as a response to a real question */
function getResponseToMeaningfulQuestion() {
    var vidNum=Math.floor(Math.random()*urlMeaningful.length);
    var urlToPlay = urlMeaningful[vidNum];
    return urlToPlay;
}
