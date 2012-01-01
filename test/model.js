/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

$(
(function(){
    //Basic Log Model 
    window.logModel = Backbone.Model.extend({

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

                , done:  false          //Todo Items
                , order: Logs.nextOrder()
            }
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
    window.userAgentModel = Backbone.Model.extend({
        defaults:{

        }
    });
  
    //Collection of logModel
    window.logCollection = Backbone.Collection.extend({
       
        // Reference to this collection's model.
        model: logModel,

        // Save all of the logModel items under the `"logs"` namespace.
        localStorage: new Store("logs"),

        // Filter down the list of all log items that are finished.
        done: function() {
          return this.filter(function(log){return log.get('done');});
        },

        // Filter down the list to only todo items that are still not finished.
        remaining: function() {
          return this.without.apply(this, this.done());
        },

        // We keep the Logs in sequential order, despite being saved by unordered
        // GUID in the database. This generates the next order number for new items.
        nextOrder: function() {
          if (!this.length) return 1;
          return this.last().get('order') + 1;
        },

        // Logs are sorted by their original insertion order.
        comparator: function(log) {
          return log.get('order');
        }

    });
    
  // Create our global collection of **Logs**.
  window.Logs = new logCollection;
  console.log(Logs);
  
  
  // Todo Item View
  // --------------

  // The DOM element for a log item...
  window.logView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "li",

    // Cache the template function for a single item.
    template: _.template($('#item-template').html()),

    // The DOM events specific to an item.
    events: {
      "click .check"              : "toggleDone",
      "dblclick div.log-text"    : "edit",
      "click span.log-destroy"   : "clear",
      "keypress .log-input"      : "updateOnEnter"
    },

    // The logView listens for changes to its model, re-rendering.
    initialize: function() {
      this.model.bind('change', this.render, this);
      this.model.bind('destroy', this.remove, this);
    },

    // Re-render the contents of the todo item.
    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      this.setText();
      return this;
    },

    // To avoid XSS (not that it would be harmful in this particular app),
    // we use `jQuery.text` to set the contents of the todo item.
    setText: function() {
      var text = this.model.get('text');
      this.$('.log-text').text(text);
      this.input = this.$('.log-input');
      this.input.bind('blur', _.bind(this.close, this)).val(text);
    },

    // Toggle the `"done"` state of the model.
    toggleDone: function() {
      this.model.toggle();
    },

    // Switch this view into `"editing"` mode, displaying the input field.
    edit: function() {
      $(this.el).addClass("editing");
      this.input.focus();
    },

    // Close the `"editing"` mode, saving changes to the todo.
    close: function() {
      this.model.save({text: this.input.val()});
      $(this.el).removeClass("editing");
    },

    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.close();
    },

    // Remove this view from the DOM.
    remove: function() {
      $(this.el).remove();
    },

    // Remove the item, destroy the model.
    clear: function() {
      this.model.destroy();
    }

  });
  
  
    // The Application
    // ---------------

    // Our overall **AppView** is the top-level piece of UI.
    window.AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#todoapp"),

    // Our template for the line of statistics at the bottom of the app.
    statsTemplate: _.template($('#stats-template').html()),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
      "keypress #new-todo":  "createOnEnter",
      "keyup #new-todo":     "showTooltip",
      "click .todo-clear a": "clearCompleted"
    },

    // At initialization we bind to the relevant events on the `logCollection`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting Logs that might be saved in *localStorage*.
    initialize: function() {
      this.input    = this.$("#new-todo");

      Logs.bind('add',   this.addOne, this);
      Logs.bind('reset', this.addAll, this);
      Logs.bind('all',   this.render, this);

      Logs.fetch();
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      this.$('#todo-stats').html(this.statsTemplate({
        total:      Logs.length,
        done:       Logs.done().length,
        remaining:  Logs.remaining().length
      }));
    },

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(todo) {
      var view = new logView({model: todo});
      this.$("#todo-list").append(view.render().el);
    },

    // Add all items in the **Logs** collection at once.
    addAll: function() {
      Logs.each(this.addOne);
    },

    // If you hit return in the main input field, and there is text to save,
    // create new **Todo** model persisting it to *localStorage*.
    createOnEnter: function(e) {
      var text = this.input.val();
      if (!text || e.keyCode != 13) return;
      Logs.create({text: text});
      this.input.val('');
    },

    // Clear all done todo items, destroying their models.
    clearCompleted: function() {
      _.each(Logs.done(), function(todo){todo.destroy();});
      return false;
    },

    // Lazily show the tooltip that tells you to press `enter` to save
    // a new todo item, after one second.
    showTooltip: function(e) {
      var tooltip = this.$(".ui-tooltip-top");
      var val = this.input.val();
      tooltip.fadeOut();
      if (this.tooltipTimeout) clearTimeout(this.tooltipTimeout);
      if (val == '' || val == this.input.attr('placeholder')) return;
      var show = function(){tooltip.show().fadeIn();};
      this.tooltipTimeout = _.delay(show, 1000);
    }

    });

    // Finally, we kick things off by creating the **App**.
    window.App = new AppView;
    
})()

);