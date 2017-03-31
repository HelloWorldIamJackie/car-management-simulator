let moment = require("moment")

let Floor = require('./Floor')
let { getNextCar } = require('./ticket')

let GF = class GF extends Floor{
  gf_get_loading_car(){
    let car = getNextCar(this.floor)
    if(car){
      car.time = moment().valueOf() + 40000
      car.attempt = 0
      this.comeLoadingCars.push(car)
    }
  }

  checking(){
    //if loading cars and come loading cars < loading space, notify a car to load
    if(this.loadingCars.length + this.comeLoadingCars.length < this.loadingSpace){
      this.gf_get_loading_car()
    }

    // check come loading cars, if time is expired, remove it
    this.comeLoadingCars.map( (car, index) => {
      //time expired
      if(moment().valueOf() > car.time){
        this.comeLoadingCars.splice(index, 1)
        this.gf_get_loading_car()
      }
    })
  }
}

module.exports = GF
