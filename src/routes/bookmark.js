var dbmux;
exports.set_dbmux = function(a_dbmux) {
    dbmux = a_dbmux;
};

exports.list = function(req, res){
    var query = {};
    dbmux.bookmarks.get(query, function(err, bookmarks) {
        if(err) throw err;
        else res.json(bookmarks);
    });
};

exports.get = function(req, res) {
    var query = {_id: req.query._id};
    dbmux.bookmarks.get(query, function(err, bookmark) {
        if(err) throw err;
        else res.json(bookmark);
    });
};

exports.post = function(req, res){
    res.json({"field":"demo_bookmark", _id: req.query._id});
};

exports.put = function(req, res){
    //TODO create group
    //var group = {?};
    dbmux.bookmarks.save(bookmark, function(err, updated) {
        if(err) throw err;
        else res.json(updated);
    });
};

exports.delete = function(req, res){
  res.json();
};