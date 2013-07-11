var BSON = require('mongodb').BSONPure;
var COLL = "bookmarks", DB="info_sequences";
var getCollection = null;
var stdlib;
var redisClient;

function setStdlib(aStdlib) {
    stdlib = aStdlib;
};

function setRedis(aRedis) {
    redisClient = aRedis;
};

function setCollectionAccessor(getColl) {
    getCollection = getColl(COLL, DB);
};

var get = function(query, callback) {
    getCollection(function(err, collection) {
        if(err) return callback(err);
        if(query._id) query._id = new BSON.ObjectID(query._id);
        if(query.group_id) query.group_id = new BSON.ObjectID(query.group_id);
        collection.find(query, {}, function(err, results) {
            if(err) return callback(err);
            results.toArray(function(err, items) {
                if(err) return callback(err);
                callback(null, items);
            });
        });
    });
};

var save = function(bookmark, callback) {
    getCollection(function(err, collection) {
        if(err) return callback(err);
        collection.insert(bookmark, function(err,  result) {
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

exports.setCollectionAccessor = setCollectionAccessor;
exports.get = get;
exports.save = save;
exports.findAndUpdate = findAndUpdate;
exports.setStdlib = setStdlib;
exports.setRedis = setRedis;
