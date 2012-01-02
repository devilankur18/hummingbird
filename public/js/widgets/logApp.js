/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
/* test comment added */
 
var logApp = logApp || (function(w,d,$){
    
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
        , warning: false
        , log: false
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
            , intialize: function(){

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
            , template: _.template($('#logModel-template').html())

            // The DOM events specific to an item.
            , events: {
    //          "click .check"              : "toggleDone",
            }

            // The logView listens for changes to its model, re-rendering.
            , initialize: function() {
    //          this.model.bind('change', this.render, this);
    //          this.model.bind('destroy', this.remove, this);
            }

            // Re-render the contents of the todo item.
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
            , statsTemplate: _.template($('#log-stats-template').html())

            , listTemplate: _.template($('#log-list-template').html())
            
            , headTemplate: _.template($('#log-head-template').html())
           

            // Delegated events for creating new items, and clearing completed ones.
            , events: {
//              "keypress #new-todo":  "createOnEnter",
            }

            // At initialization we bind to the relevant events on the `logCollection`
            // collection, when items are added or changed. Kick things off by
            // loading any preexisting todos that might be saved in *localStorage*.
            , initialize: function() {
              logCollectionObj.bind('add',   this.addOne, this);
              logCollectionObj.bind('reset', this.addAll, this);
              logCollectionObj.bind('all',   this.render, this);
			  logCollectionObj.bind('remove', this.removeOne, this);
			  
            }

            // Re-rendering the App just means refreshing the statistics -- the rest
            // of the app doesn't change.
            , render: function() {
              this.elHeader.html(this.statsTemplate); 
              this.elFooter.html();
              return this;
            }

            // Add a single todo item to the list by creating a view for it, and
            // appending its element to the `<ul>`.
			, count : 1
			
            , addOne: function(todo) {
                  //this.count++;
                 // debugger;
//                 if((typeError&&(todo.get("type")=="error"))||(typeWarning&&(todo.get("type")=="warning"))||(typeLog)&&(todo.get("type")=="log")){
                 if( config[todo.get("type")] ){
                      todo.set({count:this.count++});
                      /* console.log(todo);
                      if(logCollectionObj.length > 10){
                            //this.removeOne(logCollectionObj.length - 10);
                      } */
                      var view = new logView({model: todo});
                      this.eltable.append(view.render().el);
                }
            }
            , removeOne: function(idx) {

                    $('#'+idx).empty();
            }

            // Add all items in the **Todos** collection at once.
            , addAll: function() {
              logCollectionObj.each(this.addOne);
            }
/*
            // If you hit return in the main input field, and there is text to save,
            // create new **Todo** model persisting it to *localStorage*.
//            createOnEnter: function(e) {
//              var text = this.input.val();
//              if (!text || e.keyCode != 13) return;
//              logCollectionObj.create({text: text});
//              this.input.val('');
//            }

            // Lazily show the tooltip that tells you to press `enter` to save
            // a new todo item, after one second.
//            , showTooltip: function(e) {
//              var tooltip = this.$(".ui-tooltip-top");
//              var val = this.input.val();
//              tooltip.fadeOut();
//              if (this.tooltipTimeout) clearTimeout(this.tooltipTimeout);
//              if (val == '' || val == this.input.attr('placeholder')) return;
//              var show = function(){tooltip.show().fadeIn();};
//              this.tooltipTimeout = _.delay(show, 1000);
//            }
*/
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
            var returnId = setInterval( "logApp.addData([{id:1,timestamp:new  Date,type:'log',message:'This is log'},{id:2,timestamp:new  Date,type:'error',message:'This is error'},{id:3,timestamp:new  Date,type:'warning',message:'This is warning'}])",1000 );
			//[{id:1,timestamp:'123123123',type:'log',message:'This is log'},{id:2,timestamp:'2223123123',type:'error',message:'This is error'},{id:3,timestamp:'333333333',type:'warning',message:'This is warning'}]
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
logApp.init();
