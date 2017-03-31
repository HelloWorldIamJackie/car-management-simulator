var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)

let { getTicket, tickets, activatedTickets, activateTicket, resetTicket } = require('./ticket')
let Floor = require('./Floor')
let GF = require('./gf')

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true, limit: '500mb' })); // support encoded bodies

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next()
});

app.use('/ticket', require('./ticket').router)

app.get('/', function (req, res) {
  // res.send('../views/index.html')
  res.sendFile(path.join(__dirname, '../views/index.html'));
})

server.listen(process.env.PORT || 3000, function () {
  console.log('Server listening on port 3000!')
})

let _gf = new GF(5, 0, "gf")
let _1f = new Floor(3, 3, "1f")
let _2f = new Floor(1, 1, "2f")
let _3f = new Floor(3, 8, "3f")


function reset(){
  _gf.reset()
  _1f.reset()
  _2f.reset()
  _3f.reset()
  resetTicket()
}

let global_socket;

io.on('connection', function (socket) {
  global_socket = socket

  socket.on('command', function (data) {
    console.log(data);
    let action = data.split(" ")[0]

    try{
      switch (action) {
        case "getTicket":
          let tickets = (data.split(" ").length-1)/2
          for(let i=0; i<tickets; i++){
              getTicket(data.split(" ")[i*2+1], data.split(" ")[i*2+2])
          }
          break;
        case "activateTicket":
          let toActivaateTickets = data.split(" ").length-1
          for(let i=0; i<toActivaateTickets; i++){
              activateTicket(data.split(" ")[i+1])
          }
          break;
        case "leave":
          let toUnloadCars = (data.split(" ").length-1)/2
          for(let i=0; i<toUnloadCars; i++){
            let floor
            switch (data.split(" ")[i*2+2]) {
              case "gf":
                floor = _gf
                break;
              case "1f":
                floor = _1f
                break;
              case "2f":
                floor = _2f
                break;
              case "3f":
                floor = _3f;
                break
              default:

            }
            floor.unload(data.split(" ")[i*2+1])
          }
          break
        case "load":
          let toLoadingCars = (data.split(" ").length-1)/2
          for(let i=0; i<toLoadingCars; i++){
            let floor
            switch (data.split(" ")[i*2+2]) {
              case "gf":
                floor = _gf
                break;
              case "1f":
                floor = _1f
                break;
              case "2f":
                floor = _2f
                break;
              case "3f":
                floor = _3f;
                break
              default:
            }
            floor.load(data.split(" ")[i*2+1])
          }
          break
        case "wait":
          let toWaitingCars = (data.split(" ").length-1)/2
          for(let i=0; i<toWaitingCars; i++){
            let floor
            switch (data.split(" ")[i*2+2]) {
              case "gf":
                floor = _gf
                break;
              case "1f":
                floor = _1f
                break;
              case "2f":
                floor = _2f
                break;
              case "3f":
                floor = _3f
                break
            }

            floor.intoWaiting(data.split(" ")[i*2+1])
          }
          break
        case "clear":
          reset()
          break
      }
      respondStatus()
    }
    catch(e){
      console.log(e)
      global_socket.emit('err', {})
    }
  });
});

function respondStatus(){
  let ticketsCarNumber = ""
  tickets.forEach( (value, key) => {
    ticketsCarNumber += ` (${key}, ${value.floor}, ${value.ticketNumber})`
  })

  let activatedCars = ""
  activatedTickets.map( ticket => {
    activatedCars += ` (${ticket.carNumber}, ${ticket.floor}, ${ticket.ticketNumber})`
  })

  let _gf_status = _gf.getStatus()
  let _1f_status = _1f.getStatus()
  let _2f_status = _2f.getStatus()
  let _3f_status = _3f.getStatus()

  if(global_socket !== undefined){
    global_socket.emit('status', {
      ticketPool: ticketsCarNumber,
      activatedTickets: activatedCars,
      _gf_status,
      _1f_status,
      _2f_status,
      _3f_status
    })
  }
}

setInterval(() => {
  _gf.checking()
  _1f.checking()
  _2f.checking()
  _3f.checking()
  respondStatus()
}, 1000)
