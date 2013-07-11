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
    defaults: {}
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
    defaults: {}
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
  el: "#app-container"
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

//var layout = new AppLayout();
//container.show(layout);

MyApp = new Backbone.Marionette.Application();

MyApp.addRegions({
  mainRegion: "#content"
});

Villain = Backbone.Model.extend({});

Villains = Backbone.Collection.extend({
    model: Villain,
});

Hero = Backbone.Model.extend({});

Heroes = Backbone.Collection.extend({
    model: Hero,
    url: "/api/group/"
});

VillainView = Backbone.Marionette.ItemView.extend({
  template: "#villain-template",
  tagName: "li",

  events: {
    'click li': 'logInfoUrl'
  },

  logInfoUrl: function(){
    console.log(this.model.get('url'));
  }
});

HeroView = Backbone.Marionette.CompositeView.extend({
  template: "#accordion-group-template",
  className: "accordion-group",
  itemView: VillainView,
  itemViewContainer: "ul",
  events: {
    'click a': 'logInfoUrl'
  },
  initialize: function(){
    this.collection = this.model.get('bookmarks');
  },
  logInfoUrl: function(){
    //console.log(this.model.get('url'));
  }
});

AccordionView = Backbone.Marionette.CollectionView.extend({
  id: "heroList",
  className: "accordion",
  itemView: HeroView
});


MyApp.addInitializer(function(options){
    var heroes = new Heroes();
    heroes.fetch({
        success: function() {
            // each hero's villains must be a backbone collection
            // we initialize them here
            heroes.each(function(hero){
                var villains = hero.get('bookmarks');
                var villainCollection = new Villains(villains);
                hero.set('bookmarks', villainCollection);
            });

            var accordionView = new AccordionView({
                collection: heroes
            });
            MyApp.mainRegion.show(accordionView);
        }
    });
});

MyApp.start();//{heroes: heroes});







