$(document).ready(function() {
  // **ListView class**: Our main app view.
    var ListView = Backbone.View.extend({
        el: $('body'), // attaches `this.el` to an existing element.
        events: {
            'click button#add': 'addItem'
        },
        initialize: function() {
            // every function that uses 'this' as the current object should be in here
            _.bindAll(this, 'render', 'addItem');
            this.counter = 0; // total number of items added thus far
            this.render();
        },
        render: function(){
            $(this.el).append("<button id='add'>Add list item</button>");
            $(this.el).append("<ul></ul>");
        },
        addItem: function(){
            this.counter++;
            $('ul', this.el).append("<li>hello world"+this.counter+"</li>");
        }
    });
    // **listView instance**: Instantiate main app view.
    var listView = new ListView();
});