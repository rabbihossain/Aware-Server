/**
 * Data.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    phone_id: {
      type: "string"
    },
    package_name: {
      type: "string"
    },
    permission: {
      type: "string"
    },
    timestamp: {
      type: "string"
    },
    gps: {
      type: "string"
    }
  },
};
