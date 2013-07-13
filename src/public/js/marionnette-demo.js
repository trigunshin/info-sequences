Bookmark = Backbone.Model.extend({
    idAttribute: '_id',
    //defaults: {url: 'default_url'},
    urlRoot: "/api/bookmark/",
    schema: {
        url: 'Text',
        description: 'Text'
    }
});
Bookmarks = Backbone.Collection.extend({
    model: Bookmark,
    url: "/api/bookmark/"
});

Group = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot: "/api/group/",
    schema: {
        name: 'Text',
        description: 'Text'
    }
});
Groups = Backbone.Collection.extend({
    model: Group,
    url: "/api/group/"
});

BookmarkView = Backbone.Marionette.ItemView.extend({
    initialize: function() {
        //when the model gets destroyed, remove the view
        this.listenTo(this.model, 'destroy', this.remove);
    },
    template: "#bookmark-template",
    tagName: "li",
    events: {
        'click span.bookmark__delete': 'removeBookmark'
    },
    removeBookmark: function() {
        var self = this;
        this.model.destroy();
    }
});


GroupView = Backbone.Marionette.CompositeView.extend({
    template: "#accordion-group-template",
    className: "accordion-group",
    itemView: BookmarkView,
    itemViewContainer: "ul",
    events: {
        //'click span#bookmark_add': "addBookmark",
    },
    initialize: function(){
        this.collection = this.model.get('bookmarks');
    },
    appendHtml: function(collectionView, itemView){
        collectionView.$("ul").append(itemView.el);
    },
});

// A Grid Row (group-level)
var GridRow = Backbone.Marionette.CompositeView.extend({
    template: "#row-accordion-template",
    tagName: "div",
    className: "grid_row",
    itemView: BookmarkView,
    itemViewContainer: "ul",

    initialize: function(){
        this.collection = this.model.get('bookmarks');
    },
    events: {
        'click span#group_remove': 'removeGroup',
        'click span#bookmark_add': "addBookmark"
    },
    removeGroup: function(e) {
        //XXX this leaves potential zombie bookmarks
        this.model.destroy();
    },
    addBookmark: function() {
        console.log("group id:"+this.model.get('_id'));
        var cur = new Bookmark({url:'new url!', group_id:this.model.get('_id')});
        this.collection.create(cur, {wait:true});
        console.log("new_bookmark.save:"+JSON.stringify(this.collection));
    }
});

// The grid view (group-level)
var GridView = Backbone.Marionette.CompositeView.extend({
    tagName: "div",
    template: "#grid-template",
    itemView: GridRow,

    appendHtml: function(collectionView, itemView){
        collectionView.$("div#grid_list").append(itemView.el);
    },
    events: {
        'click span#group_add': 'addGroup',
    },
    addGroup: function(e) {
        console.log("creating");
        this.collection.create(
            {name:"New Group N", description: "A new group!", _id: null},
            {wait: true}
        );
    }
});
/*
MyApp = new Backbone.Marionette.Application();
MyApp.addRegions({
    mainRegion: "#content"
});
MyApp.addInitializer(function(options){
    var groups = new Groups();
    groups.fetch({
        success: function() {
            // each group's bookmarks must be a backbone collection
            groups.each(function(group){
                bmarks = new Bookmarks();
                bmarks.fetch({
                    data: $.param({group_id: group._id})
                });
                var bookmarkCollection = bmarks;
                //group.set('bookmarks', bmarks);
            });

            var accordionView = new AccordionView({
                collection: groups
            });
            MyApp.mainRegion.show(accordionView);
        }
    });
});
MyApp.start();
//*/


var groups = new Groups();
groups.fetch({
    success: function() {
        var gridView = new GridView({
            collection: groups
        });
        groups.each(function(group){
            bmarks = new Bookmarks();
            bmarks.fetch({
                data: $.param({group_id: group.get('_id')})
            });
            var bookmarkCollection = bmarks;
            group.set('bookmarks', bmarks);
        });
        gridView.render();


        var form = new Backbone.Form({
            model: new Group({}),
            idprefix: 'group-'
        }).render();

        $('div#group_form').append(form.el);

        $("#grid").html(gridView.el);
    }
});