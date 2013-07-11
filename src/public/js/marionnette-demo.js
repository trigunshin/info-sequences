MyApp = new Backbone.Marionette.Application();
MyApp.addRegions({
    mainRegion: "#content"
});

Bookmark = Backbone.Model.extend({
    idAttribute: '_id',
    defaults: {url: 'default_url'},
    urlRoot: "/api/bookmark/"
});
Bookmarks = Backbone.Collection.extend({
    model: Bookmark,
    url: "/api/bookmark/"
});

Group = Backbone.Model.extend({
    idAttribute: '_id'
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
        'click li': 'logInfoUrl',
        'click span.bookmark__delete': 'removeBookmark'
    },
    logInfoUrl: function(){
        console.log(this.model.get('url'));
    },
    removeBookmark: function() {
        var self = this;
        if(this.model.get('0')) {
            this.model.set('_id', this.model.get('0')._id);
        }
        this.model.destroy();
    }
});

GroupView = Backbone.Marionette.CompositeView.extend({
    template: "#accordion-group-template",
    className: "accordion-group",
    itemView: BookmarkView,
    itemViewContainer: "ul",
    events: {
        //'click a': 'logInfoUrl',
        'click button#bookmark_add': "addBookmark",
    },
    initialize: function(){
        this.collection = this.model.get('bookmarks');
    },
    logInfoUrl: function(){
        //console.log(this.model.get('url'));
    },
    addBookmark: function() {
        var cur = new Bookmark({url:'new url!'});
        this.collection.create(cur, {wait:true});
        console.log("new_bookmark.save:"+JSON.stringify(this.collection));
    }
});

AccordionView = Backbone.Marionette.CollectionView.extend({
    id: "groupList",
    className: "accordion",
    itemView: GroupView
});

MyApp.addInitializer(function(options){
    var groups = new Groups();
    groups.fetch({
        success: function() {
            // each group's bookmarks must be a backbone collection
            // we initialize them here
            groups.each(function(group){
                bmarks = new Bookmarks();
                bmarks.fetch({
                    data: $.param({group_id: group._id})
                });
                var bookmarkCollection = bmarks;
                group.set('bookmarks', bmarks);
            });

            var accordionView = new AccordionView({
                collection: groups
            });
            MyApp.mainRegion.show(accordionView);
        }
    });
});
MyApp.start();