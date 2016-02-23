var mongodb = require('./db'),
	markdown = require('markdown').markdown;
function Content(title, author, content, label) {
	this.title = title;
	this.author = author;
	this.content = content;
	this.label = label;
}

module.exports = Content;

//存储blog
Content.prototype.save = function(callback) {
	var date = new Date();
	var time = {
	  date: date,
      year : date.getFullYear(),
      month : date.getFullYear() + "-" + (date.getMonth() + 1),
      day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
      minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
      date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
	}
	/*取摘要*/
	function sumar(contents){
		var Csum = "";
		if(contents.indexOf(">") != -1) {
			Csum += contents.substring(1,contents.indexOf(">",1));
		}
		if(contents.search(/.*!\[\]\(.*?\)$/) != -1) {
			Csum += contents.match(/.*!\[\]\(.*?\)$/)[0];
		}
		return Csum;
	}
	var blog = {
		title:this.title,
		author:this.author,
		time: time,
		summary:markdown.toHTML(sumar(this.content)),
		content: this.content,
		label:this.label
	};

	mongodb.open(function(err,db) {
		if(err) {
			return callback(err);
		}
		db.collection('blogs', function(err, collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}
			collection.insert(blog, {
				safe:true
			},function(err) {
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null);
			});
		});
	});
};
//读取所有
Content.getAll = function(name, callback) {
	mongodb.open(function(err, db) {
		if(err) {
			return callback(err);
		}
		db.collection('blogs', function(err, collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}
			var query = {};
			if(name) {
				query.name = name;
			}
			collection.find(query).sort({
				time:-1
			}).toArray(function(err, docs) {
				mongodb.close();
				if(err) {
					return callback(err);
				}
				docs.forEach(function(doc) {
					doc.content = markdown.toHTML(doc.content);
				});
				callback(null, docs);
			});
		});
	});
};
//读10个blog,分页
Content.getTen = function(name, page, callback) {
	mongodb.open(function(err,db) {
		if(err) {
			return callback(err);
		}
		db.collection('blogs', function(err, collection){
			if(err) {
				mongodb.close();
				return callback(err);
			}
			var query = {};
			if(name){
				query.name = name;
			}
			collection.count(query, function(err, total) {
				collection.find(query, {
					skip:(page-1) *5,
					limit:5
				}).sort({
					time:-1
				}).toArray(function(err, docs) {
					mongodb.close();
					if(err) {
						return callback(err);
					}
					docs.forEach(function(doc) {
						doc.content = markdown.toHTML(doc.content);
					});
					callback(null, docs, total);
				});
			});
		});
	});
};
//根据label读取博客
Content.getLabel = function(label, page, callback) {
	mongodb.open(function(err, db) {
		if(err) {
			return callback(err);
		}
		db.collection('blogs', function(err, collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}
			var query = {};
			if(label){
				query.label = label;
			}
			collection.count(query, function(err, total) {
				collection.find(query, {
					skip:(page-1) *5,
					limit:5
				}).sort({
					time:-1
				}).toArray(function(err, docs) {
					mongodb.close();
					if(err) {
						return callback(err);
					}
					docs.forEach(function(doc) {
						doc.content = markdown.toHTML(doc.content);
					});
					callback(null, docs, total);
				});
			});
		});
	});
};
//读指定一个
Content.getOne = function(name, day, title, label, callback) {
	mongodb.open(function(err, db) {
		if(err) {
			return callback(err);
		}
		db.collection('blogs', function(err, collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}
			collection.findOne({
				"name":name,
				"time.day":day,
				"title":title,
				"label":label
			}, function(err, doc) {
				mongodb.close();
				if(err) {
					return callback(err);
				}
				doc.content = markdown.toHTML(doc.content);
				callback(null, doc);
			});
		});
	});
};
Content.search = function(keyword, callback) {
	mongodb.open(function(err, db) {
		if(err) {
			return callback(err);
		}
		db.collection('blogs', function(err, collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}
			var pattern = new RegExp(keyword, "i");
			collection.find({
				"title":pattern
			}, {
				"name":1,
				"time":1,
				"title":1
			}).sort({
				time:-1
			}).toArray(function(err, docs) {
				mongodb.close();
				if(err) {
					return callback(err);
				}
				callback(null, docs);
			});
		});
	});
};