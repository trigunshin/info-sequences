var bookmarks = {
    1: {id:1,url:'http://www.google.com'},
    2: {id:2,url:'http://news.ycombinator.com'},
    3: {id:3,url:'http://www.reddit.com'},
    4: {id:4,url:'http://www.reddit.com/r/cats'}
};

exports.list = function(req, res){
    res.json([
        {"field":"demo_bookmark", 'id': 1},
        {"field":"demo_bookmark", 'id': 2}
    ]);
};

exports.get = function(req, res){
    res.json({"field":"demo_bookmark", id: req.query.id});
};

exports.post = function(req, res){
    res.json({"field":"demo_bookmark", id: req.query.id});
};

exports.put = function(req, res){
    res.json({"field":"demo_bookmark", id: req.query.id});
};

exports.delete = function(req, res){
  res.json();
};