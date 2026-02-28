const jsonServer = require('json-server')
const path = require('path')
const fs = require('fs')

const server = jsonServer.create()

const dbPath = path.join(__dirname, '../db.json')
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'))
const router = jsonServer.router(db)

const middlewares = jsonServer.defaults()

server.use(middlewares)

server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
})

server.use(router)

module.exports = server