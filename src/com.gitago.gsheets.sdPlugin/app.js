/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/stream-deck.js" />

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const os = require('os');


const setcellvalueAction = new Action('com.gitago.gsheets.setcellvalue');
const getcellvalueAction = new Action('com.gitago.gsheets.getcellvalue');




/*
** The first event fired when Stream Deck starts
*/
$SD.onConnected(({ actionInfo, appInfo, connection, messageType, port, uuid }) => {
	console.log('Stream Deck connected!');
});

// HOW TO UPDATE GOOGLE SHEET
setcellvalueAction.onKeyUp(({ action, context, device, event, payload }) => {
	// Inside the `on_key_up` function
	const cellValue = payload.settings.cellValue;
	const sheetId = payload.settings.SheetID;
	const sheetName = payload.settings.SheetName;
	const a1Notation = payload.settings.A1Notation;	

	// const worksheet = Gsheet.gc.openById(sheetId);
	// const sheet = worksheet.worksheet(sheetName);
	// sheet.update(a1Notation, [[cellValue]]);


	const formattedTitle = linebreakTitle("Set Cell Value");
	$SD.setTitle(context, formattedTitle);

});


getcellvalueAction.onKeyUp(({ action, context, device, event, payload }) => {
	// make this fit the button as expected and add line breaks
	$SD.setTitle(context, 'Get\nCell Value');

});




function linebreakTitle(newTitle) {
	const i = 9;
	let tmp_1 = "";
	let tmp_2 = "";
	let tmp_3 = "";
  
	if (newTitle.length > i) {
	  tmp_1 = newTitle.slice(0, i) + '\n';
	  if (newTitle.length > (2 * i)) {
		tmp_2 = newTitle.slice(i, 2 * i) + '\n';
		if (newTitle.length > (3 * i)) {
		  tmp_3 = newTitle.slice(2 * i, 3 * i);
		} else {
		  tmp_3 = newTitle.slice(2 * i);
		}
	  } else {
		tmp_2 = newTitle.slice(i);
	  }
	} else {
	  tmp_1 = newTitle;
	}
  
	return tmp_1 + tmp_2 + tmp_3;
  }
  


 
  
  class GoogleSheet {
	constructor() {
	  this.credsExist = false;
	  this.appdataPath = process.env.APPDATA;
  
	  // Check if service creds exist
	  const serviceCreds = this.checkCreds();
	  if (this.credsExist === true) {
		this.gc = new google.auth.GoogleAuth({
		  keyFile: serviceCreds,
		  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
		});
	  }
	}
  
	checkCreds() {
	  const serviceCreds = path.join(this.appdataPath, 'gspread', 'service_account.json');
	  if (fs.existsSync(serviceCreds)) {
		this.credsExist = true;
		return serviceCreds;
	  } else {
		this.credsExist = false;
		return false;
	  }
	}
  }
  
const Gsheet = new GoogleSheet();
  