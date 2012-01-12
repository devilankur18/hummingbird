var mongo = false;
var e = process.env;
try{
    if(e.VCAP_SERVICES && e.VCAP_SERVICES.length > 0){
     var services = JSON.parse(e.VCAP_SERVICES);
      mongo = services['mongodb-1.8'][0]['credentials'];
    }
} catch (e) {
    console.log('No mongo database defined');
}
  mongo = mongo || {"hostname":"localhost","port":27017,"username":"","password":"","name":"","db":"shareaholic"}

var port = false;
var dport = false;
port = e.VCAP_APP_PORT;
dport = e.VCAP_APP_PORT;

module.exports = config = {
  "name" : "Hummingbird",
  
  //IP,Port to accept the incoming tracking requests
  "tracking_ip" : "0.0.0.0",
  "tracking_port" : port || 8000,
  
  //Port to show the dashboard
  "dashboard_port" : dport || 8080,
  
  //Config for running socket.io UDP server
  "udp_address" : "127.0.0.1",
  "udp_port" : port || 8080,
  
  //Mongo Database configuration
  "mongo_host" : mongo.hostname,
  "mongo_port" : mongo.port,
  "mongo_db"   : mongo.db,
  "mongo_user" : mongo.username,
  "mongo_pass" : mongo.password,

  "enable_dashboard" : true,
  "enable_tracking" : false,

  //Logging Level
  "log_level" : 2,

  "capistrano" : {
    "repository" :       "git://github.com/devilankur18/hummingbird.git",
    "hummingbird_host" : "hummingbird.your-host.com"
  }
}


