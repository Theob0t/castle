import React, { Component } from 'react';
import data from './datas/March_WE.json';
import  best_option from './datas/best_option.json';
import './App.css';


class App extends Component {

  getBest(){
    var best = best_option;
    const hotels = best.map(el => {
      //console.log(el);
      let name = el.best_choice_name;
      //console.log(name);
      let day = el.best_choice_date;
      //console.log(day);
      let price = el.best_choice_price;
      //console.log(price);

    return ( 
        <div className="line">
          <div className = 'name'>
            <p>{name}</p>
          </div>
          <div className = 'date'>
            <div><p>{"Saturday "+ day + "th March 2019"}</p></div>
          </div>
          <div className = 'price'>
            <div><p>{price}</p></div>
          </div>
        </div>
      )
    })

    return hotels;
  }
  
  getAll(){

    var final = data;

    const hotels = final.map(el => {
      //console.log(el)
      let days = el.day.map(day => {
        //console.log(day);
        return (
          <p>{"Saturday "+ day + "th March 2019"}</p>
        )
      })
      let prices = el.prices.map(price => {
      // console.log(price);
        return (
          <p>{price}</p>
        )
      })
      if(prices != "UNAVAILABLE"){
      return ( 
        <div className="line">
          <div className = 'name'>
            <p>{el.name}</p>
          </div>
          <div className = 'date'>
            <div>{days}</div>
          </div>
          <div className = 'price'>
            <div>{prices}</div>
          </div>
        </div>
      )}
    })

    
    return hotels;
    }
     

  render() {   
    return (
      <div className="App">
        <div className="container">
        <h1 className="text">WEEKEND OF MARCH</h1>
        <h4 className="text">BEST OPTION(S)</h4>
          {this.getBest()}
        <h4 className="text">ALL HOTELS WITH MICHELIN STARRED RESTAURANT</h4>  
          {this.getAll()}

        </div>
        
      </div>
    );
  }
}

export default App;
