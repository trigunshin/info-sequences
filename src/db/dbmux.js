var Db = require('mongodb').Db,
  MongoClient = require('mongodb').MongoClient;
  Server = require('mongodb').Server;
var SERVER = process.env.MONGO_HOST || process.env.MONGOLAB_URI || "localhost",
    PORT = process.env.MONGO_PORT || 27017;
// FIXME this will look funny when using mongolab
console.log("DBMux connecting to mongo @ host&port:"+SERVER+":"+PORT);
var stdlib = require("../stdlib").stdlib;
var redisClient;

var getConnection = function (collectionName, databaseName) {
	var cache = {};
	var key = collectionName+"___"+databaseName;
	return function(cb) {
		if(cache[key]) return cb(null, cache[key]);

        var mongo_url = null;
        if(process.env.MONGOLAB_URI) {
            mongo_url = process.env.MONGOLAB_URI;
        } else {
            mongo_url = 'mongodb://' + SERVER + ":" + PORT + "/" + databaseName;
        }

        MongoClient.connect(mongo_url, stdlib.errorClosure(cb, function(openedDB) {
			openedDB.collection(collectionName, stdlib.errorClosure(cb, function(opened) {
				cb(null, cache[key] = opened);
			}));
		}));
	};
};

var files = ['users', 'groups', 'bookmarks', 'tree'];
var perDBFile = function(applyToSubclass) {
    for(var i=0,iLen=files.length;i<iLen;i++) {
        var curName = files[i];
        var curObj = exports[curName] || require("./"+curName);//don't require() repeatedly
        applyToSubclass(curObj, curName);
    }
};

/*helper functions to run through the perDBFile() method on each file*/
var loadFiles = function(curObj, curName) {
    curObj.setCollectionAccessor(getConnection);
    exports[curName] = curObj;
};
var setSubclassRedis = function(curObj) {
    curObj.setRedis(redisClient);
};
var setSubclassStdlib = function(curObj) {
    curObj.setStdlib(stdlib);
};

function setRedisClient(aRedis) {
    redisClient = aRedis;
    perDBFile(setSubclassRedis);
}

perDBFile(loadFiles);
perDBFile(setSubclassStdlib);

exports.setRedisClient = setRedisClient;
