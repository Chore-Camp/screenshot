require('dotenv/config')

let config

try {
    config = require('./config.json')
} catch(e) {
    console.log('* [INFO] Config file haven\'t been found')
}

if (!process.env.PORT) process.env.PORT = isNaN(config?.PORT) ? 8080 : Number(config.PORT)
if (!process.env.CACHE) process.env.CACHE = config?.CACHE || 'cache'

if (isNaN(process.env.COOLDOWN)) process.env.COOLDOWN = isNaN(config?.COOLDOWN) ? 1000 : Number(config.COOLDOWN)
if (isNaN(process.env.CACHE_TIME)) process.env.CACHE_TIME = isNaN(config?.CACHE_TIME) ? 10000 : Number(config.CACHE_TIME)

if (isNaN(process.env.HEIGHT)) process.env.HEIGHT = isNaN(config?.HEIGHT) ? 1080 : Number(config.HEIGHT)
if (isNaN(process.env.WIDTH)) process.env.WIDTH = isNaN(config?.WIDTH) ? 1920 : Number(config.WIDTH)

if (config?.AUTH_TOKEN && !process.env.AUTH_TOKEN) process.env.AUTH_TOKEN = config.AUTH_TOKEN