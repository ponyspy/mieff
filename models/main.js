var mongoose = require('mongoose'),
		mongooseLocale = require('mongoose-locale'),
		mongooseBcrypt = require('mongoose-bcrypt');

var Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/' +  __app_name, {
	useUnifiedTopology: true,
	useCreateIndex: true,
	useNewUrlParser: true
});


// ------------------------
// *** Schema Block ***
// ------------------------


var userSchema = new Schema({
	login: String,
	password: String,
	email: String,
	status: String,
	date: {type: Date, default: Date.now},
});

var eventSchema = new Schema({
	title: { type: String, trim: true, locale: true },
	s_title: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	intro: { type: String, trim: true, locale: true },
	marker: { type: String, trim: true, locale: true },
	type: String,
	events: [{ type: ObjectId, ref: 'Event' }],
	program: { type: ObjectId, ref: 'Program' },
	age: Number,
	poster: { type: String },
	cover: { type: String },
	sym: { type: String, trim: true, index: true, unique: true, sparse: true },
	video: {
		provider: String,
		id: String
	},
	schedule: [{
		date: Date,
		link: String,
		options: String,
		place: { type: ObjectId, ref: 'Place' },
		free: Boolean
	}],
	members: [{
		title: { type: String, trim: true, locale: true },
		description: { type: String, trim: true, locale: true },
		list: [{ type: ObjectId, ref: 'Member' }],
	}],
	partners: [{ type: ObjectId, ref: 'Partner' }],
	images: [{
		description: { type: String, trim: true, locale: true },
		original: { type: String },
		thumb: { type: String },
		preview: { type: String }
	}],
	status: String,
	_short_id: { type: String, unique: true, index: true, sparse: true },
	date: { type: Date, default: Date.now },
});

programSchema = new Schema({
	title: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	poster: String,
	cover: String,
	partners: [{ type: ObjectId, ref: 'Partner' }],
	members: [{ type: ObjectId, ref: 'Member' }],
	sym: { type: String, trim: true, index: true, unique: true, sparse: true },
	status: String,
	_short_id: { type: String, unique: true, index: true, sparse: true },
	date: { type: Date, default: Date.now },
});

placeSchema = new Schema({
	title: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	status: String,
	_short_id: { type: String, unique: true, index: true, sparse: true },
	date: { type: Date, default: Date.now },
});

var memberSchema = new Schema({
	name: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	sex: String,
	photo: { type: String },
	photo_preview: { type: String },
	roles: [{ type: String }],  // actor, director...
	status: String,
	_short_id: { type: String, unique: true, index: true, sparse: true },
	date: { type: Date, default: Date.now },
});

partnerSchema = new Schema({
	title: { type: String, trim: true, locale: true },
	link: String,
	type: String,
	logo: String,
	status: String,
	_short_id: { type: String, unique: true, index: true, sparse: true },
	date: { type: Date, default: Date.now },
});

postSchema = new Schema({
	title: { type: String, trim: true, locale: true },
	s_title: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	poster: String,
	cover: String,
	sym: { type: String, trim: true, index: true, unique: true, sparse: true },
	status: String,
	_short_id: { type: String, unique: true, index: true, sparse: true },
	date: { type: Date, default: Date.now },
});


// ------------------------
// *** Index Block ***
// ------------------------


eventSchema.index({'schedule.date': -1});
eventSchema.index({'members.list': 1});
eventSchema.index({'title.value': 'text', 's_title.value': 'text', 'description.value': 'text'}, {
	weights: {'description.value': 2, 's_title.value': 3, 'title.value': 5},
	language_override: 'lg', default_language: 'ru'
});
memberSchema.index({'name.value': 'text', 'description.value': 'text'}, {
	weights: {'name.value': 5, 'description.value': 2},
	language_override: 'lg', default_language: 'ru'
});
postSchema.index({'title.value': 'text', 's_title.value': 'text', 'description.value': 'text'}, {
	weights: {'description.value': 2, 's_title.value': 3, 'title.value': 5},
	language_override: 'lg', default_language: 'ru'
});
partnerSchema.index({'title.value': 'text'}, {language_override: 'lg', default_language: 'ru'});
eventSchema.index({'title.value': 'text', 'intro.value': 'text', 'description.value': 'text'}, {
	weights: {'description.value': 2, 'intro.value': 3, 'title.value': 5},
	language_override: 'lg', default_language: 'ru'
});
programSchema.index({'title.value': 'text', 'description.value': 'text'}, {
	weights: {'description.value': 2, 'title.value': 5},
	language_override: 'lg', default_language: 'ru'
});
placeSchema.index({'title.value': 'text', 'description.value': 'text'}, {
	weights: {'description.value': 2, 'title.value': 5},
	language_override: 'lg', default_language: 'ru'
});


// ------------------------
// *** Plugins Block ***
// ------------------------


userSchema.plugin(mongooseBcrypt, { fields: ['password'] });

eventSchema.plugin(mongooseLocale);
placeSchema.plugin(mongooseLocale);
programSchema.plugin(mongooseLocale);
memberSchema.plugin(mongooseLocale);
partnerSchema.plugin(mongooseLocale);
postSchema.plugin(mongooseLocale);


// ------------------------
// *** Exports Block ***
// ------------------------


module.exports.User = mongoose.model('User', userSchema);
module.exports.Event = mongoose.model('Event', eventSchema);
module.exports.Place = mongoose.model('Place', placeSchema);
module.exports.Program = mongoose.model('Program', programSchema);
module.exports.Member = mongoose.model('Member', memberSchema);
module.exports.Partner = mongoose.model('Partner', partnerSchema);
module.exports.Post = mongoose.model('Post', postSchema);

