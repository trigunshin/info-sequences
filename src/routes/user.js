var dbmux;
exports.set_dbmux = function(a_dbmux) {
    dbmux = a_dbmux;
};

exports.list = function(req, res) {
    //TODO scope this to a user id, from session or otherwise
    //var query = {user_id: req.query.user_id};
    var query = {};
    dbmux.users.get(query, function(err, user) {
        if(err) throw err;
        else res.json(user);
    });
};

exports.get = function(req, res) {
    var query = {_id: req.param('_id')};
    dbmux.users.get(query, function(err, user) {
        if(err) throw err;
        else res.json(user);
    });
};

exports.post = function(req, res) {
    dbmux.users.save(req.body, function(err, updated) {
        if(err) throw err;
        res.json(updated[0]);
    });
};

exports.put = function(req, res) {
    var query = {_id: req.param('_id')};
    dbmux.users.findAndUpdate(
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
    dbmux.users.remove(
        query,
        function(err, removed) {
            res.json();
        }
    );
};