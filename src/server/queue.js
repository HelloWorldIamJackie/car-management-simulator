var express = require('express');
var router = express.Router();

let queue_0f = []
let queue_1f = []
let queue_2f = []
let queue_3f = []


router.get('/:floor/:id', function (req, res) {
    switch (req.params.floor) {
      case "0f":
        queue_0f.push(req.params.id)
        break;
      case "1f":
        queue_1f.push(req.params.id)
        break;
      case "2f":
        queue_2f.push(req.params.id)
        break;
      case "3f":
        queue_3f.push(req.params.id)
        break;
      default:
    }
    res.send({
        is_success: true
    })
});

router.get('/showQueue', function (req, res) {
    res.send({
      queue_0f,
      queue_1f,
      queue_2f,
      queue_3f
    })
});

// router.get('/deQueue', function (req, res) {
//     tickerQueue.splice(0, 1)
//     res.send({
//         is_success: true
//     })
// });

module.exports = router;
