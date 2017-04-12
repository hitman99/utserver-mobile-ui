# utserver Mobile UI


[![CircleCI](https://circleci.com/gh/hitman99/utserver-mobile-ui/tree/master.svg?style=svg)](https://circleci.com/gh/hitman99/utserver-mobile-ui/tree/master)


Mobile UI written in ReactJS for utserver (Utorrent server for linux), because the mobile UI 
shipped with utserver sucks and is not usable. 

## Getting Started


### Prerequisites

What things you need to run the software

#### Windows

1. Install NodeJS
2. `npm install --global --production windows-build-tools`
3. `npm install --global node-gyp`, which is required by diskusage package

#### Linux 
1. `curl --silent --location https://rpm.nodesource.com/setup_7.x | bash -`
2. ` yum install -y nodejs`
3. `yum install -y gcc-c++ make`

### Installing utserver-mobile-ui

1. `npm install`


### Starting server
Just run `npm start`

### Developing
Open two consoles, cd into project dir. On one console run `npm run dev`, on the other `npm start`. 
Now you can develop and have javascript bundled on-the-fly

## Authors

* **Tomas** - *Legacy App / NodeJS + ReactJS conversion* - [Hitman99](https://github.com/hitman99)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

TBD
