/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
/* test comment added */
if(typeof DFY == 'undefined') DFY = {};
DFY.logApp = DFY.logApp || (function (w, d, $, A) {

    //Class Definitions
    var logModel;
    var logCollection;
    var logView;
    var userAgentModel;

    //Objects
    var logCollectionObj;
    var logAppViewObj;

    var defaultCounter = {
        error: 0
        , warning: 0
        , log: 0
    }

    function updateGlobal() {
        A.publish('count:messageType', defaultCounter);
    }

    function getCounter(o) {
        return defaultCounter[o];
    }

    function setCounter(o) {
        defaultCounter[o]++;
    }

    var defaults = {
        error: true
        , warning: true
        , log: true
    }

    var config = {
        topToBottom: false
    };

    //Basic Log Model 
    logModel = Backbone.Model.extend({

        // Default attributes for a log item.
        defaults: function () {
            return {
                uid: ''
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
        , intialize: function () {

        }
    });

    // Managing the different User Agents.
    // To evaluate Browser, Browser version, OS etc
    userAgentModel = Backbone.Model.extend({
        defaults: {

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

        // Cache the template function for a single item.
        template: false


        // The logView listens for changes to its model, re-rendering.
        , initialize: function () {
            this.logtemplate = _.template($('#logModel-template').html());
        }

        // Re-render the contents of the log item.
        , render: function () {
            $(this.el).html(this.logtemplate(this.model.toJSON()));
            return this;
        }
    });

    // The Application
    // ---------------

    // Our overall **AppView** is the top-level piece of UI.
    logAppView = Backbone.View.extend({

        // Instead of generating a new element, bind to the existing skeleton of
        // the App already present in the HTML.
        el: false

        , defaults: {
            error: true
            , warning: true
            , log: true
            , topToBottom: false
        }

        , config: {}

        , setConfig: function (o) {
            this.config = $.extend({}, this.defaults, this.config, o);
        }

        , events: {
            "change #tobottom": "topToBottom"
        }

        , subscribe: function () {
            var that = this;
            A.subscribe('filter:messageType', function (o) {
                that.setConfig(o);
            })
        }

        , topToBottom: function (e) {
            this.config['topToBottom'] = e.currentTarget.checked;
        }



        // At initialization we bind to the relevant events on the `logCollection`
        // collection, when items are added or changed. Kick things off by
        // loading any preexisting todos that might be saved in *localStorage*.
        , initialize: function () {
            this.setConfig(arguments[0].config);
            this.subscribe();
            logCollectionObj.bind('add', this.addOne, this);
            this.template = _.template($('#log-stats-template').html());
            this.$('.check', this.el).html(this.template());
            setInterval("DFY.logApp.updateGlobal()", 3000);
        }

        // Re-rendering the App just means refreshing the statistics -- the rest
        // of the app doesn't change.
        , render: function () {
            return this;
        }

        // Add a single log item to the list by creating a view for it, 
        , count: 1

        , addOne: function (logModel) {

            setCounter(logModel.get("type"));
            // A.publish('count:messageType', {type: logModel.get("type"), count: getCounter(logModel.get("type"))});

            if (this.config[logModel.get("type")]) {
                //var obj = document.getElementById('content'); //TODO
                //obj.scrollTop = obj.scrollHeight - 50;
                logModel.set({ count: this.count++ });
                logModel.set({ uid: logModel.cid });
                var view = new logView({ model: logModel });
                var logAppend = view.render().el;

                //$(logAppend).slideUp();
                //console.log($(logAppend).height());
                if (this.config['topToBottom']) {
                    this.$('.logContainer').append(logAppend);
                }
                else {
                    this.$('.logContainer').prepend(logAppend);
                }

                $(logAppend).hide().slideDown();
                //console.log($(logAppend).height());
            }
        }
        , removeOne: function (idx) {

            $('#' + idx).empty();
        }

        // Add all items in the **Logs** collection at once.
        , addAll: function () {
            logCollectionObj.each(this.addOne);
        }


    });

    function init(o) {

        //Attach functions to be executed at ready Event Handler
        $(document).ready(function () {
            // Finally, we kick things off by creating the **App**.
            logAppViewObj = new logAppView({ el: $("#logapp") });

            logAppViewObj.render();
            var returnId = setInterval("DFY.logApp.addData(generateRandomTestData())", 3000);

        });
    }

    function addData(data) {
        logCollectionObj.add(data);
    }

    function searchBy(param, value) {
        return logCollectionObj.filter(function (o) {
            var temp = o.toJSON();
            return temp[param] == value;
        })
    }

    function searchGeneric(o) {
        //  var tmp = o.JSON();
        return logCollectionObj.filter(function (p) {
            var flag = 1;
            //console.log(o.timestamp);
            //console.log(p.get("timestamp").getTime());
            if ((o.messageTypes) && ((p.get("type") != o.messageTypes))) {
                return false;
            }
            if ((o.from) && (!(p.get("timestamp").getTime() >= o.from))) {
                return false;
            }

            if ((o.to) && (!(p.get("timestamp").getTime() <= o.to))) {
                return false;
            }

            if ((o.moduleId) && ((p.get("moduleId") != o.moduleId))) {
                return false;
            }
            
            if((o.message)){
                var isRegex =  o.isRegex ;
                var isCaseSensitive = o.isCaseSensitive ;

                if(isRegex){
                    var patt =new RegExp(o.message,"gi");
                    if (!(patt.test(p.get("message")))) {
                        return false;
                    }
                }

                else if(isCaseSensitive){
                    var patt = new RegExp(o.message,"g");
                    if (!(patt.test(p.get("message")))) {
                        return false;
                     }
                }

                else{
                    var str = p.get("message");
                    var patt = new RegExp(o.message,"g");
                    if (!(str.search(patt))) {
                        return false;
                     }

                }
            }
            return true;

        })
    }

    return {
        init: init
        , addData: addData
        , updateGlobal: updateGlobal
        , searchBy: searchBy
        , searchGeneric: searchGeneric
    }
})(window, document, jQuery, amplify)
DFY.logApp.init();
//DFY.logApp.searchBy(type, value);
