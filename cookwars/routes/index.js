var express = require('express');
var router = express.Router();

var index = require('../controller/index.js')

/* GET home page. */
router.get('/', index.index);

module.exports = router;
