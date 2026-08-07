import xlsx from 'xlsx';
import fs from 'fs';

// 1. Read the Excel file we just copied over
const workbook = xlsx.readFile('flights_data.xlsx');

// 2. Get the first sheet
const firstSheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[firstSheetName];

// 3. Convert that sheet directly to JSON
const jsonData = xlsx.utils.sheet_to_json(worksheet);

// 4. Save it as a new .json file
fs.writeFileSync('flights_data.json', JSON.stringify(jsonData, null, 2));

console.log(`Success! Converted ${jsonData.length} rows to JSON.`);