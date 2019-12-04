/**
 * DataController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const axios = require('axios');
const permissionPoints = {
  "RUN_IN_BACKGROUND" : 1,
  "WRITE_EXTERNAL_STORAGE": 2,
  "READ_EXTERNAL_STORAGE": 2,
  "READ_CALENDAR": 1,
  "OP_READ_PHONE_STATE": 1,
  "READ_CONTACTS": 3,
  "GET_ACCOUNTS": 1,
  "FINE_LOCATION": 2, 
  "WRITE_SETTINGS": 1,
  "MONITOR_LOCATION": 3,
  "POST_NOTIFICATION": 1,
  "VIBRATE": 0,
  "READ_CLIPBOARD": 3,
  "WRITE_SMS" : 1,
  "COARSE_LOCATION": 2,
  "WIFI_SCAN": 1,
  "MONITOR_HIGH_POWER_LOCATION": 3,
  "RECORD_AUDIO": 3,
  "TAKE_AUDIO_FOCUS": 3,
  "READ_CALL_LOG": 3,
  "MUTE_MICROPHONE": 3,
  "READ_SMS": 3,
  "WRITE_CALENDAR": 1,
  "RECEIVE_SMS": 2,
  "ADD_VOICEMAIL": 1,
  "WRITE_CALL_LOG": 2,
  "CALL_PHONE": 2,
  "PROCESS_OUTGOING_CALLS": 2,
  "SYSTEM_ALERT_WINDOW": 1,
  "CAMERA": 3,
  "AUDIO_MEDIA_VOLUME": 1,
  "USE_FINGERPRINT": 3,
  "TURN_ON_SCREEN": 1,
  "WAKE_LOCK": 1
}
module.exports = {
  addData: function (req, res) {
    Data.findOrCreate({
      'phone_id': req.body.PhoneID,
      'package_name': req.body.Package,
      'permission': req.body.Permission,
      'timestamp': req.body.Timestamp,
      "gps": req.body.GPS
    }, {
      'phone_id': req.body.PhoneID,
      'package_name': req.body.Package,
      'permission': req.body.Permission,
      'timestamp': req.body.Timestamp,
      "gps": req.body.GPS
    }).exec(function (err, data) {
      if (err) {
        return res.status(500).send('error');
      } else {
        return res.status(200).send('success');
      }
    });
  },
  allData: function (req, res) {
    Data.find().exec(function (err, data) {
      if (err) {
        return res.send(err);
      } else {
        return res.json(data);
      }
    });
  },
  getPlay: function (req, res) {
      Package.findOne({package_name: req.query.package}).exec(function (err, data) {
      if (err) {
        console.log(err);
        return res.send(err);
      } else {
        if(data) {
          return res.json(data);
        } else {
          axios({
            method:'get',
            url: "https://api.appmonsta.com/v1/stores/android/details/" + req.query.package + ".json?country=US",
            auth: {
            username: '649ec7a80d107b33364efd2b36d9cc132725c8d8',
            password: 'X'
            },
          })
          .then(response => {
            Package.findOrCreate({
              package_name: req.query.package,
            },{
              app_name: response.data.app_name,
              package_name: req.query.package,
              app_genre: response.data.genres[0].split(" ")[0],
              app_type: response.data.app_type,
              app_icon: response.data.icon_url,
            }).exec(function(err, data) {
              if(err){
                console.log(err);
              } else {
                res.json(data);
              }
            });
          })
          .catch(error => {
            sails.log(error);
            res.send("not found");
          });
        }
      }
    });
  },
  home: function (req, res) {
    res.redirect('/categories');
  },

  appStore: async function(req,res){
    if(req.query.search){
      var filter = {
        app_name: {"contains": req.query.search}
      }
    }
    else if(req.query.category) {
      var filter = {
        app_genre: req.query.category
      }
    }  else {
      var filter = {}
    }
    var catSQL = 'SELECT DISTINCT app_genre FROM package';
    var rawData = await sails.sendNativeQuery(catSQL);
    var catData = rawData["rows"].map(a => a.app_genre);
    Package.find(filter).paginate(req.query.page ? req.query.page - 1 : 0 , 12).exec(function(err, data){
      if(err) {
        res.send(err);
      } else {
        return res.view("pages/appstore", {
          categories: catData,
          appData: data,
          paginator: {
            category: req.query.category ? req.query.category : false,
            search: req.query.search ? req.query.search : false,
            page: req.query.page ? req.query.page : 1
          }
        });
        
      }
    });
  },

  categoryPage: function(req, res){
    return res.view("pages/categories");
  },
  appSingle: function(req, res) {
    if(req.query.deviceId){
      Data.find({ package_name: req.query.app, phone_id: req.query.deviceId }).exec(function (err, data) {
        if (err) {
          return res.send(err);
        } else {
          return res.json(data);
        }
      });
    } else {
      Data.find({ package_name: req.query.app }).exec(function (err, data) {
        if (err) {
          return res.send(err);
        } else {
          return res.json(data);
        }
      });
    }

  },
  categoryData: function(req, res) {
    if(req.body.deviceId){
      Data.find({ package_name: req.body.apps.split("||"), phone_id: req.body.deviceId }).exec(function (err, data) {
        if (err) {
          return res.send(err);
        } else {
          return res.json(data);
        }
      });
    } else {
      Data.find({ package_name: req.body.apps.split("||") }).exec(function (err, data) {
        if (err) {
          return res.send(err);
        } else {
          return res.json(data);
        }
      });
    }
    
  },
  permissionData: function(req, res) {
    if(req.body.deviceId){
      Data.find({ permission: req.body.permission, phone_id: req.body.deviceId }).exec(function (err, data) {
        if (err) {
          return res.send(err);
        } else {
          return res.json(data);
        }
      });
    } else {
      Data.find({ permission: req.body.permission }).exec(function (err, data) {
        if (err) {
          return res.send(err);
        } else {
          return res.json(data);
        }
      });
    }
    
  },
  packageList: async function(req,res){
    if(req.query.deviceId){
      var SQL = 'SELECT DISTINCT package_name, permission, phone_id FROM data WHERE phone_id=' + req.query.deviceId;    
    } else {
      var SQL = 'SELECT DISTINCT package_name, permission, phone_id FROM data';      
    }
    var rawData = await sails.sendNativeQuery(SQL);
    var data = rawData["rows"];
    sails.log("Data Length -" + data.length);
    var packageNames = [];
    var permissionNames = [];
    var phoneIds = [];
    for(i = 0; i < data.length; i++){
      
      if(!packageNames.includes(data[i].package_name)){
        packageNames.push(data[i].package_name);
      }
      if(!permissionNames.includes(data[i].permission)){
        permissionNames.push(data[i].permission);
      }
      if(!phoneIds.includes(data[i].phone_id)){
        phoneIds.push(data[i].phone_id);
      }  
      
    }
    return res.json({packageList: packageNames, permissionList: permissionNames, deviceList: phoneIds}); 
 
  },
  syncPermissionData: function(req, res){
    Package.find().exec(function(err, data) {
      if(err) {
        return res.send(err);
      } else {

        data.forEach(async function(app) {
          var SQL = "SELECT DISTINCT permission FROM data WHERE package_name='" + app.package_name + "'";
          var rawdata = await sails.sendNativeQuery(SQL);
             
          var PermissionsArr = [];
          var points = 0;
          
          rawdata["rows"].forEach(function(perm) {
            if(!PermissionsArr.includes(perm.permission)){
              PermissionsArr.push(perm.permission);
              points = points + permissionPoints[perm.permission];
            }
          });
          await Package.updateOne({ package_name: app.package_name }).set({ permissions: PermissionsArr.join(","), points: points });
          
        });
        return res.send(data);
      }
    });
  },
  loginPage: function (req, res) {
    if(req.session.isLoggedIn){
      return res.redirect("/");
    }
    return res.view("pages/login");
  },
  loginAction: function (req, res) {
    var username = sails.config.security.adminUserForLogin;
    var password = sails.config.security.adminPassForLogin;
    if(username == req.body.username && password == req.body.password){
      req.session.isLoggedIn = true;
      return res.redirect("/categories");
    } else {
      return res.send("Wrong username or password. Go back and try again.");
    }
  },
  logout: function (req, res) {
    req.session.isLoggedIn = false;
    return res.redirect("/login");
  }
};
