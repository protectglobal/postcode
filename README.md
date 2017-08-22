# Protect Global Admin App

## Stack
Meteor, React, Redux, FlowRouter, ES6

## Getting started...

### Install MongoDB 3.4
Since we are using MongoDB 3.4 and, by the time of writing, Meteor doesn't
provides MongoDB 3.4 out of the box, we first need to install MongoDB 3.4 in our dev
environment (localhost) in order to be able to launch the Meteor instance using MongoDB 3.4.

1. Install MongoDB 3.4 as described here:
https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/ (source: https://forums.meteor.com/t/has-anyone-tried-running-meteor-with-mongodb-3-4/31818/2)
2. Open a new terminal and run: 'sudo service mongod start'. This will initialize your
MongoDB 3.4 instance. To stop the mongo instance by running: 'sudo service mongod stop'.
To restart the service by typing: 'sudo service mongod restart'.
3. To access the mongo shell (similar to 'meteor mongo' command) type:
```
mongo --shell
show dbs
use protectglobal (to switch to protectglobal db)
```
4. Use mongo db shell normally

5. To drop all collections run:
```
var collectionNames = db.getCollectionNames();
var len = collectionNames.length;
for (var i = 0; i < len; i++) {
  db[collectionNames[i]].drop()
}
```

source:
https://docs.mongodb.com/manual/reference/program/mongo/#bin.mongo
https://docs.mongodb.com/manual/tutorial/access-mongo-shell-help/
https://docs.mongodb.com/manual/reference/mongo-shell/

### Clone the project and run the Meteor instance connecting to MongoDB 3.4
1. cd to your meteor projects folder
2. clone repo: git clone https://github.com/.git && cd protectglobal
3. install NPM dependencies: meteor npm install
4. Run app: MONGO_URL=mongodb://localhost:27017/protectglobal meteor --settings settings.json

In case you need to import data from an external MongoDB, after running mongodump
to import the data, run the following command to fill the local DB:
```
mongorestore -h 127.0.0.1 --port 27017 -d protectglobal --drop dump/*
```
