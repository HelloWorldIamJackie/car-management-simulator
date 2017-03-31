var express = require('express');
var router = express.Router();
var consoleLog = require('../utils/consoleLog')

let tickets = new Map()
let activatedTickets = []
let ticketNumber = 0

function getStatus(){
  consoleLog(`ticket pool:`)
  consoleLog(tickets)
  consoleLog("")
  consoleLog(`activated tickets:`)
  consoleLog(activatedTickets)
  consoleLog("")
}

router.get('/status', function (req, res) {
    res.send({
        is_success: true
    })
    getStatus()
});

router.get('/ticketPool', function (req, res) {
    res.send(tickets)
});

router.get('/activatedTickets', function (req, res) {
    res.send(activatedTickets)
});

router.post('/', function (req, res) {
    let { carNumber, floor } = req.body

    if(carNumber == null || floor == null){
      req.status(400).send({
        message: "Invalid parameters"
      })
      return;
    }

    tickets.set(carNumber, {floor, ticketNumber})
    consoleLog(`Ticket for car ${carNumber} is granted, its destination is to ${floor}`)
    consoleLog("")

    ticketNumber++;
    res.send({
        is_success: true
    })

});

router.get('/activate/:carNumber', function (req, res) {
    let { carNumber } = req.params
    consoleLog(`Ticket for car ${carNumber} is activated`)
    res.send({
      is_success: true
    })

    let { ticketNumber, floor } = tickets.get(carNumber)
    activatedTickets.push({carNumber, ticketNumber, floor})
    tickets.delete(carNumber)
});

function getNextCar(floor){
  // console.log(`floor: ${floor}`)
  if(activatedTickets.length>0){
    let min = null;
    let car = null;
    let _index;
    activatedTickets.map( (ticket, index) => {
      if(ticket.floor == floor){
        if(min == null || ticket.ticketNumber < min){
          car = ticket
          _index = index
          min = ticket.ticketNumber
        }
      }
    })

    if(car != null){
        activatedTickets.splice(_index, 1)
    }
    return car
  }
  else{
      return null
  }
}

function activateTicket(carNumber){
  let { ticketNumber, floor } = tickets.get(carNumber)
  activatedTickets.push({carNumber, ticketNumber, floor})
  tickets.delete(carNumber)
}

function getTicket(carNumber, floor){
  tickets.set(carNumber, {floor, ticketNumber})
  ticketNumber++
}

function resetTicket(){
  tickets.clear()
  activatedTickets.splice(0, activatedTickets.length)
}

module.exports = {
  router,
  getTicket,
  getStatus,
  tickets,
  activatedTickets,
  activateTicket,
  getNextCar,
  resetTicket,
};
