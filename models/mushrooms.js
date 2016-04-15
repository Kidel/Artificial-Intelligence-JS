var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mushroomsSchema = new Schema({ any: Schema.Types.Mixed }, { collection : 'mushrooms' });

mongoose.model('mushrooms', mushroomsSchema);