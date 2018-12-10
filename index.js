var MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    Hapi = require('hapi');

var url = 'mongodb://localhost:27017/wpl_mongo'

var server = new Hapi.Server();
server.connection({
    port:8080
})

server.route( [
    // Get user list
    {
        method: 'GET',
        path: '/api/users',
        handler: function(request, reply) {
            var findObject = {};
            for (var key in request.query) {
                findObject[key] = request.query[key]
            }
            collectionUsers.find(findObject).toArray(function(error, users) {
                assert.equal(null,error);
                reply(users);
            })
        }
    },

    // Get user list
    {
        method: 'GET',
        path: '/api/routine',
        handler: function(request, reply) {
            var findObject = {};
            for (var key in request.query) {
                findObject[key] = request.query[key]
            }
            collectionAuctionTime.find(findObject).toArray(function(error, auctionTime) {
                assert.equal(null,error);
                reply(auctionTime);
            })
        }
    },

    

    // Add new routine
    {
        method: 'POST',
        path: '/api/routine',
        handler: function(request, reply) {
            console.log(request.payload.noofitems);
            var N = request.payload.noofitems; // create an empty array with length 45
            request.payload.slots=Array.apply(null, {length: N}).map(Number.call, Number)
            console.log(request.payload);
            collectionAuctionTime.insertOne(request.payload, function(error, result) {
                request.payload
                assert.equal(null,error);
                reply(request.payload);
            })
        }
    },

    // Delete a single routine
    {
        method: 'DELETE',
        path: '/api/routine/{date}',
        handler: function(request, reply) {
            collectionAuctionTime.delete({date:request.params.date},
                function(error, results) {
                    reply ().code(204);
            })
        }
    },

    // Delete a single slot for a day
    {
        method: 'PUT',
        path: '/api/rountine/delete/{date}',
        handler: function(request, reply) {
            collectionU.updateOne({"date":request.params.date},
                                    {$pull: request.payload},
                                function(error, results) {
                                    collectionAuctionTime.findOne({"date":request.params.date}, function(error, results) {
                                        reply(results);
                                    }) 
                                })
        }
    },

    // Update a single slot for a single day
    {
        method: 'PUT',
        path: '/api/rountine/add/{date}',
        handler: function(request, reply) {
            collectionU.updateOne({"date":request.params.date},
                                    {$addToSet: request.payload},
                                function(error, results) {
                                    collectionAuctionTime.findOne({"date":request.params.date}, function(error, results) {
                                        reply(results);
                                    }) 
                                })
        }
    },

    // Add new user
    {
        method: 'POST',
        path: '/api/users',
        handler: function(request, reply) {
            collectionUsers.insertOne(request.payload, function(error, result) {
                request.payload
                assert.equal(null,error);
                reply(request.payload);
            })
        }
    },
    // Get a single user
    {
        method: 'GET',
        path: '/api/users/{email}',
        handler: function(request, reply) {
            collectionUsers.findOne({"email":request.params.email}, function(error, user) {
               assert.equal(null,error);
               reply(user);
            })
        }
    },
    // Update a single user
    {
        method: 'PUT',
        path: '/api/users/{email}',
        handler: function(request, reply) {
            collectionUsers.updateOne({"email":request.params.email},
                                    {$set: request.payload},
                                function(error, results) {
                                    collectionUsers.findOne({"email":request.params.email}, function(error, results) {
                                        reply(results);
                                    }) 
                                })
        }
    },
    // Delete a single user
    {
        method: 'DELETE',
        path: '/api/users/{email}',
        handler: function(request, reply) {
            collectionUsers.deleteOne({email:request.params.email},
                function(error, results) {
                    reply ().code(204);
            })
        }
    },
    // Get items list
    {
        method: 'GET',
        path: '/api/items',
        handler: function(request, reply) {
            var findObject = {};
            for (var key in request.query) {
                findObject[key] = request.query[key]
            }
            collectionItems.find(findObject).toArray(function(error, items) {
                assert.equal(null,error);
                reply(items);
            })
        }
    },
    // Add new items
    {
        method: 'POST',
        path: '/api/items',
        handler: function(request, reply) {
            collectionItems.insertOne(request.payload, function(error, result) {
                assert.equal(null,error);
                reply(request.payload);
            })
        }
    },
    // Get a single item
    {
        method: 'GET',
        path: '/api/items/{itemid}',
        handler: function(request, reply) {
            collectionItems.findOne({"itemid":new mongodb.ObjectID(request.params.name)}, function(error, item) {
               assert.equal(null,error);
               reply(item);
            })
        }
    },
    // Update a single item
    {
        method: 'PUT',
        path: '/api/items/{itemid}',
        handler: function(request, reply) {
            if (request.query.replace == "true") {
                request.payload._id = new mongodb.ObjectID(request.params.itemid);
                console.log(request.payload);
                collectionItems.replaceOne({"_id": new mongodb.ObjectID(request.params.itemid)},
                                      request.payload,
                   function(error, results) {
                    collectionItems.findOne({"_id":new mongodb.ObjectID(request.params.itemid)}, 
                            function(error, results) {
                                reply(results);
                    })
            })
            } else {
                    collectionUsers.updateOne({itemid:request.params.itemid},
                                    {$set: request.payload},
                                    function(error, results) {
                                        collectionItems.findOne({"_id":new mongodb.ObjectID(request.params.itemid)}, function(error, results) {
                        reply(results);
                }) 
              })
            }
        }
    },
    // Delete a single item
    {
        method: 'DELETE',
        path: '/api/items/{itemid}',
        handler: function(request, reply) {
            collectionItems.deleteOne({_id:new mongodb.ObjectID(request.params.itemid)},
                function(error, results) {
                    reply ().code(204);
            })
        }
    },
    // Home page
    {
        method: 'GET',
        path: '/',
        handler: function(request, reply) {
            reply( "Hello world from Hapi/Mongo example.")
        }
    }
])

MongoClient.connect(url, function(err, db) {
    assert.equal(null,err);
    console.log("connected correctly to server");
    collectionUsers = db.collection('users');
    collectionItems = db.collection('items');
    collectionAuctionTime = db.collection('auctionTime');
    server.start(function(err) {
        console.log('Hapi is listening to http://localhost:8080')
    })
})