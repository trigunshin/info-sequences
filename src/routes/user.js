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

exports.login = function(req, res, next) {
    var query = {
        email: req.param('email'),
        pass: req.param('password')
    };
    console.log(query);
    dbmux.users.get(query, function(err, user) {
        if(err) return next(err);
        else if(query.email==='a')
            return next(new Error("fake error"));
        else {
            var ret = {
                'email': user.email
            };
            return res.json(ret);
        }
    });
};

exports.signup_post = function(req, res) {
    var email = req.body['email'];
    var pass = req.body['password'];
    var pass_conf = req.body['password_confirm'];
    try {
        if(pass==pass_conf) {
            dbmux.users.getPassHash(pass, function(err, hash) {
                if(err) {return next(err);}
                else {
                    var query = {email: email};
                    dbmux.users.get(query, function(err, userResult) {
                        if(err) {return next(err);}
                        else if(userResult && userResult.length > 0) {
                            throw Error("Email already exists. Please try another one or login.");
                        } else {
                            var userToSave = {'email':email, 'password':hash, 'createdOn':new Date()};
                            dbmux.users.save(userToSave, function(err, saved_user) {
                                if(err) {return next(err);}
                                else {
                                    req.session.name=email;
                                    req.session.auth=true;
                                    res.json({'email': email});
                                }
                            });
                        }
                    });
                }
            });
        } else {
            return next(new Error("User passwords did not match!"));
        }
    } catch (e) {
        console.log(e.message);
        signupGet(req, res);
    }
};