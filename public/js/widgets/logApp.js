/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
/* test comment added */
if(typeof DFY == 'undefined') DFY = {};
DFY.logApp = DFY.logApp || (function(w,d,$){
    
    //Class Definitions
    var logModel;
    var logCollection;
    var logView;
    var userAgentModel;
    
    //Objects
    var logCollectionObj;
    var logAppViewObj;
    
    var defaults = {
        error: true
        , warning: true
        , log: true
    }
    
    var config = {
    };
    
    function getConfig(o){
        return config;
    }
    
    function setConfig(o){
        config = $.extend({}, defaults, config, o);
    }
    
    function logApp(){
       
        //Basic Log Model 
        logModel = Backbone.Model.extend({

            // Default attributes for a log item.
            defaults: function(){
                return {
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
                }
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
        logCollection = Backbone.Collection.extend({
            // Reference to this collection's model.
            model: logModel
        });

      // Create our global collection of **Logs**.
      logCollectionObj = new logCollection;

      // Log Item View
      // --------------

      // The DOM element for a log item...
      logView = Backbone.View.extend({

            //... is a list tag.
            tagName:  "div"

            // Cache the template function for a single item.
            , template: false


            // The logView listens for changes to its model, re-rendering.
            , initialize: function() {
              this.template  = _.template($('#logModel-template').html());
            }

            // Re-render the contents of the log item.
            , render: function() {
              $(this.el).html(this.template(this.model.toJSON()));
              return this;
            }
      });

        // The Application
        // ---------------

        // Our overall **AppView** is the top-level piece of UI.
        logAppView = Backbone.View.extend({

            // Instead of generating a new element, bind to the existing skeleton of
            // the App already present in the HTML.
            el: $("#logapp")

            , elHeader: $("#logapp .logapp-header")
            , elBody: $("#logapp .logapp-body")
            , elFooter: $("#logapp .logapp-footer")
            , eltable: $("#logTable")
			 
            // Our template for the line of statistics at the bottom of the app.
            , statsTemplate: false

            , listTemplate: false
            
            , headTemplate: false
            
            
            // At initialization we bind to the relevant events on the `logCollection`
            // collection, when items are added or changed. Kick things off by
            // loading any preexisting todos that might be saved in *localStorage*.
            , initialize: function() {
              logCollectionObj.bind('add',   this.addOne, this);
              logCollectionObj.bind('reset', this.addAll, this);
              logCollectionObj.bind('all',   this.render, this);
              logCollectionObj.bind('remove', this.removeOne, this);
              this.statsTemplate = _.template($('#log-stats-template').html());
              this.listTemplate  = _.template($('#log-list-template').html());
              this.headTemplate  = _.template($('#log-head-template').html());
			  
            }

            // Re-rendering the App just means refreshing the statistics -- the rest
            // of the app doesn't change.
            , render: function() {
              this.elHeader.html(this.statsTemplate); 
              this.elFooter.html();
              return this;
            }

            // Add a single log item to the list by creating a view for it, 
            , count : 1
			
            , addOne: function(todo) {
                
                 if( config[todo.get("type")] ){
                      todo.set({count:this.count++});
                      var view = new logView({model: todo});
                      this.eltable.append(view.render().el);
                }
            }
            , removeOne: function(idx) {

                    $('#'+idx).empty();
            }

            // Add all items in the **Logs** collection at once.
            , addAll: function() {
              logCollectionObj.each(this.addOne);
            }
     });
    }
    
    function init(o){
      
        setConfig(o);
        //Attach functions to be executed at ready Event Handler
        $(document).ready(function(){
            logApp();

            // Finally, we kick things off by creating the **App**.
            logAppViewObj = new logAppView;
            logAppViewObj.render();
            var returnId = setInterval( "DFY.logApp.addData([{id:1,timestamp:new  Date,type:'log',message:'This is log'},{id:2,timestamp:new  Date,type:'error',message:'This is error'},{id:3,timestamp:new  Date,type:'warning',message:'This is warning'}])",1000 );
			
        });
    }
    
    function addData(data){
        logCollectionObj.add(data);
    }
    
    return {
        init: init
        , addData: addData
        , setConfig: setConfig
        , getConfig: getConfig
    }
})(window, document, jQuery)
DFY.logApp.init();
