# MERN Blogging Application

A simple realtime Blogging web application.

## Tech used are
- Nodejs
- Expressjs
- Reactjs
- MongoDB - database
- Socket.io - for realtime web applications 

> Backend/nodemon.json
```
{
  "env": {
    "MONGO_USER": "<MongoBD username>",
    "MONGO_PASSWORD": "<MongoBD password>",
    "MONGO_DEFAULT_DATABASE": "<Collection name>"
  }
}
```
Don't forget to create the above file with this configuration.

## Development 


### Clone Repository

```sh
$ git clone https://github.com/Prateek9144/Blog.git
```
### Install dependencies

```sh
$ cd Backend 
$ npm install
```
```sh
$ cd Frontend 
$ npm install
```

### Start the app

#### Start Server


```sh
$ cd Backend 
$ npm start
```

#### Start application
```sh
$ cd Frontend 
$ npm start
```

Open a browser tab and write http://localhost:3000/ to see the website.