//This file is my first attempt to do anything at all with the gateway
//It's basically me poking that thing with a virtual stick


var config = require("./config.json");
var coap = require('coap-dtls');
var example;




example = [ 65536, 65537, 65538 ];
function getAllDevices(callback){
    doRequest("15001", function(response){
        callback(translate(JSON.parse(response.payload.toString())));
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
        callback(translate(JSON.parse(response.payload.toString())));
    });
}

function translate(obj) {
    var dict = {
        '1001': 'NEW_FIRMWARE_AVAILABLE',
        '1002': 'SMART_TASK_TRIGGERED_EVENT',
        '1003': 'GATEWAY_REBOOT_NOTIFICATION',
        '2051': 'OPTION_APP_TOKEN',
        '5001': 'LOSS_OF_INTERNET_CONNECTIVITY',
        '15001': 'DEVICES',
        '15002': 'HS_LINK',
        '15004': 'GROUPS',
        '15005': 'SCENE',
        '15006': 'NOTIFICATIONS',
        '15009': 'SWITCH',
        '15010': 'SCHEDULES',
        '15011': 'GATEWAY',
        '15012': 'GATEWAY_DETAILS',
        '15013': 'LIGHT_SETTING',
        '3300': 'SENSOR',
        '3311': 'LIGHT',
        '3312': 'PLUG',
        '5601': 'MIN_MSR_VALUE',
        '5602': 'MAX_MSR_VALUE',
        '5603': 'MIN_RNG_VALUE',
        '5604': 'MAX_RNG_VALUE',
        '5605': 'RESET_MIN_MAX_MSR',
        '5700': 'SENSOR_VALUE',
        '5701': 'UNIT',
        '5706': 'COLOR',
        '5709': 'COLOR_X',
        '5710': 'COLOR_Y',
        '5712': 'TRANSITION_TIME',
        '5750': 'TYPE',
        '5751': 'SENSOR_TYPE',
        '5805': 'CUM_ACTIVE_POWER',
        '5820': 'POWER_FACTOR',
        '5850': 'ONOFF',
        '5851': 'DIMMER',
        '5852': 'ON_TIME',
        '9001': 'NAME',
        '9002': 'CREATED_AT',
        '9003': 'INSTANCE_ID',
        '9009': 'SCENE_LINK',
        '9014': 'NOTIFICATION_STATE',
        '9015': 'NOTIFICATION_EVENT',
        '9016': 'SMART_TASK_TEMPLATE',
        '9017': 'NOTIFICATION_NVPAIR',
        '9018': 'HS_ACCESSORY_LINK',
        '9019': 'REACHABILITY_STATE',
        '9020': 'LAST_SEEN',
        '9023': 'NTP_SERVER',
        '9024': 'TIME_REMAINING_IN_SECONDS',
        '9029': 'VERSION',
        '9030': 'REBOOT',
        '9031': 'RESET',
        '9032': 'FORCE_CHECK_OTA_UPDATE',
        '9033': 'SESSION_ID',
        '9034': 'UPDATE_FIRMWARE',
        '9035': 'GATEWAY_NAME',
        '9036': 'MASTER_TOKEN_TAG',
        '9037': 'OTA_UPDATE',
        '9038': 'GROUP_ID',
        '9039': 'SCENE_ID',
        '9040': 'SMART_TASK_TYPE',
        '9041': 'REPEAT_DAYS',
        '9042': 'START_ACTION',
        '9043': 'END_ACTION',
        '9044': 'TRIGGER_TIME_INTERVAL',
        '9045': 'GROUP_SETTINGS',
        '9046': 'START_TIME_HR',
        '9047': 'START_TIME_MN',
        '9048': 'END_TIME_HR',
        '9049': 'END_TIME_MN',
        '9050': 'SMART_TASK_ACTION',
        '9051': 'SHORTCUT_ICON_REFERENCE_TYPE',
        '9052': 'GATEWAY_REBOOT_NOTIFICATION_TYPE',
        '9054': 'OTA_UPDATE_STATE',
        '9055': 'GATEWAY_UPDATE_PROGRESS',
        '9056': 'GATEWAY_UPDATE_DETAILS_URL',
        '9057': 'SCENE_INDEX',
        '9058': 'SCENE_ACTIVATE_FLAG',
        '9059': 'CURRENT_TIMESTAMP',
        '9061': 'COMMISSIONING_MODE',
        '9063': 'AUTH_PATH',
        '9064': 'SESSION_LENGTH',
        '9066': 'OTA_TYPE',
        '9068': 'IKEA_MOODS',
        '9069': 'UPDATE_ACCEPTED_TIMESTAMP',
        '9070': 'USE_CURRENT_LIGHT_SETTINGS',
        '9071': 'GATEWAY_TIME_SOURCE',
        '9090': 'CLIENT_IDENTITY_PROPOSED',
        '9091': 'NEW_PSK_BY_GW',
        '9994': 'TIME_ARRAY',
        '9995': 'GROUP_LINK_ARRAY'
    };
    function stage1(obj) {
        var newArr;
        var newObj = {};
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                if(dict[prop]) {
                    if(typeof obj[prop] === 'object') {
                        if(obj[prop] instanceof Array) {
                            newArr = [];
                            obj[prop].forEach(function(elem){
                                newArr.push(stage1(elem));
                            });
                            newObj[dict[prop]] = newArr;
                        } else {
                            newObj[dict[prop]] = stage1(obj[prop]);
                        }
                    } else {
                        if(dict[obj[prop]]) {
                            newObj[dict[prop]] = dict[obj[prop]];
                        } else {
                            newObj[dict[prop]] = obj[prop];
                        }
                    }
                } else {
                    if(typeof obj[prop] === 'object') {
                        if(obj[prop] instanceof Array) {
                            newArr = [];
                            obj[prop].forEach(function(elem){
                                newArr.push(stage1(elem));
                            });
                            newObj[prop] = newArr;
                        } else {
                            newObj[prop] = stage1(obj[prop]);
                        }
                    } else {
                        if(dict[obj[prop]]) {
                            newObj[prop] = dict[obj[prop]];
                        } else {
                            newObj[prop] = obj[prop];
                        }
                    }

                }
            }
        }
        return newObj
    }
    return stage1(obj);
}


getAllDevices(console.log);
getDeviceInfo(65537, console.log);




var lastRequest = new Date();
function doRequest(command,callback){
    //Quick & Dirty hack to avoid dropping packages
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
