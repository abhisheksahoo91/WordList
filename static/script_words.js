"use strict";

async function getSelectedWord(me) {
	let myWord = me.innerHTML;
	myWord = myWord.trim();
	let baseURL = "https://www.dictionaryapi.com/";
	let apiURL = "api/v3/references/collegiate/json/" + myWord + "?key=";
	let myApiKey = "211e1874-5995-41b6-a51f-0ecbf3b82fb2";
	let finalURL = baseURL + apiURL + myApiKey;
	console.log(finalURL)
	await fetch(finalURL).then(function (resp) {
		resp.json().then(function (myJson) {
			var myDef = new Array();
			console.log(myJson);
			if(myJson != null && myJson.length != 0) {
				try{
					var divDefGroup = document.getElementById('word_def_group');
					var divDefClose = document.getElementById('word_def_close');
					var divDef = document.getElementById('word_definition');
					divDefClose.innerHTML = 'Close[X]';
					divDefGroup.appendChild(divDefClose);

					divDef.innerHTML = [];
					var orderedList = document.createElement('ul');
					for (let i = 0; i < myJson.length; i++) {
						var iMyJson = myJson[i];
						var iList = document.createElement('li');
						iList.innerHTML = iMyJson.meta.id + " (" + iMyJson.fl + ")";
						orderedList.appendChild(iList);

						var unorderedList = document.createElement('ul');
						for (let j = 0; j < iMyJson.shortdef.length; j++) {
							var jList = document.createElement('li');
							jList.innerHTML = iMyJson.shortdef[j];
							unorderedList.appendChild(jList);
						}
						orderedList.appendChild(unorderedList);
					}
					
					divDef.appendChild(orderedList);
					divDefGroup.appendChild(divDef);
					
					divDefGroup.classList.add('word_def_group_on');
					divDefGroup.classList.remove('word_def_group_off');
				} catch(err) {
					alert('No definition for the word ' + myWord + '. The error is : ' + err.message);
					console.log('No definition for the word ' + myWord);
				}
			} else {
				alert('No existing records for the word ' + myWord)
				console.log('No existing records for the word ' + myWord);
			}
		})
	});
}

function closeDefinition() {
	var divDefGroup = document.getElementById('word_def_group')
	divDefGroup.classList.add('word_def_group_off');
}