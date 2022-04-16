# screenshot 🎢

An easy to use Node.js REST API to take screenshots from websites

# Used libraries
* express
* puppeteer
* dotenv
* express-rate-limit

# Usage
It's so easy to use, just send GET request to this app with `url` query option, like
```
https://localhost:8080/?url=https://github.com/
```

# Config
Config examples you can find in 
* [.env.example](./.env.example)
* [config.example.json](./config.example.json)

# Setup
* To setup this on your server, just clone the repository, install Node.JS and libraries and then just start it.

* Or you can use Heroku:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/Chore-Camp/screenshot)