
/*
 * GET users listing.
 */

exports.list = function(req, res){
    res.json([
        {email:"trigunshin@gmail.com", id: 1, field: 'derp'},
        {field:"demo_text", id: 2},
        {field:"demo_text", id: 3},
        {field:"demo_text", id: 4}
    ]);
};

exports.get = function(req, res){
    res.json({"field":"demo_text", 'id': req.query.id});
};

exports.post = function(req, res){
    res.json({"field":"demo_text", id: req.query.id});
};

exports.put = function(req, res){
    res.json({"field":"demo_text", id: req.query.id});
};

exports.delete = function(req, res){
    res.json();
};