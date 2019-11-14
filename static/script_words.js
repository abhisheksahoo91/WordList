"use strict";

async function getSelectedWord(me) {
	let myWord = me.innerHTML;
	myWord = myWord.trim();
	let baseURL = "https://www.dictionaryapi.com/";
	let apiURL = "api/v3/references/collegiate/json/" + myWord + "?key=";
	let myApiKey = "211e1874-5995-41b6-a51f-0ecbf3b82fb2";
	let finalURL = baseURL + apiURL + myApiKey;
	console.log(finalURL);
	await fetch(finalURL).then(function (resp) {
		resp.json().then(function (myJson) {
			var myDef = new Array();
			if(myJson != null && myJson.length != 0) {
				let iDef = myJson[0].shortdef;
				for (let j=0;j<iDef.length;j++) {
					myDef.push(iDef[j]);
				}
				console.log(myJson);
				console.log(myDef);
			} else {
				console.log('No existing records for the word ' + myWord);
			}
		})
	});
}

