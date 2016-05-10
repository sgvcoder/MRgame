// app/models/user.js
var configDB = require('./config/database.js').DB;

var User = configDB.Model.extend({
   tableName: 'users',
   idAttribute: 'id',
});

module.exports = {
   User: User
};
