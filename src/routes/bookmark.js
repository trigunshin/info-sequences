var dbmux;
exports.set_dbmux = function(a_dbmux) {
    dbmux = a_dbmux;
};

exports.list = function(req, res) {
    // TODO scope this to a user id, from session or otherwise
    // TODO using cookie sessions for 'api call' is a bit weird
    var query = {
        // TODO determine behavior if group_id not present
        group_id: req.param('group_id'),
        email: req.session.email
    };
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
    var toSave = req.body;
    toSave.email = req.session.email;
    dbmux.bookmarks.save(toSave, function(err, updated) {
        if(err) throw err;
        res.json(updated[0]);
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