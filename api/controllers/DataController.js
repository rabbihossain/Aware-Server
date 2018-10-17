/**
 * DataController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const axios = require('axios');

module.exports = {
  addData: function (req, res) {
    var object = JSON.parse(req.body.data);
    Data.create({
      'phone_id': object.PhoneID,
      'package_name': object.Package,
      'permission': object.Permission,
      'timestamp': object.Timestamp,
      "gps": object.GPS
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
    axios.get('https://play.google.com/store/apps/details?id=' + req.query.package)
      .then(response => {
        res.send(response.data);
      })
      .catch(error => {
        res.send("not found");
      });
  },
  home: function (req, res) {
    Data.find().exec(function (err, data) {
      if (err) {
        return res.send(err);
      } else {
        var permissionBubble = {};
        data.forEach(function (each) {
          dateString = new Date(each.timestamp).toDateString().split(" ").join("_");
          if (permissionBubble[dateString]) {
            if (permissionBubble[dateString].permissions) {
              if (permissionBubble[dateString].permissions[each.permission]) {
                if (!permissionBubble[dateString].permissions[each.permission].apps.includes(each.package_name)) {
                  permissionBubble[dateString].permissions[each.permission].apps.push(each.package_name);
                }
                permissionBubble[dateString].permissions[each.permission].count = (permissionBubble[dateString].permissions[each.permission].count + 1);
              } else {
                permissionBubble[dateString].permissions[each.permission] = {};
                permissionBubble[dateString].permissions[each.permission].apps = [];
                permissionBubble[dateString].permissions[each.permission].apps.push(each.package_name);
                permissionBubble[dateString].permissions[each.permission].count = 1;
              }
            } else {
              permissionBubble[dateString].permissions = {};
              permissionBubble[dateString].permissions[each.permission] = {};
              permissionBubble[dateString].permissions[each.permission].apps = [];
              permissionBubble[dateString].permissions[each.permission].apps.push(each.package_name);
              permissionBubble[dateString].permissions[each.permission].count = 1;

            }
          } else {
            permissionBubble[dateString] = {};
            permissionBubble[dateString].permissions = {};
            permissionBubble[dateString].permissions[each.permission] = {};
            permissionBubble[dateString].permissions[each.permission].apps = [];
            permissionBubble[dateString].permissions[each.permission].apps.push(each.package_name);
            permissionBubble[dateString].permissions[each.permission].count = 1;
          }
        });

        var AppBubble = {};
        data.forEach(function (each) {
          dateString = new Date(each.timestamp).toDateString().split(" ").join("_");
          if (AppBubble[dateString]) {
            if (AppBubble[dateString].package) {
              if (AppBubble[dateString].package[each.package_name]) {
                if (!AppBubble[dateString].package[each.package_name].permissions.includes(each.permission)) {
                  AppBubble[dateString].package[each.package_name].permissions.push(each.permission);
                }
                AppBubble[dateString].package[each.package_name].count = (AppBubble[dateString].package[each.package_name].count + 1);
              } else {
                AppBubble[dateString].package[each.package_name] = {};
                AppBubble[dateString].package[each.package_name].permissions = [];
                AppBubble[dateString].package[each.package_name].permissions.push(each.permission);
                AppBubble[dateString].package[each.package_name].count = 1;
              }
            } else {
              AppBubble[dateString].package = {};
              AppBubble[dateString].package[each.package_name] = {};
              AppBubble[dateString].package[each.package_name].permissions = [];
              AppBubble[dateString].package[each.package_name].permissions.push(each.permission);
              AppBubble[dateString].package[each.package_name].count = 1;

            }
          } else {
            AppBubble[dateString] = {};
            AppBubble[dateString].package = {};
            AppBubble[dateString].package[each.package_name] = {};
            AppBubble[dateString].package[each.package_name].permissions = [];
            AppBubble[dateString].package[each.package_name].permissions.push(each.permission);
            AppBubble[dateString].package[each.package_name].count = 1;
          }
        });

        return res.view("pages/homepage", {
          AppBubble: AppBubble,
          permissionBubble: permissionBubble
        });
      }
    });
  },
  categoryPage: function(req, res){
    return res.view("pages/categories");
  },
  appSingle: function(req, res) {
    Data.find({ package_name: req.query.app }).exec(function (err, data) {
      if (err) {
        return res.send(err);
      } else {
        return res.json(data);
      }
    });
  },
  categoryData: function(req, res) {
    Data.find({ package_name: req.body.apps.split("||") }).exec(function (err, data) {
      if (err) {
        return res.send(err);
      } else {
        return res.json(data);
      }
    });
  },
  permissionData: function(req, res) {
    Data.find({ permission: req.body.permission }).exec(function (err, data) {
      if (err) {
        return res.send(err);
      } else {
        return res.json(data);
      }
    });
  },
  packageList: function(req,res){
    Data.find().exec(function (err, data) {
      if (err) {
        return res.send(err);
      } else {
        var packageNames = [];
        var permissionNames = [];

        for(i = 0; i < data.length; i++){
          
          if(!packageNames.includes(data[i].package_name)){
            packageNames.push(data[i].package_name);
          }

          if(!permissionNames.includes(data[i].permission)){
            permissionNames.push(data[i].permission);
          }

        }

        return res.json({packageList: packageNames, permissionList: permissionNames});
      }
    });
  }
};
