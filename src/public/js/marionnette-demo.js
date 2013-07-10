var User = Backbone.Model.extend({
    defaults: {
        'field': 'fillme',
        'id': 1,
        email: 'fake@fakerrrr.com'
    },
    urlRoot: '/api/user/'
});
var VUser = Marionette.ItemView.extend({
    template: '#infoTpl',
    modelEvents: {
        "change": "render"
    }
});

var Group = Backbone.Model.extend({
    defaults: {
        field : null,
        id : null
    }
});
var Groups = Backbone.Collection.extend({
    model: Group,
    url: "/api/group"
});
var VGroupRow = Marionette.ItemView.extend({
    template: '#group__row',
    tagName: 'li'
});
var VGroupsList = Marionette.CompositeView.extend({
    template: '#groups__list',
    itemViewContainer: 'ul',
    itemView: VGroupRow
});

var Bookmark = Backbone.Model.extend({
    defaults: {
        field : null,
        id : null
    }
});
var Bookmarks = Backbone.Collection.extend({
    model: Bookmark,
    url: "/api/bookmark"
});
var VBookmarkRow = Marionette.ItemView.extend({
    template: '#bookmark__row',
    tagName: 'li'
});
var VBookmarksList = Marionette.CompositeView.extend({
    template: '#bookmarks__list',
    itemViewContainer: 'ol',
    itemView: VBookmarkRow
});

var container = new Backbone.Marionette.Region({
  el: "#container"
});

var AppLayout = Backbone.Marionette.Layout.extend({
    template: "#layout-template",

    regions: {
        user: "div#user",
        groups: "div#groups",
        bookmarks: "div#bookmarks"
    },
    onRender: function() {
        var user = new User();
        var groups = new Groups();
        var bookmarks = new Bookmarks();
        groups.fetch();
        user.fetch();
        bookmarks.fetch();

        var vUser = new VUser({ model: user});
        var vGroups = new VGroupsList({ collection: groups});
        var vBookmarks = new VBookmarksList({ collection: bookmarks});

        layout.user.show(vUser);
        layout.groups.show(vGroups);
        layout.bookmarks.show(vBookmarks);
    }

});

var layout = new AppLayout();
container.show(layout);
