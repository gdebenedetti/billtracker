var express = require('express')

var router = module.exports = express.Router()

router.get('/', require('../site-layout'))
