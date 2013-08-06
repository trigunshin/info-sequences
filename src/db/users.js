var bcrypt = require('bcrypt');
var BSON = require('mongodb').BSONPure;
var COLL = "users", DB="info_sequences";
var getCollection = null;
var stdlib;
var redisClient;

exports.setStdlib = function setStdlib(aStdlib) {
    stdlib = aStdlib;
};

exports.setRedis = function setRedis(aRedis) {
    redisClient = aRedis;
};

exports.setCollectionAccessor = function setCollectionAccessor(getColl) {
    getCollection = getColl(COLL, DB);
};

var get = function(query, callback) {
    getCollection(function(err, collection) {
        if(err) return callback(err);
        if(query._id) query._id = new BSON.ObjectID(query._id);
        collection.findOne(query, {}, function(err, result) {
            if(err) return callback(err);
            return callback(null, result);
        });
    });
};

var save = function(group, callback) {
    getCollection(function(err, collection) {
        if(err) return callback(err);
        collection.insert(group, function(err, result) {
            if(err) return callback(err);
            callback(null, result);
        });
    });
};

var findAndUpdate = function(query, fields, callback) {
    getCollection(function(err, collection) {
        if(err) return callback(err);
        if(query._id) query._id = new BSON.ObjectID(query._id);
        collection.findAndModify(
            query,
            [],
            {"$set":fields},
            {"new":true},
            function(err, result) {
                if(err) return callback(err);
                return callback(null, result);
            });
    });
};

exports.remove = function(query, callback) {
    getCollection(function(err, collection) {
        if(err) return callback(err);
        if(query._id) query._id = new BSON.ObjectID(query._id);
        collection.remove(query, function(err,  result) {
            if(err) return callback(err);
            callback(null, result);
        });
    });
};

exports.getPassHash = function(pass, callback) {
    bcrypt.genSalt(11, stdlib.errorClosure(callback, function(salt) {
        bcrypt.hash(pass, salt, callback);
    }));
};

exports.comparePass = function(submitted, dbPass, callback) {
    bcrypt.compare(submitted, dbPass, stdlib.errorClosure(callback, function(res) {
        callback(null, res);
    }));
};

exports.get = get;
exports.save = save;
exports.findAndUpdate = findAndUpdate;