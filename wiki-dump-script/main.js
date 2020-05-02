//
//  Wikipedia dump for COVID-19 cases in Bulgaria
//  by blez
//

const cheerio = require('cheerio');
const axios = require('axios');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '..') + '\\data\\';

const STREAM_FILENAME = DATA_DIR + 'historical_data.json';
const LATEST_FILENAME = DATA_DIR + 'latest_data.json';
const LASTUPDATE_FILENAME = DATA_DIR + 'last_update.json';

const WIKI_URL = 'https://en.wikipedia.org/wiki/Template:2019%E2%80%9320_coronavirus_pandemic_data/Bulgaria_medical_cases';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:75.0) Gecko/20100101 Firefox/75.0';

async function getAllData() {
  try {
    let tablesResult = [];

    const response = await axios.get(WIKI_URL, { headers: { 'User-Agent': USER_AGENT } });
    let data = response.data;

    const $ = await cheerio.load(data);

    let totalTables = $('.wikitable').length;

    for (let i = 0; i < totalTables; i++) {
      let tableData = dumpTable(i, $);

      tableData = fixDates(tableData);
      tablesResult.push(tableData);
    }

    let finalResult = getMergedResult(tablesResult);
    let finalResultJSON = JSON.stringify(finalResult, null, 2);
    //console.log(finalResultJSON);

    let resultShort = JSON.parse(finalResultJSON)[0];
    resultShort.data = resultShort.data.filter(x => x.total_cases);

    let resultShortJSON = JSON.stringify(resultShort, null, 2);
    //console.log(resultShortJSON);

    return { historical: finalResultJSON, latest: resultShortJSON };
  }
  catch (err) {
    console.error(err);
    return null;
  }
}

function fixDates(tableData) {
  for (let row of tableData) {
    row.date = moment(row.date, 'D MMMM YYYY').format('DD-MM-YYYY');
  }

  return tableData;
}

function getMergedResult(tablesResult) {
  let result = [];

  for (let table of tablesResult) {
    for (let row of table) {
      result.push(row);
    }
  }

  const sortedResult = result.sort((a, b) => moment(b.date, 'DD-MM-YYYY') - moment(a.date, 'DD-MM-YYYY'));

  return sortedResult;
}


(async function () {
  // a bit verbose, but, yea
  let jsonData = await getAllData();

  let streamExists = fs.existsSync(STREAM_FILENAME);
  let latestExists = fs.existsSync(LATEST_FILENAME);

  let oldStreamData = null;
  let oldLatestData = null;

  let lastUpdateDate = moment().format('DD-MM-YYYY HH:mm');
  let lastUpdateJSON = JSON.stringify({ last_update: lastUpdateDate });

  if (streamExists) {
    oldStreamData = fs.readFileSync(STREAM_FILENAME);

    if (oldStreamData != jsonData.historical) {
      fs.writeFileSync(STREAM_FILENAME, jsonData.historical);
      fs.writeFileSync(LASTUPDATE_FILENAME, lastUpdateJSON);

      console.log('[' + STREAM_FILENAME + '] Changes found. Update date: ' + lastUpdateDate);
    }
    else {
      console.log('[' + STREAM_FILENAME + '] No new data found. No changes written.');
    }
  }
  else {
    fs.writeFileSync(STREAM_FILENAME, jsonData.historical);
    fs.writeFileSync(LASTUPDATE_FILENAME, lastUpdateJSON);

    console.log('[' + STREAM_FILENAME + '] Changes found. Update date: ' + lastUpdateDate);
  }

  if (latestExists) {
    oldLatestData = fs.readFileSync(LATEST_FILENAME);

    if (oldLatestData != jsonData.latest) {
      fs.writeFileSync(LATEST_FILENAME, jsonData.latest);
      fs.writeFileSync(LASTUPDATE_FILENAME, lastUpdateJSON);

      console.log('[' + LATEST_FILENAME + '] Changes found. Update date: ' + lastUpdateDate);
    }
    else {
      console.log('[' + LATEST_FILENAME + '] No new data found. No changes written.');
    }
  }
  else {
    fs.writeFileSync(LATEST_FILENAME, jsonData.latest);
    fs.writeFileSync(LASTUPDATE_FILENAME, lastUpdateJSON);

    console.log('[' + LATEST_FILENAME + '] Changes found. Update date: ' + lastUpdateDate);
  }

})();


// same as: dump-wikipedia-browserscript.js
function dumpTable(index = 0, $ = $) {

  let rows = Array.from($($('.wikitable')[index]).find('tr'));

  // first row
  let headerTitlesFirstRow = [];
  let headersFirstRow = $(rows[0]).find('th');

  for (let i = 1; i < headersFirstRow.length; i++) {
    let currentHeader = $(headersFirstRow[i]);
    let colspan = currentHeader.attr('colspan');
    let currentTitle = currentHeader.text().trim();

    if (colspan) {
      for (let j = 0; j < +colspan; j++) {
        headerTitlesFirstRow.push(currentTitle);
      }
    }
    else {
      headerTitlesFirstRow.push(currentTitle);
    }
  }

  // second row
  let headerTitlesSecondRow = [];
  let headersSecondRow = $(rows[1]).find('th');

  for (let i = 0; i < headersSecondRow.length; i++) {
    let currentHeader = $(headersSecondRow[i]);
    let colspan = currentHeader.attr('colspan');
    let currentTitle = currentHeader.text().trim();
    let hasLink = currentHeader.find('a');

    // fix some things
    if (currentTitle == 'N/A') currentTitle = 'Unknown';

    if (hasLink.length) {
      currentTitle = currentHeader.find('a').attr('title');
      if (currentTitle) currentTitle = currentTitle.replace(' Province', '');
    }

    if (colspan) {
      for (let i = 0; i < +colspan; i++) {
        headerTitlesSecondRow.push(currentTitle);
      }
    }
    else {
      headerTitlesSecondRow.push(currentTitle);
    }
  }

  let headers = [];
  for (let i = 0; i < headerTitlesFirstRow.length; i++) {

    headers.push({
      title: headerTitlesFirstRow[i],
      value: headerTitlesSecondRow[i]
    });
  }

  let results = [];

  // data dump
  for (let i = 2; i < rows.length - 2; i++) {
    let currentRow = $(rows[i]).find('td, th');
    let currentDate = $(currentRow[0]).text().trim();

    let resultRow = {
      date: currentDate,
      data: []
    };

    if (currentRow.length == 0) continue;

    currentRow = Array.from(currentRow);
    currentRow.shift();
    //console.log(currentRow.length, Object.keys(headers).length);

    for (let j = 0; j < currentRow.length; j++) {
      let currentCell = $(currentRow[j]).text().trim();
      let cellText = Number.isInteger(+currentCell) ? +currentCell : 0;
      let thisHeader = headers[j];
      let isProvince = thisHeader && typeof thisHeader.title != 'undefined' && thisHeader.title == 'Province';

      if (isProvince) {
        resultRow.data.push({
          name: thisHeader.value,
          total_cases: cellText
        });
      }
      else {
        let name = thisHeader.title + ' ' + (thisHeader.value || '');
        name = name.trim().replace(/ /g, '_').toLowerCase();

        // fix some things
        if (name == 'active_cases_hos.') name = 'active_cases_hospitalized';
        if (name == 'activecases') name = 'active_cases_total';

        if (!name.includes('source(s)') && name != 's') {
          resultRow[name] = cellText;
        }
      }
    }

    // fix some things
    if (typeof resultRow['active_cases_icu'] == 'undefined') resultRow['active_cases_icu'] = 0;
    if (typeof resultRow['active_cases_hospitalized'] == 'undefined') resultRow['active_cases_hospitalized'] = 0;

    results.push(resultRow);
  }

  return results;
}
