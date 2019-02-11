//INDEX.JS
const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const fetch = require('node-fetch');


async function scraping(){ 
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


async function isStars(){ 
		
		var restaurants = [];
		var hotels = await scraping();
		console.log('start' + hotels.length);
		
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
							console.log('File successfully written! - Check your project directory for the output.json file');})
						} 
							
						
				}
						
		});				
		
	}
}

async function getPrice() {

	const response = await fetch("https://www.relaischateaux.com/fr/popin/availability/check?month=2019-3&idEntity=56232%7C%7CSTD1QG&pax=2&room=1", 
		{"credentials":"include","headers":{"accept":"application/json, text/javascript, */*; q=0.01","accept-language":"fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
		"x-requested-with":"XMLHttpRequest"},"referrer":"https://www.relaischateaux.com/fr/france/annedebretagne-loire-atlantique-la-plaine-sur-mer",
		"referrerPolicy":"origin-when-cross-origin","body":null,"method":"GET","mode":"cors"});
	
	var body = await response.json();
	//console.log(body);
var prices = [] //Object.entries(body['2019-2'].pricesPerDay);
	var price; 
		for (var i=1; i<32; i++){
			
			var weekend = new Date ('2019-03-'+i);
			
			if(weekend.getDay() == 6){
				if (body['2019-3'].pricesPerDay[i] != undefined){
				console.log(i);
				console.log(body['2019-3'].pricesPerDay[i]);}
				else {
				console.log(i);
				console.log('UNAVAILABLE');}	
				//prices.push(price);															
				} 
			}
		//console.log(prices);
}

//scraping();
//isStars();
getPrice();

