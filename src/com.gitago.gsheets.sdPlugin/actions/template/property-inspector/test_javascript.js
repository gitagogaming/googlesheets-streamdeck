const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Get the appdata directory based on the current platform
const appdataDir = getAppDataDirectory();

// Define the path to the credentials file
const credentialsPath = path.join(appdataDir, 'gspread', 'service_account.json');

// Check if the credentials file exists at the specified path
const credsExist = checkCredentialsExist(credentialsPath);


function checkCredentialsExist(credentialsPath) {
  try {
    const resolvedPath = path.resolve(credentialsPath);
    return fs.existsSync(resolvedPath);
  } catch (error) {
    console.error('Error checking credentials existence:', error);
    return false;
  }
}

// Use `credentialsPath` as needed
function getAppDataDirectory() {
  if (process.platform === 'win32') {
    return process.env.APPDATA;
  } else if (process.platform === 'darwin') {
    return path.join(os.homedir(), 'Library', 'Application Support');
  } else {
    return path.join(os.homedir(), '.config');
  }
}


// Set the scope for accessing spreadsheets
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// if credsexist then lets do the thing

// Read the credentials JSON file
const credentials = JSON.parse(fs.readFileSync(credentialsPath));

// Create a new JWT client using the credentials
const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  SCOPES
);

// Authorize the client
auth.authorize()
  .then(() => {
    // Authorization successful
    console.log('Authorization successful');
  })
  .catch(error => {
    console.error('Authorization error:', error.message);
  });



// Get cell value
async function getCellValue(sheetId, sheetName, a1Notation) {
  try {
    // Create a new instance of the Sheets API
    const sheets = google.sheets({ version: 'v4', auth });

    // Retrieve the cell value
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${sheetName}!${a1Notation}`
    });

    if (response.data.values && response.data.values.length > 0) {
      const cellValue = response.data.values[0][0]; // Assuming a single cell is returned
      console.log('Cell value:', cellValue);
    } else {
      console.log('No values found for the specified range.');
    }
  } catch (error) {
    console.error('Error retrieving cell value:', error.message);
  }
}


// Function to update cell value
async function updateCellValue(sheetId, sheetName, a1Notation, cellValue) {
  try {
    // Create a new instance of the Sheets API
    const sheets = google.sheets({ version: 'v4', auth });

    // Update the cell value
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${sheetName}!${a1Notation}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[cellValue]]
      }
    });

    console.log('Cell updated successfully:', response.data.updatedRange);
  } catch (error) {
    console.error('Error updating cell value:', error.message);
  }
}


// Usage example
const sheetId = '1bQ6wtP-OArPFJ5xZYfPqxOmPosRI9ilVzE65NfcWd0c'; // Replace with your Google Sheet ID
const sheetName = 'Tactical_Bandits'; // Replace with the name of your sheet
const a1Notation = 'A26'; // Replace with the cell reference
const cellValue = 'New Valuessss'; // Replace with the desired cell value


getCellValue(sheetId, sheetName, a1Notation);

updateCellValue(sheetId, sheetName, a1Notation, cellValue);