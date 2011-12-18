/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

    //Basic Log Model 
    logModel = Backbone.Model.extend({

        // Default attributes for a log item.
        defaults:{
            id: ''
            , timestamp: ''
            , type: ''              //error,warning,logs,asserts(enum)
            , messageType: ''       //string,json,array,bool
            , message: ''           
            , moduleId: ''          //Module id
            , platform: ''          //php,JS
            , appId: ''             //key corresponding user
                                    // userId not needed from user
            , userAgent: ''         //will be enum value from server
            , ip: ''
            
            , done:  false          //Todo Items
            , order: Todos.nextOrder()
        }
        
        // Toggle the `done` state of this todo item.
        , toggle: function() {
          this.save({done: !this.get("done")});
        }
        
        , intialize:function(){
        
        }
    });
    
    // Managing the different User Agents.
    // To evaluate Browser, Browser version, OS etc
    userAgentModel = Backbone.Model.extend({
        defaults:{

        }
    });
  
    //Collection of logModel
    var logCollection = Backbone.Model.extend({
        model: logModel
    });
  
    logView = Backbone.View.extend({
       
        // Reference to this collection's model.
        model: logModel,

        // Save all of the logModel items under the `"logs"` namespace.
        localStorage: new Store("logs"),

        // Filter down the list of all log items that are finished.
        done: function() {
          return this.filter(function(log){ return log.get('done'); });
        },

        // Filter down the list to only todo items that are still not finished.
        remaining: function() {
          return this.without.apply(this, this.done());
        },

        // We keep the Todos in sequential order, despite being saved by unordered
        // GUID in the database. This generates the next order number for new items.
        nextOrder: function() {
          if (!this.length) return 1;
          return this.last().get('order') + 1;
        },

        // Todos are sorted by their original insertion order.
        comparator: function(todo) {
          return todo.get('order');
        }

       
       
    });  
  
  
  
        
		
    
