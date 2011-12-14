/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


  logModel = Backbone.Model.extend({
        defaults:{
            id :'',
            timestamp:'',
            type:'', //error,warning,logs,asserts(enum)
            messageType:'',//string,Object Dump
            message:'',
            module:'',
            platform:'', //php,JS
            appId:'', //key corresponding user
            // userId not needed from user
            userAgent:'', //will be enum value from server
            ip:''
        },
        intialize:function(){
        }
        
  });
  userAgent = Backbone.Model.extend({
      defaults:{
          
      }
  });
  
  
  var logCollection = Backbone.Model.extend({
        model: logModel
    });
  
 logView = Backbone.View.extend({
        initialize: function(){
            alert("Log View");
        }
    });  
  
  
  
        
		
    
