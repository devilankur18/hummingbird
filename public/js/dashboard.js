/* 
 * Created dashboard pages
 * @Author Ankur Agarwal
 */
 if(typeof DFY == 'undefined') DFY = {};

DFY.Dashboard = DFY.Dashboard || (function(w,d,$){
    
    // Model used to define the different types of message
    var messageTypeModel = Backbone.Model.extend({
        defaults: {
            name: ''                // Name of the message type
            , title: ''             // Title of the message
            , description: ''       // Description of the message
            , enable: true          // true | false
        }
        
        , initialize: function(){
        }
    });
    
    var messageTypeCollection =  Backbone.Collection.extend({
        model: messageTypeModel
    })
    
    
    var messageTypes = new messageTypeCollection([
        {name: 'log', title: 'Log'}
        , {name: 'warning', title: 'Warning'}
        , {name: 'error', title: 'Error'}
        , {name: 'information', title: 'Information'}
        , {name: 'assert', title: 'Assert'}
        , {name: 'dump', title: 'Dump'}
    ]);
    
    // Model used to manage user filters
    var filterModel = Backbone.Model.extend({
       defaults: {
           id: ''
           , title: ''                  // Tile for the filter
           , description: ''            // Description
           , from: ''                   // Timestamp
           , to: ''                     // Timestamp
           , ip: ''                     // IP address of the message
           , appId: ''                  // Project Details
           , projectName: ''            // Project Details
           , active: ''                 // true | false
           , path: ''                   // path of the url ex /home
           , cookie: ''                 // cookie id of the user
           , referer: ''                // Value of referer
           , messageTypes: ''  // Type of message
           , message: ''                // Some Search expression
           , moduleId: ''               // The Id of the module to lookin
           , userAgent: ''              // The User Agent
       }

       , initialize: function(){
           this.set({messageTypes: messageTypes.toJSON()});
       }
    });
    
    var filterModelObj = new filterModel();
    
    var filterView = Backbone.View.extend({
        el: false
        
        , template: false
        
        , initialize: function(o){
            console.log('Initialining filter View');
            this.template = _.template($('#filterModel-template').html());
        }
        , render: function(){
            console.log(this.el);
            console.log(filterModelObj);
            a = filterModelObj;
            this.el.html(this.template( filterModelObj.toJSON() )); 
        }
    })
    
    $(function(){
        var filterViewObj = new filterView( {el: $('#showfilter')} );
        filterViewObj.render();
    });
    
})(window,document,jQuery)

var a;