function dumpTable(index = 0) {

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
    //console.log(headerTitlesFirstRow[i]  + ',' + headerTitlesSecondRow[i]);
  }

  let results = [];

  // data dump
  for (let i = 2; i < rows.length - 2; i++) {
    let currentRow = $(rows[i]).find('td');
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
