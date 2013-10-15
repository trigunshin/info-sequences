var base_data = {
    "id":  "id_geb",
    "name": "geb",
    "data": {
        "url": "en.wikipedia.org/wiki/Gödel,_Escher,_Bach",
        "description": "geb description..."
    },
    "children": [{
            "id": "antifragile_id",
            "name": "antifragile",
            "data": {
                "url": "en.wikipedia.org/wiki/Antifragile:_Things_That_Gain_from_Disorder",
                "description": "antifragile description..."
            },
            "children": []
    }]
};
var labelType, useGradients, nativeTextSupport, animate;

var id_counter = 0;
var get_next_id = function() {
    id_counter +=1;
    return ''+id_counter;
};

var current_node = null;
/* Intercept the on-click to get focused node for potential child addition. */
var get_on_click_decorator = function(ht) {
    ht._my_on_click_deco = ht.onClick;
    var on_click_decorator = function(node_id, w) {
        var cur_node = ht.graph.getNode(node_id);
        current_node = cur_node;
        ht._my_on_click_deco(node_id, w);
    };
    return on_click_decorator;
};

var remove_field = function(node) {
    _.map(_.keys(node.data), function(key) {
        if(key[0] === '$') {
            delete node.data[key];
        }
    });
    node.children = _.map(node.children, remove_field);
    return node;
};

var ht=null;
var open_the_gate = function() {
    ht = init(base_data);
    ht.onClick = get_on_click_decorator(ht);
    current_node = ht.graph.getNode(ht.root);

    // save_tree click handler
    $('#save_tree_button').click(function(e) {
        var ht_data = {ht_data: remove_field(ht.toJSON())};

        console.log('clicked save w/data:'+JSON.stringify(ht_data));
        $.post('/api/tree', ht_data, function(data, textStatus, jqXHR) {
            //console.log('post succeeded w/reply:' + JSON.stringify(data));
            //console.log('post succeeded w/textStatus:' + JSON.stringify(textStatus));
            //console.log('post succeeded w/jqxhr:' + JSON.stringify(jqXHR));
        });
    });
    // add_node click handler
    var incr = 0;
    $('#add_form').submit(function(e) {
        var form_data = $('#add_form').serializeArray();
        var tmp = {
            id: get_next_id(),
            data: {},
            children: []
        };
        for(var i=0,iLen=form_data.length;i<iLen;i++) {
            if(form_data[i].name === 'name') {
                tmp[form_data[i].name] = form_data[i].value;
            } else {
                tmp.data[form_data[i].name] = form_data[i].value;
            }
            
        }
        ht.graph.addAdjacence(current_node, tmp);
        ht.refresh(true);
        e.preventDefault();
    });
};
$(document).ready(function() {

});

(function() {
  var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();

var Log = {
  elem: false,
  write: function(text){
    if (!this.elem)
      this.elem = document.getElementById('log');
    this.elem.innerHTML = text;
    this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
  }
};


function init(data){
    var json = data;
    var infovis = document.getElementById('infovis');
    var w = infovis.offsetWidth - 50, h = infovis.offsetHeight - 50;
    
    //init Hypertree
    var ht = new $jit.Hypertree({
      //id of the visualization container
      injectInto: 'infovis',
      //canvas width and height
      width: w,
      height: h,
      //Change node and edge styles such as
      //color, width and dimensions.
      Node: {
          dim: 9,
          color: "#f00"
      },
      Edge: {
          lineWidth: 2,
          color: "#088"
      },
      onBeforeCompute: function(node){
          Log.write("centering");
      },
      //Attach event handlers and add text to the
      //labels. This method is only triggered on label
      //creation
      onCreateLabel: function(domElement, node){
          domElement.innerHTML = node.name;
          $jit.util.addEvent(domElement, 'click', function () {
              ht.onClick(node.id, {
                  onComplete: function() {
                      ht.controller.onComplete();
                  }
              });
          });
      },
      //Change node styles when labels are placed
      //or moved.
      onPlaceLabel: function(domElement, node){
          var style = domElement.style;
          style.display = '';
          style.cursor = 'pointer';
          if (node._depth <= 1) {
              style.fontSize = "0.8em";
              style.color = "#ddd";

          } else if(node._depth == 2){
              style.fontSize = "0.7em";
              style.color = "#555";

          } else {
              style.display = 'none';
          }

          var left = parseInt(style.left);
          var w = domElement.offsetWidth;
          style.left = (left - w / 2) + 'px';
      },
      
      onComplete: function(){
          Log.write("done");
          //Build the right column relations list.
          //This is done by collecting the information (stored in the data property) 
          //for all the nodes adjacent to the centered node.
          var node = ht.graph.getClosestNodeToOrigin("current");
          var html = "<h4>" + node.name + "</h4><b>Connections:</b>";
          html += "<ul>";
          node.eachAdjacency(function(adj){
              var child = adj.nodeTo;
              if (child.data) {
                  var rel = (child.data.band == node.name) ? child.data.relation : node.data.relation;
                  html += "<li>" + child.name + " " + "<div class=\"relation\">(relation: " + rel + ")</div></li>";
              }
          });
          html += "</ul>";
          $jit.id('inner-details').innerHTML = html;
      }
    });
    //load JSON data.
    ht.loadJSON(json);
    //compute positions and plot.
    ht.refresh();
    //end
    ht.controller.onComplete();
    return ht;
}
////////
var Tree = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot: "/api/tree/",
    schema: {
        name: 'Text',
        description: 'Text'
    }
});
var Trees = Backbone.Collection.extend({
    model: Tree,
    url: "/api/tree/"
});
var TreeInfoView = Backbone.Marionette.ItemView.extend({
    initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove);
    },
    template: "#tree-info-template",
    tagName: "div",
    events: {
        'click span#tree_remove': 'removeTree'
    },
    removeTree: function() {
        console.log('removing tree w/id:'+ this.model.get('_id'));
        this.model.destroy();
    }
});
////////
//*
MyApp.addRegions({
    left_pane: "#left-container.tree",
    tree_graph: "#center-container.tree",
    tree_details: "#right-container.tree"
    //, log: "#log"
});
var setup_group_modal_view = function(app, groups_coll) {
    var gModalView = new GroupModalView({});
    gModalView.group_collection = groups_coll;
    app.group_add_modal.show(gModalView);
    var group_create_form = new Backbone.Form({
        model: new Group({}),
        idPrefix: 'group-'
    }).render();
    gModalView.group_form = group_create_form;
    $('div#group-modal-form.modal-body').append(group_create_form.el);

};
var group_success = function group_success(groups_coll, response, options) {
    groups_coll.each(function(group){
        var bmarks = new Bookmarks();
        bmarks.fetch({
            data: $.param({group_id: group.get('_id')})
        });
        group.set('bookmarks', bmarks);
    });
    var gCollectionView = new GroupsView({
        collection: groups_coll
    });
    MyApp.group_layout.show(gCollectionView);

    gCollectionView.children.each(function(group_layout_view) {
        renderGroupLayout(group_layout_view);
    });
    setup_group_modal_view(MyApp, groups_coll);
};
var tree_success = function() {
    console.log('authed, init the tree!');
    open_the_gate();
};
//*/
MyApp.addInitializer(function(options){
    //var signupView = new SignupView();
    //var groups = new Groups();
    MyApp.vent.on("login:success", function(user_model) {
        tree_success();
        // TODO manage header bar links with a layout
/*
        groups.fetch({
            success: group_success
        });
//*/
    });

    MyApp.vent.on("logout:click", function(user_model) {
        //groups.reset();
        //MyApp.group_layout.show(signupView);
        //MyApp.group_add_modal.close();
    });

    //MyApp.group_layout.show(signupView);
});

MyApp.start();