socialsoul
==========

twitter API docs
https://dev.twitter.com/docs/api/1.1

ntwitter nodejs module
https://github.com/AvianFlu/ntwitter

mongodb database
https://github.com/mongodb/node-mongodb-native
http://www.mongodb.org/

### setup notes
* Naming: server - socialsoulserver, clients - socialsoul[0-5]
* User/pass for all: socialsoul/soulmate
* All files under `/Users/socialsoul/Documents/socialsoul`.

### setup

0. [install nodejs](https://nodejs.org/)
0. [install git](http://git-scm.com/downloads)
0. clone this repository `cd /Users/socialsoul/Documents/ && git clone git@github.com:lmccart/socialsoul.git` (if you want to keep it somewhere else, you might need to configure the directory permissions properly for nginx to work)
0. [install brew](http://brew.sh/) `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
0. [install mongodb](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/) `brew install mongodb`
0. [install nginx](http://learnaholic.me/2012/10/10/installing-nginx-in-mac-os-x-mountain-lion/) `brew install nginx`
0. configure nginx `open -t /usr/local/etc/nginx/nginx.conf`, change `listen 8080` to `listen 3000`, change `location root html` to `location root /Users/socialsoul/Documents/socialsoul/public`
0. install forever `[sudo] npm install forever -g`
0. install node modules `cd /Users/socialsoul/Documents/socialsoul && npm install`
0. check out the modified version of the twitter module `git checkout HEAD node_modules/ntwitter/lib/twitter.js`
0. `cp data/config-sample.js data/config.js`
0. `cp data/twitter-creds-sample.json data/twitter-creds.json`

### server/automation setup
0. copy extra/LaunchDaemons to /Library/LaunchDaemons
1. load each launchdaemon `launchctl load ***`
2. distribute ssh keys: run `extra/dist_ssh.sh`
3. distribute desktop items, copy and load LaunchDaemons, set system config options: run `extra/dist_all.sh`
4. reboot all computers: `extra/reboot_all.exp`

### to run manually (dev)
0. open terminal and start mongo `mongod`
0. open a new terminal tab and start nginx `nginx` (`nginx -s stop` to stop)
0. nginx will return immediately, then start node `forever start app.js`


### endpoints

* `/screen.html?id` -- view for screen (id = int or "exit")
	e.g. `/screen.html?0`, `/screen.html?1`, `/screen.html?exit`
* `/index.html` -- BA controller page, where users can select
	which twitter handle will be matched up next.
* `/admin.html` -- controller page with the same functionality as index.html,
	and several additional administrative features
* `/index.html?build_db` -- rebuild the cached mentor db / data
* `/index.html?test_algo` -- test the secret algorithm



### messages (from server)

* `message`: `{ message:"hello from the backend" }` -- just to confirm connection
* `sync`: `{ serverTime: Date.now(), cur_user: controller.cur_user, users: controller.queued_users, remaining: controller.getRemaining(), error: controller.error, serverTime: Date.now() }`
* `trigger`: `{ user: String, tweets: JSON, salient: [String] }`
* `mentor`: `{ user: String, content: JSON, salient: [String] }`
* `asset`: `{ file: String, tag: String(optional -- profile, background, friend, etc), is_mentor: BOOL }`






