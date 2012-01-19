/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


var LOG_MESSAGE ="This is a log";
var ERROR_MESSAGE ="This is a error";
var WARNING_MESSAGE ="This is a warnings";
var TYPE = ["log","error","warning"];
var MESSAGE = ["This is a log","This is an error","Warning:Can be ignored"];
var MESSAGE_TYPE = ["String","Bool","Json","Array"];


function generateRandomTestData(){
    
    var randomnumber = Math.floor(Math.random()*10);
    var timestamp;
    var type;           
    var messageType;    
    var message;
    var moduleId;       
    var platform;       
    var appId;          
    var userAgent;      
    var ip;
    var jsonArr = [];
    //debugger() //;
    
    for(var i=0; i <= randomnumber; i++)
    {
      timestamp = new Date();
      var randomMessageType = Math.floor(Math.random()*3); 
      type = TYPE[randomMessageType];
      moduleId = 3;
      
      message = MESSAGE[randomMessageType];
      
      
      var firstbyte  = Math.round(Math.random()*255)
      var secondbyte = Math.round(Math.random()*255)
      var thirdbyte  = Math.round(Math.random()*255)
      var fourthbyte = Math.round(Math.random()*255)
      var ipaddress_string = firstbyte+'.'+secondbyte+'.'+thirdbyte+'.'+fourthbyte;
      ip = ipaddress_string;
      
      messageType = MESSAGE_TYPE[Math.floor(Math.random()*4)];
      jsonArr.push({timestamp: timestamp ,type:type ,message:message ,modeuleId:moduleId ,ip:ip ,messageType:messageType});
      
    }
    return jsonArr;   
}


