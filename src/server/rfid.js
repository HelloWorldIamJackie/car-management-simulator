var express = require('express');
var router = express.Router();

router.post('/', function (req, res) {
    let { floor, direction, carNumber } = req.body

    console.log(`Car ${carNumber} ${direction} ${floor}`)

    res.send({
        is_success: true
    })
});

module.exports = router;
