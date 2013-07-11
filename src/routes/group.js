var groupIds = [1,2];
var groups = {
    1: {"name": "generic_group",
        'id': 1,
        bookmarks: [
            {id:1,url:'http://www.google.com'},
            {id:2,url:'http://news.ycombinator.com'}
        ]
       },
    2: {"name": "cats",
       'id': 2,
       bookmarks: [
           {id:3,url:'http://www.reddit.com'},
           {id:4,url:'http://www.reddit.com/r/cats'}
       ]
      }
};

exports.list = function(req, res){
    var ret = [];
    for(var i=0,iLen=groupIds.length;i<iLen;i++) {
        ret.push(groups[groupIds[i]]);
    }
    console.log(JSON.stringify(ret));
    res.json(ret);
};

exports.get = function(req, res){
    res.json({"field":"demo_group", id: req.query.id});
};

exports.post = function(req, res){
    res.json({"field":"demo_group", id: req.query.id});
};

exports.put = function(req, res){
    res.json({"field":"demo_group", id: req.query.id});
};

exports.delete = function(req, res){
  res.json();
};