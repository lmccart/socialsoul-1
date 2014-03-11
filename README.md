socialsoul
==========

twitter API docs
https://dev.twitter.com/docs/api/1.1

ntwitter nodejs module
https://github.com/AvianFlu/ntwitter

mongodb database
https://github.com/mongodb/node-mongodb-native
http://www.mongodb.org/



### setup

1. install mongodb http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/
2. install nginx http://learnaholic.me/2012/10/10/installing-nginx-in-mac-os-x-mountain-lion/
3. place ted app in Users/username/ folder, set default path (location root) in nginx.conf to this folder 
4. setup app
```
cd app
npm install
```


### to run
1. start mongo ```mongod```
2. start app ```node app.js```



### endpoints

* ```/screen.html?id``` -- view for screen (id = int or "exit")

* ```/controller``` -- BA controller page
* ```/controller?build_db``` -- rebuild the cached mentor db / data



### messages (from server)

* `message`: `{ message:"hello from the backend" }` -- just to confirm connection
* `sync`: `{ serverTime: Date.now(), cur_user: controller.cur_user, users: controller.queued_users, remaining: controller.getRemaining(), error: controller.error, serverTime: Date.now() }`
* `trigger`: `{ user: String, tweets: JSON, salient: [String] }`
* `mentor`: `{ user: String, content: JSON, salient: [String] }`
* `asset`: `{ file: String, tag: String(optional -- profile, background, friend, etc), is_mentor: BOOL }`






