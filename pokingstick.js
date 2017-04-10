//This file is my first attempt to do anything at all with the gateway
//It's basically me poking that thing with a virtual stick


var config = require("./config.json");
var coap = require('coap-dtls');
var example;




example = [ 65536, 65537, 65538 ];
function getAllDevices(callback){
    doRequest("15001", function(response){
        callback(JSON.parse(response.payload.toString()));
    });
}


example = { '3':
{ '0': 'IKEA of Sweden',
    '1': 'TRADFRI bulb GU10 WS 400lm',
    '2': '',
    '3': '1.1.1.1-5.7.2.0',
    '6': 1 },
    '3311':
        [ { '5706': 'f1e0b5',
            '5707': 0,
            '5708': 0,
            '5709': 30140,
            '5710': 26909,
            '5711': 370,
            '5850': 1,
            '5851': 87,
            '9003': 0 } ],
    '5750': 2,
    '9001': 'Bad Spiegel',
    '9002': 1491840540,
    '9003': 65537,
    '9019': 1,
    '9020': 1491840540,
    '9054': 0 };
function getDeviceInfo(devid, callback){
    doRequest("15001/"+devid, function(response){
        callback(JSON.parse(response.payload.toString()));
    });
}



















//run all
getAllDevices(console.log);
getDeviceInfo(65537, console.log);











var lastRequest = new Date();
function doRequest(command,callback){
    //Quick & Dirty hack
    if (new Date() - lastRequest < 500) {
        setTimeout(function(){
            doRequest(command,callback)
        },500);
    } else {
        lastRequest = new Date();
        coap.request(
            'coaps://'+config.ip+':5684/'+command,
            {
                psk: new Buffer(config.psk),
                PSKIdent: new Buffer("Client_identity")
            },
            function(req) {
                req.end();
                req.on('response', function(res){
                    callback(res);
                });
            }
        );
    }
}
