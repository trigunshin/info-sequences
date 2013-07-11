var dbmux;
exports.set_dbmux = function(a_dbmux) {
    dbmux = a_dbmux;
};

exports.list = function(req, res) {
    //TODO scope this to a user id, from session or otherwise
    //var query = {user_id: req.query.user_id};
    var query = {};
    dbmux.groups.get(query, function(err, groups) {
        if(err) throw err;
        else res.json(groups);
    });
};

exports.get = function(req, res) {
    var query = {_id: req.param('_id')};
    dbmux.groups.get(query, function(err, group) {
        if(err) throw err;
        else res.json(group);
    });
};

exports.post = function(req, res) {
    dbmux.groups.save(req.body, function(err, updated) {
        if(err) throw err;
        res.json(updated);
    });
};

exports.put = function(req, res) {
    var query = {_id: req.param('_id')};
    dbmux.groups.findAndUpdate(
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
    dbmux.groups.remove(
        query,
        function(err, removed) {
            res.json();
        }
    );
};