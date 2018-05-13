/**
 * DataController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

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
        return res.json(data)
      }
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
  }
};
