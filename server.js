var http = require('http'),
  weekly = require('./lib/weekly'),
  config = require('./config/config'),
  dgram = require('dgram'),
  sserver = require('node-static'),
  sio = require('socket.io'),
  mongo = require('mongodb'),
  Hummingbird = require('./lib/hummingbird').Hummingbird;

//console.log(process.env);
console.log(config);
if(config.enable_tracking && config.enable_tracking != 'false') {

    //Initializing mongo object
    db = new mongo.Db(config.mongo_db, new mongo.Server(config.mongo_host, config.mongo_port, {}), {});

    db.addListener("error", function(error) {
      console.log("Error connecting to mongo -- perhaps it isn't running?");
    });

    //Run Server to start tracking
    db.open(function(p_db) {

    db.authenticate(config.mongo_user, config.mongo_pass, function(err, db) {
      console.log(err, db);
    });
      var hummingbird = new Hummingbird();
      hummingbird.init(db, function() {
        var server = http.createServer(function(req, res) {
          try {
            hummingbird.serveRequest(req, res);
          } catch(e) {
            hummingbird.handleError(req, res, e);
          }
        });
        server.listen(config.tracking_port, config.tracking_ip);

        io = sio.listen(server);
        io.set('log level', config.log_level);
        io.set('transports', config.transports);

        hummingbird.io = io;
        hummingbird.addAllMetrics(io, db);

        console.log('Web Socket server running at ws://*:' + config.tracking_port);

        if(config.udp_address) {
          var udpServer = dgram.createSocket("udp4");

          udpServer.on("message", function(message, rinfo) {
            console.log("message from " + rinfo.address + " : " + rinfo.port);

            var data = JSON.parse(message);
            hummingbird.insertData(data);
          });

          udpServer.bind(config.udp_port, config.udp_address);

          console.log('UDP server running on UDP port ' + config.udp_port);
        }
      });

      console.log('Tracking server running at http://*:' + config.tracking_port + '/tracking_pixel.gif');
    });
}
//Run Server to show Dashboard
if(config.enable_dashboard && config.enable_dashboard != 'false') {
  var file = new(sserver.Server)('./public');

  http.createServer(function (request, response) {
    request.addListener('end', function () {
      file.serve(request, response);
    });
  }).listen(config.dashboard_port);

  console.log('Dashboard server running at http://*:' + config.dashboard_port);
}
