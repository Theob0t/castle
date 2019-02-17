//INDEX.JS
const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const fetch = require('node-fetch');
var json = require('./stars_urls.json');
var final_j = require('./March_WE.json');

//Scrap relaischateaux.com to get all urls of Relais & Chateaux's hostels
async function scraping(){ 
	console.log('start scraping()')
		var hotels = [];
		await request('https://www.relaischateaux.com/fr/site-map/etablissements', (error, respons,html) => {
			const $ = cheerio.load(html);
					
				$('#countryF',html).find("h3:contains('France')").parent().find(".listDiamond > li").each(function(index){
						const url = $(this).find("a").first()[0].attribs.href;
						hotels.push(url);
						
					});				
					//console.log(hotels.length);
					fs.writeFile('urls_hotels.json', JSON.stringify(hotels, null, 4), function(err){

					//console.log('File successfully written! - Check your project directory for the output.json file');

				})
		});
		return hotels;
}

//return table of Michelin's star restaurants in Relais et Chateaux's hostels and number of stars
//We run it once but we won't make it run every time because it takes around 10 min to run and we will use the JSON file straightly 
async function isStars(){ 
	
	console.log('start isStars() ');	
		var restaurants = [];
		var urls_star = [];
		var hotels = await scraping();
		
		
		for (const url of hotels){
			await request(url, (error, respons,html) => { console.log('isStars2  ' + url);
				const $ = cheerio.load(html);
						
				if ($('li.active > a',html).data('id')=='isProperty' && $('.jsSecondNavMain > li:nth-child(2) > a',html).data('id').includes('isRestaurant')) {
						var name = $('picture > img', html).attr('alt');
						var star = $('title', html).first().text();
						 //console.log(star);
						 if (star.includes('étoile')){
							if(star.includes('1 étoile')) star = '1 étoile';
							if(star.includes('2 étoile')) star = '2 étoile';
							if(star.includes('3 étoile')) star = '3 étoile';
							
							var obj = {'name' : name, "star" : star, "url" : url}
							restaurants.push(obj);
							urls_star.push(url);

								fs.writeFile('stars_restaurants.json', JSON.stringify(restaurants, null, 4), function(err){
								//console.log('File successfully written! - Check your project directory for the output.json file');
								})

								fs.writeFile('stars_urls.json', JSON.stringify(urls_star, null, 4), function(err){
								//console.log('File successfully written! - Check your project directory for the output.json file');
								})
							
						}
				
			}
		})
	}
				console.log(urls_star);
				return urls_star;

}


//Get idEntity needed to change response in getPrice() and use getPrice() on hostels from JSON of isStar() (only hotels that got a Michelin star restaurant).
//Return 2D array with name and idEntity of an Hostel
async function getidEntity(){

	console.log('start getidEntity() ');
	var idEntity = [];
	var hotels_etoiles = json;
	var names = [];
		for (var i = 0; i<hotels_etoiles.length; i++){ //TO GO THREW ALL STARS HOSTELS URLS 
		//console.log(hotels_etoiles[i]);	
		var url = hotels_etoiles[i];
		await request(url, (error, respons,html) => {
				const $ = cheerio.load(html);

		var id = $('.ajaxPages').find('#tabProperty').attr('data-gtm-datalayer');
		var name = $('.ajaxPages').find('#tabProperty').attr('data-title'); 
		names.push(name);

		if(id != undefined){
		var index = id.indexOf("synxis_id");
		//console.log(index);
		if(index != -1){
			var indexComma = id.indexOf(",", index + 11 );
			id = id.substring(index + 11, indexComma);
			idEntity.push(id);
			//console.log(id);
		}
		else{id = 'noSynId';}
		}
	})
	}
	const results = new Array(names, idEntity);
	//console.log(results);
	return results;
}


//Get Price of each weekend of March 2019 from only 1 hostel (trying to get them for all hostels thanks to getidEntity())
async function getPrice() {

	console.log('start getPrice()');
	var idEntName = await getidEntity();
	//console.log(idEntName);
	var idEntity = idEntName;
	var final = [];
	var obj ={};
		for(const id of idEntity[1]){
			const response = await fetch("https://www.relaischateaux.com/fr/popin/availability/check?month=2019-3&idEntity="+id+"%7C%7CSTD&pax=2&room=1", 
				{"credentials":"include","headers":{"accept":"application/json, text/javascript, */*; q=0.01","accept-language":"fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
				"x-requested-with":"XMLHttpRequest"},"referrer":"https://www.relaischateaux.com/fr/france/annedebretagne-loire-atlantique-la-plaine-sur-mer",
				"referrerPolicy":"origin-when-cross-origin","body":null,"method":"GET","mode":"cors"});
			//console.log(response);
			var body = await response.json();
			//console.log(body);
			var price;
			
			
			var prices = []; 
			var day = [];
			var index = idEntity[1].indexOf(id);
			var name = idEntity[0][index];

			//console.log('index' + index);
			//console.log('name' + name);

						for (var i=1; i<32; i++){
							
							
							var weekend = new Date ('2019-03-'+i); //date of each day
						
									if(weekend.getDay() == 6 && body['2019-3'].pricesPerDay[i] != undefined){ //if day is Saturday && room available
										price = body['2019-3'].pricesPerDay[i]; //access price per day in JSON file into '2019-3' 
										day.push(i);
										prices.push(price);
										}
									else if (weekend.getDay() == 6){
									price = 'UNAVAILABLE';
									day.push(i);
									prices.push(price)
								 		}
						 }

					 	obj = {name,day,prices};
						//console.log(obj);

						final.push(obj); 

						fs.writeFile('March_WE.json', JSON.stringify(final, null, 4), function(err){

							//console.log('File successfully written! - Check your project directory for the output.json file');

						})
				
	}
}


//How to access any name, price or day into final_j JSON file of all Hotels with Michelin Star
async function getObj(){
	var final = final_j;

	for(var i=0; i<final.length; i++){
	
	const name = final[i].name;
	const price = final[i].prices;
	const availability = final[i].day;

	console.log(availability); 
	
	}
}

//Get the best price for a Saturday night in March 2019 over all the R&C hostels with Michelin Star
async function getBest(){
	var final = final_j;
	var price;
	var best_price;
	var temp = new Array;
	//console.log(final[1].prices);
		for(var i = 0; i < final.length; i++){		
			for(var j = 0 ; j<final[i].prices.length; j++){
				if (final[i].prices[j] != "UNAVAILABLE"){
					price = final[i].prices[j];	
					temp.push(parseInt(price.replace(/[^\d.-]/g, '')));
				}
			
			}}
			best_price = Math.min.apply(Math, temp);
			//console.log("BEST PRICE IS " + best_price);
			return best_price;
}

//Select the hostel(s) in the JSON file where price corresponds to the best_price of getBest()
//Write a JSON file that we will use in the React app
async function bestOption(){

	var best_price = await getBest();
	var final = final_j;
	const price = "US$"+best_price.toString();
	var best_choice = [];
	
	
	for(var i = 0; i < final.length; i++){		
			for(var j = 0 ; j<final[i].prices.length; j++){
				if (final[i].prices[j] == price){

					best_choice_name = final[i].name;
					best_choice_date = final[i].day[j];
					best_choice_price = final[i].prices[j]; 

					var obj = {best_choice_name, best_choice_date, best_choice_price};
					best_choice.push(obj);
				}
			}
	}
	
	fs.writeFile('best_option.json', JSON.stringify(best_choice, null, 4), function(err){

					//console.log('File successfully written! - Check your project directory for the output.json file');

				})
	console.log(best_choice);
	return best_choice;
}	



//scraping();
//isStars();
//getidEntity();
//getPrice();
//getObj();
//getBest();
//bestOption();

