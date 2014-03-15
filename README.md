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

0. [install git](http://git-scm.com/downloads)
0. clone this repository `cd / && git clone git@github.com:lmccart/socialsoul.git` (if you want to keep it somewhere else, you might need to configure the directory permissions properly for nginx to work)
0. [install brew](http://brew.sh/) `ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"`
0. [install mongodb](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/) `brew install mongodb`
0. [install nginx](http://learnaholic.me/2012/10/10/installing-nginx-in-mac-os-x-mountain-lion/) `brew install nginx`
0. configure nginx `open -t /usr/local/etc/nginx/nginx.conf`, change `listen 8080` to `listen 3000`, change `location root html` to `location root /socialsoul/public`
0. install forever `[sudo] npm install forever -g`
0. install node modules `cd /socialsoul && npm install`
0. check out the modified version of the twitter module `git checkout HEAD node_modules/ntwitter/lib/twitter.js`

### to run
0. open terminal and start mongo `mongod`
0. open a new terminal tab and start nginx `nginx`
0. nginx will return immediately, then start node `forever start app.js`

### endpoints

* ```/screen.html?id``` -- view for screen (id = int or "exit")
* ```/index.html``` -- BA controller page
* ```/index.html?build_db``` -- rebuild the cached mentor db / data



### messages (from server)

* `message`: `{ message:"hello from the backend" }` -- just to confirm connection
* `sync`: `{ serverTime: Date.now(), cur_user: controller.cur_user, users: controller.queued_users, remaining: controller.getRemaining(), error: controller.error, serverTime: Date.now() }`
* `trigger`: `{ user: String, tweets: JSON, salient: [String] }`
* `mentor`: `{ user: String, content: JSON, salient: [String] }`
* `asset`: `{ file: String, tag: String(optional -- profile, background, friend, etc), is_mentor: BOOL }`






