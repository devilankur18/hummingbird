/* 
 * Created dashboard pages
 * @Author Ankur Agarwal
 */
 if(typeof DFY == 'undefined') DFY = {};

 DFY.Dashboard = DFY.Dashboard || (function (w, d, $, A) {

     // Model used to define the different types of message
     var messageTypeModel = Backbone.Model.extend({
         defaults: {
             name: ''                // Name of the message type
            , title: ''             // Title of the message
            , description: ''       // Description of the message
            , enable: true          // true | false
            , counter: 0            //counter for stats
         }

        , initialize: function () {
        }
     });

     var messageTypeCollection = Backbone.Collection.extend({
         model: messageTypeModel
     })

     //     var messageTypeModelView = Backbone.View.extend({

     //         subscribe: function () {
     //             // var that = this;
     //             A.subscribe('count:messageType', function (o) {
     //                 console.log(o);
     //                 counter = o;
     //                 debugger
     //             })
     //         }

     //        , initialize: function () {
     //            this.subscribe();

     //        }

     //        , render: function () {
     //            this.$('.counter').html();
     //        }

     //     })

     var messageTypeView = Backbone.View.extend({
         el: false

        , template: false

        , messageTypeCollection: false

        , modelTemplate: false

        , collectionTemplate: false

        , events: {
            'change input': 'handleChange'
        }

        , subscribe: function () {
            // var that = this;
            A.subscribe('count:messageType', function (o) {
                for (var key in o) {
                   this.$(".counter." + key,this.el).html(o[key]);
               }
               // console.log(o);
                //counter = o;
                //debugger
            })
        }
        , handleChange: function (e) {
            console.log(e);
            var o = $(e.target);
            var data = {};
            data[o.attr('value')] = !!o.attr('checked');
            A.publish('filter:messageType', data);
        }

        , initialize: function () {
            this.modelTemplate = _.template($('#messageTypeModel-template').html());
            this.collectionTemplate = _.template($('#messageTypeCollection-template').html());
            this.$(this.el).html(this.collectionTemplate());
            this.messageTypeCollection = new messageTypeCollection();
            this.messageTypeCollection.bind('add', this.addOne, this);
            this.subscribe();
            this.messageTypeCollection.add(arguments[0].messageTypeCollection);
        }

        , render: function () {
            return this;
        }

        , addOne: function (messageType) {
            this.$(this.el).append(this.modelTemplate(messageType.toJSON()));
        }
     })


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
           , messageTypes: ''           // Type of message
           , message: ''                // Some Search expression
           , moduleId: ''               // The Id of the module to lookin
           , userAgent: ''              // The User Agent
         }

       , initialize: function () {
           //           this.set({messageTypes: messageTypes.toJSON()});
       }
     });



     var filterView = Backbone.View.extend({
         el: false

        , filterModel: false

        , template: false

        , events: {
            'keypress .search-input': 'searchOnEnter'
          , 'change ul.messageTypes>li>label>input': 'hideMessage'
        }

        , hideMessage: function (e) {
            console.log(e);
            //DFY.logApp.setConfig({this.name:this.checked});
            //if(!this.checked)
            {
                //	$(".Classname").hide();
            }
        }
        , searchOnEnter: function (e) {
            if (e.keyCode == 13) {
                // TODO: Seach Logic on enter
                var text = this.$('.search-input', this.el).val();
                console.log('searching for ' + text);
            }
        }
        , initialize: function (o) {
            console.log('Initialining filter View');
            this.template = _.template($('#filterModel-template').html());
            this.filterModel = arguments[0].filterModel;
        }
        , render: function () {
            var obj = this.filterModel.toJSON();
            this.el.html(this.template(obj));
            var messageTypeObj = new messageTypeView({ messageTypeCollection: obj.messageTypes });
            this.$('.messageType').html(messageTypeObj.render().el);
        }
     })

     $(function () {
         var messageTypes = new messageTypeCollection();
         messageTypes.add([
            { name: 'log', title: 'Log' }
            , { name: 'warning', title: 'Warning' }
            , { name: 'error', title: 'Error' }
            , { name: 'information', title: 'Information' }
            , { name: 'assert', title: 'Assert' }
            , { name: 'dump', title: 'Dump' }
        ]);
         var filterModelObj = new filterModel({ messageTypes: messageTypes.toJSON() });
         console.log(filterModelObj);
         var filterViewObj = new filterView({ el: $('#showfilter'), filterModel: filterModelObj });
         filterViewObj.render();

         //        var a = new messageTypeView( {messageTypeCollection:messageTypes.toJSON()});
     });

 })(window, document, jQuery, amplify)

amplify.subscribe('filter:messageType', function(o){console.log(o)})