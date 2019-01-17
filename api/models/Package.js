/**
 * Package.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    app_name: { type: 'string' },
    package_name: { type: 'string' },
    app_genre: { type: 'string' },
    app_icon: { type: 'string' },
    app_type: { type: 'string' },
    permissions: { type: 'string' },
    points: { type: 'string' },
  },
  
};

