var dbmux;
exports.set_dbmux = function(a_dbmux) {
    dbmux = a_dbmux;
};

exports.list = function(req, res) {
    // TODO scope this to a user id, from session or otherwise
    // TODO using cookie sessions for 'api call' is a bit weird
    var query = {};
    query.email = req.session.email;
    dbmux.tree.get(query, function(err, groups) {
        if(err) throw err;
        else res.json(groups);
    });
};

exports.get = function(req, res) {
    var query = {'email': req.session.email};
    var my_id = req.param('_id');
    if(my_id) {
        query['_id'] = my_id;
    }
    dbmux.tree.get(query, function(err, group) {
        if(err) throw err;
        else res.json(group);
    });
};

exports.post = function(req, res) {
    var toSave = req.body.ht_data;
    toSave.email = req.session.email;
    dbmux.tree.save(toSave, function(err, updated) {
        if(err) throw err;
        res.json(updated[0]);
    });
};

exports.put = function(req, res) {
    var query = {'email': req.session.email};
    var my_id = req.param('_id');
    if(my_id) {
        query['_id'] = my_id;
    }
    dbmux.tree.findAndUpdate(
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
    dbmux.tree.remove(
        query,
        function(err, removed) {
            res.json();
        }
    );
};