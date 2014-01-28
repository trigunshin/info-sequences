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
    var query = {email: req.param('email')},
        userPass = req.param('password');
    dbmux.users.get(query, function(err, user) {
        if(err) return next(err);
        else if(!user) {
          return next(new Error("Username/password combination not found."));
        }
        else {
          dbmux.users.comparePass(userPass, user['password'], function(err, pwResult) {
            if(err) return next(err);
            else if(pwResult) {
                var ret = {
                    'email': user.email
                };
                req.session.email = user.email;
                req.session.auth = true;
                return res.json(ret);
            } else {
                return next(new Error("Username/password combination not found."));
            }
          });
        }
    });
};

exports.signup_post = function(req, res, next) {
    var email = req.body['email'];
    var pass = req.body['password'];
    var pass_conf = req.body['password_confirm'];
    try {
        if(pass==pass_conf) {
            dbmux.users.getPassHash(pass, function(err, hash) {
                if(err) {return next(err);}
                else {
                    var query = {email: email};
                    //console.log('signup post dupe query:'+JSON.stringify(query));
                    dbmux.users.get(query, function(err, userResult) {
                        if(err) {return next(err);}
                        else if(userResult && (userResult.length > 0 || userResult.email)) {
                            return next(new Error("Email already exists. Please try another one or login."));
                        } else {
                            //console.log('signup post query result:'+JSON.stringify(userResult));
                            if(userResult.email) {
                            //    console.log('email ducktyped to true');
                            }
                            //console.log('signup post query result?:'+(userResult.email));
                            //console.log('signup post query result.len:'+(userResult.length));
                            var userToSave = {'email':email, 'password':hash, 'createdOn':new Date()};
                            dbmux.users.save(userToSave, function(err, saved_user) {
                                if(err) {return next(err);}
                                else {
                                    req.session.email=email;
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

exports.whoami = function(req, res) {
    res.json({email:req.session.email});
};

exports.logout = function(req, res) {
    req.session.destroy();
    res.json();
};
