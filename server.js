var app = require('http').createServer(handler);
var fs = require('fs');
var io = require('socket.io')(app);
var mc = require('mongodb').MongoClient;
var path = require('path');
var stream = require('stream');


app.listen( process.env.PORT || 9000);


function handler (request, response) {


    console.log('request ', request.url);

    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = './index.html';

    var extname = String(path.extname(filePath)).toLowerCase();
    var contentType = 'text/html';
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.svg': 'application/image/svg+xml'
    };

    contentType = mimeTypes[extname] || 'application/octect-stream';

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                response.end();
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });



}

// Connect to the db
// mc.connect("mongodb://localhost:27017/gamedata", function(err, db) {
//     if(!err) {
//         var collectiondata = [];
//         var prs = db.collection('prs');
//         prs.remove({});
//         var type;
//         for(i=0;i<100;i++){
//             if(i < 2){ id = "player"+i;}
//             else {id = 'drone'+(i-2);}
//             var doc = {id:id,gameid:12345,posx:0,posy:0,posx:0,rotx:0,roty:0,rotz:0};
//             collectiondata.push(doc);
//         }
//         prs.insert(collectiondata, {w:1}, function(err, result) {
//             if(err){console.log(err);}
//             if(result){  };
//         });
//     }
//     var allgd = db.collection('prs').find().stream();
//     allgd.on('data', function(gd) {
//         gdarr.push(gd)
//     });
//     allgd.on('end', function(){
//         console.log('done');

//        console.log(gdarr)
//     })


// });

 var player = 0;
 var gameUUID = 12345;
 var gdarr = [];


// // Connect to the db
mc.connect("mongodb://localhost:27017/gamedata", function(err, db) {
    if(!err) {
        var collectiondata = [];
        var prs = db.collection('prs');
        prs.remove({});
        var type;
        for(i=0;i<100;i++){
            if(i < 2){ id = "player"+i;}
            else {id = 'drone'+(i-2);}
            var doc = {id:id,gameid:12345,posx:0,posy:0,posx:0,rotx:0,roty:0,rotz:0};
            collectiondata.push(doc);
        }
        prs.insert(collectiondata, {w:1}, function(err, result) {
            if(err){console.log(err);}
            if(result){  };
        });
    }

    io.on('connection', function (socket) {
        socket.emit('gamestart', { id: gameUUID });
        socket.on('getgd', function(gameUUID){
            //console.log(gameUUID);
            var gdarr = [];
            var allgd = db.collection('prs').find().stream();
            allgd.on('data', function(gd) {
                gdarr.push(gd)
            });
            allgd.on('end', function(){
                //console.log('done');
                socket.emit('sgd', gdarr);

               // console.log(gdarr)
            })
        });
        socket.on('setgd', function (gd) {
           var prs = db.collection('prs');
           prs.remove({});
            prs.insert(gd, {w:1}, function(err, result) {
                if(err){console.log( 'error ' + err);}
                if(result){console.log('gd inserted');}
            });
        });
    });
});



