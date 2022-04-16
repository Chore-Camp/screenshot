require('./setup_config')

const puppeteer = require('puppeteer')
const express = require('express')
const rateLimit = require('express-rate-limit')

const path = require('path')
const fs = require('fs')

const cache = new Map()

if (!fs.existsSync(path.join(__dirname, process.env.CACHE))) {

    fs.mkdirSync(path.join(__dirname, process.env.CACHE))
    console.log('* [INFO] Creating cache dir because it doesn\'t exists')

} else {

    fs.readdir(path.join(__dirname, process.env.CACHE), (err, files) => {
        if (err) {
            return console.error(err)
        }

        for (const file of files) {
            fs.unlink(path.join(__dirname, process.env.CACHE, file), err => {
                if (err) throw err
            })
        }
    })

}

(async () => {
    const args = ['--no-sandbox', '--disable-setuid-sandbox']
    const limiter = rateLimit({
	    windowMs: Number(process.env.COOLDOWN),
	    max: 1,
	    standardHeaders: true,
	    legacyHeaders: false,
    })

    const app = express()
    const browser = await puppeteer.launch({
        args,
        defaultViewport: {
            height: Number(process.env.HEIGHT),
            width: Number(process.env.WIDTH)
        }
    })
    
    app.use('/cache/', express.static(path.join(__dirname, process.env.CACHE)))
    app.use(limiter)

    app.get('/', async function(req, res) {
        if (process.env.AUTH_TOKEN) {
            if (req.headers.authorization !== process.env.AUTH_TOKEN) return res.status(401).send({ message: 'Unauthorized'})
        }

        if (!req.query.url || !new URL(req.query.url)) return res.status(400).send({ message: 'Invalid link were provided' })
        const url = new URL(req.query.url)

        if (cache.has(url.href)) {
            return res.redirect(`../cache/${cache.get(url.href)}.png`)
        }

        const page = await browser.newPage()
        await page.goto(url)
        let r = (Math.random() + 1).toString(36).substring(2);
        await page.screenshot({ path: path.join(__dirname, process.env.CACHE, `${r}.png`) })
        cache.set(url.href, r)

        res.send({ link: `https://${req.hostname === 'localhost' ? `${req.hostname}:${process.env.PORT}` : req.hostname}/${process.env.CACHE}/${r}.png` })
        
        setTimeout(() => {
            fs.unlink(path.join(__dirname, process.env.CACHE, `${r}.png`))
            cache.delete(url.href)
        }, Number(process.env.CACHE_TIME))
    })

    app.listen(process.env.PORT, () => {
        console.log('* [INFO] App listening on port', process.env.PORT)
    })
    
})()