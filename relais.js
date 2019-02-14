//INDEX.JS
const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const fetch = require('node-fetch');

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
async function isStars(){ 
		
		var restaurants = [];
		var hotels = await scraping();
		console.log('start isStars() ');
		
		for (const url of hotels){
			await request(url, (error, respons,html) => { //console.log(url);
				const $ = cheerio.load(html);
						
				if ($('li.active > a',html).data('id')=='isProperty' && $('.jsSecondNavMain > li:nth-child(2) > a',html).data('id').includes('isRestaurant')) {
						var name = $('picture > img', html).attr('alt');
						var star = $('title', html).first().text();
						 //console.log(star);
						 if (star.includes('étoile')){
							if(star.includes('1 étoile')) star = '1 étoile';
							if(star.includes('2 étoile')) star = '2 étoile';
							if(star.includes('3 étoile')) star = '3 étoile';
							
							var obj = {'name' : name, "star" : star};
							restaurants.push(obj);
							
							//console.log(restaurants.length);						
	
								fs.writeFile('stars_restaurants.json', JSON.stringify(restaurants, null, 4), function(err){
								//console.log('File successfully written! - Check your project directory for the output.json file');})
								}
						)}
				return restaurants;
			}
		})
	}
}

//Get idEntity needed to change response in getPrice() and use getPrice() on all hostels.
async function getidEntity(){

	var idEntity = [];
	var hotels = await scraping();
	console.log('start getidEntity() ');

		for (var i = 0; i<4; i++){//for (const url of hotels){ TO GO THREW ALL HOSTELS URLS
		await request(hotels[i], (error, respons,html) => {
				const $ = cheerio.load(html);

		var id = $('.ajaxPages').find('#tabProperty').attr('data-gtm-datalayer');
		//console.log(id.synxis_id);
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
	//console.log('=======================');
	//console.log(idEntity);
	//console.log(idEntity.length);
	return idEntity;
}

//Get Price of each weekend of March 2019 from only 1 hostel (trying to get them for all hostel thanks to getidEntity())
async function getPrice() {

	console.log('start getPrice()');
	//var idEntity = await getidEntity();

//for(const id of idEntity){
	const response = await fetch("https://www.relaischateaux.com/fr/popin/availability/check?month=2019-3&idEntity=56232%7C%7CSTD1QG&pax=2&room=1", 
		{"credentials":"include","headers":{"accept":"application/json, text/javascript, */*; q=0.01","accept-language":"fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
		"x-requested-with":"XMLHttpRequest"},"referrer":"https://www.relaischateaux.com/fr/france/annedebretagne-loire-atlantique-la-plaine-sur-mer",
		"referrerPolicy":"origin-when-cross-origin","body":null,"method":"GET","mode":"cors"});
	
	var body = await response.json();
	var price;
	var prices = [] 
	var day = []
		//console.log(body);
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
			 //}
			 return [day,prices];
}	


scraping();
isStars();
getidEntity();
getPrice();

