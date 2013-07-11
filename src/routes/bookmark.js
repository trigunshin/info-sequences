var dbmux;
exports.set_dbmux = function(a_dbmux) {
    dbmux = a_dbmux;
};

exports.list = function(req, res) {
    //TODO scope this to a user id, from session or otherwise
    //var query = {user_id: req.query.user_id};
    var query = {};
    dbmux.bookmarks.get(query, function(err, bookmarks) {
        if(err) throw err;
        else res.json(bookmarks);
    });
};

exports.get = function(req, res) {
    var query = {_id: req.param('_id')};
    dbmux.bookmarks.get(query, function(err, bookmark) {
        if(err) throw err;
        else res.json(bookmark);
    });
};

exports.post = function(req, res) {
    dbmux.bookmarks.save(req.body, function(err, updated) {
        if(err) throw err;
        console.log("updated:"+JSON.stringify(updated[0]));
        res.json(updated);
    });
};

exports.put = function(req, res) {
    var query = {_id: req.param('_id')};
    dbmux.bookmarks.findAndUpdate(
        query,
        req.body,
        function(err, updated) {
            if(err) throw err;
            else res.json(updated);
        }
    );
};

exports.delete = function(req, res) {
    var query = {_id: req.param('_id')};
    dbmux.bookmarks.remove(
        query,
        function(err, removed) {
            res.json();
        }
    );
};