var BSON = require('mongodb').BSONPure;
var COLL = "tree", DB="info_sequences";
var getCollection = null;
var stdlib;
var redisClient;

function setStdlib(aStdlib) {
    stdlib = aStdlib;
}

function setRedis(aRedis) {
    redisClient = aRedis;
}

function setCollectionAccessor(getColl) {
    getCollection = getColl(COLL, DB);
}

var get = function(query, callback) {
    getCollection(function(err, collection) {
        if(err) return callback(err);
        if(query._id) query._id = new BSON.ObjectID(query._id);
        collection.find(query, {}, function(err, results) {
            if(err) return callback(err);
            results.toArray(function(err, items) {
                if(err) return callback(err);
                callback(null, items);
            });
        });
    });
};

var save = function(data, callback) {
    getCollection(function(err, collection) {
        if(err) return callback(err);
        collection.insert(data, function(err,  result) {
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
            {"$set": fields},
            {"new": true, "upsert": true},
            function(err, result) {
                if(err) return callback(err);
                return callback(null, result);
            });
    });
};

exports.setCollectionAccessor = setCollectionAccessor;
exports.get = get;
exports.save = save;
exports.findAndUpdate = findAndUpdate;
exports.setStdlib = setStdlib;
exports.setRedis = setRedis;