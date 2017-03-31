let { getNextCar } = require('./ticket')
let moment = require("moment")

let Floor = class Floor{
  constructor(loadingSpace, watingSpace, floor){
    this.loadingSpace = loadingSpace
    this.watingSpace = watingSpace
    this.floor = floor
    this.waitingCars = []
    this.loadingCars = []
    this.comeWaitingCars = []
    this.comeLoadingCars = []
  }

  getStatus(){
    let loading_str = ""
    this.loadingCars.map( carNumber => {
      loading_str += ` ${carNumber}`
    })

    let come_loading_str = ""
    this.comeLoadingCars.map( car => {
      come_loading_str += ` ${car.carNumber}`
    })

    let waiting_str = ""
    this.waitingCars.map( car => {
      waiting_str += ` ${car.carNumber}`
    })

    let come_waiting_str = ""
    this.comeWaitingCars.map( car => {
      come_waiting_str += ` ${car.carNumber}`
    })

    return {
      loading_str,
      come_loading_str,
      waiting_str,
      come_waiting_str
    }
  }

  load(carNumber){
    this.loadingCars.push(carNumber)
    this.comeLoadingCars.map( (car, index) => {
      if(car.carNumber == carNumber){
        this.comeLoadingCars.splice(index, 1)
      }
    })
  }

  unload(carNumber){
    this.loadingCars.map( (_carNumber, index) => {
      if(_carNumber == carNumber){
        this.loadingCars.splice(index, 1)
      }
    })
  }

  intoWaiting(carNumber){
    this.waitingCars.push({carNumber})
    this.comeWaitingCars.map( (car, index) => {
      if(car.carNumber == carNumber){
        this.comeWaitingCars.splice(index, 1)
      }
    })
  }

  outOfWaiting(carNumber){
    this.waitingCars.delete(carNumber)
    this.watingSpace++
  }

  getWaitingCar(){
    if(this.waitingCars.length>0){
      return this.waitingCars[0]
    }
    else
      return null
  }

  assignCarToLoad(){
    let car = this.getWaitingCar()
    if(car){
      car.time = moment().valueOf() + 40000
      this.comeLoadingCars.push(car)
      this.waitingCars.map( (_car, index) => {
        if(_car.carNumber == car.carNumber){
          this.waitingCars.splice(index, 1)
        }
      })
    }
  }

  checking(){

    //if loading cars and come loading cars < loading space, notify a car to load
    if(this.loadingCars.length + this.comeLoadingCars.length < this.loadingSpace){
      this.assignCarToLoad()
    }

    // check come loading cars, if time is expired, remove it
    this.comeLoadingCars.map( (car, index) => {
      //time expired
      if(moment().valueOf() > car.time){
        this.comeLoadingCars.splice(index, 1)
        if(car.secondChance==null){
          car.secondChance = true
          this.waitingCars.push(car)
        }
        this.assignCarToLoad()
      }
    })

    //check waiting space
    if( (this.waitingCars.length + this.comeWaitingCars.length) < this.watingSpace){
      let car = getNextCar(this.floor)
      // console.log(`car: ${JSON.stringify(car)}`)
      if(car){
        car.time = moment().valueOf() + 40000
        this.comeWaitingCars.push(car)
      }
    }

    // check coming cars
    this.comeWaitingCars.map( (car, index) => {
      //time expired
      if(moment().valueOf() > car.time){
        this.comeWaitingCars.splice(index, 1)
      }
    })
  }
}

module.exports = Floor
