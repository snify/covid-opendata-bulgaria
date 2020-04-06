# covid-opendata-bulgaria
open data aggregate about COVID-19 pandemic in Bulgaria
---

Всекидневна информация ще бъде качвана тук.\
Събирането на броят случаи по градове става автоматично на 30 минути.
<br>

Събира се информация за:
* [Статистика за заболели по региони и по дни - /data](/data "API endpoint")
* [Болници лекуващи COVID-19 в България (следва събиране на адреси и телефони) - /docs](/docs/%D0%A1%D0%BF%D0%B8%D1%81%D1%8A%D0%BA%20%D0%B1%D0%BE%D0%BB%D0%BD%D0%B8%D1%86%D0%B8%20COVID-19%20%D0%B2%20%D0%91%D1%8A%D0%BB%D0%B3%D0%B0%D1%80%D0%B8%D1%8F%20-%2027.03.2020%20revision%201.xlsx "Списък с болници")
* Дарителски сметки на болници и други (скоро ще бъде достъпно)
* Лаборатории правещи тестове за COVID-19 (скоро ще бъде достъпно)

<br><br>
## API endpoints
На това репо в /data има 3 файла, които се генерират автоматично през 30 минути:
* [/data/historical_data.json](https://raw.githubusercontent.com/snify/covid-opendata-bulgaria/master/data/historical_data.json) - пълен JSON със случаите по дати и региони
* [/data/latest_data.json](https://raw.githubusercontent.com/snify/covid-opendata-bulgaria/master/data/latest_data.json) - кратък JSON с новите случаи за деня по региони и summary за всички до този момент
* [/data/last_update.json](https://raw.githubusercontent.com/snify/covid-opendata-bulgaria/master/data/last_update.json) - timestamp на последно обновяване на репото (случва се само при промени)


<br><br>
**Примерен резултат от [/data/latest_data.json](https://raw.githubusercontent.com/snify/covid-opendata-bulgaria/master/data/latest_data.json):**
```js
{
  "date": "06-04-2020",            // DD-MM-YYYY формат
  "data": [                        // array
    {
      "name": "Sofia City",        // Име на областта
      "total_cases": 10            // Брой случаи за деня
    }
  ],
  "confirmed_cases_new": 10,       // Потвърдени нови случаи за деня
  "confirmed_cases_total": 541,    // Тотал потвърдени случаи до момента
  "deaths_new": 1,                 // Брои смъртни случаи за деня
  "deaths_total": 21,              // Тотал смъртни случаи до момента
  "recoveries_new": 2,             // Брои възстановени за деня
  "recoveries_total": 39,          // Тотал възстановени до момента
  "active_cases_total": 481,       // Активни случаи в момента
  "active_cases_icu": 22,          // Активни хоспитализирани случаи (критични)
  "active_cases_hospitalized": 210 // Активни хоспитализирани случаи (тотал)
}
```

[/data/historical_data.json](https://raw.githubusercontent.com/snify/covid-opendata-bulgaria/master/data/historical_data.json) е в същият формат, но под формата на лист.
За разлика от [/data/latest_data.json](https://raw.githubusercontent.com/snify/covid-opendata-bulgaria/master/data/latest_data.json) там има и области с `total_cases: 0` за деня.
Това е с цел да има списък от всички засегнати градове (т.е. точно както е в таблицата от Wikipedia).
Нулевите резултати са филтрирани за [/data/latest_data.json](https://raw.githubusercontent.com/snify/covid-opendata-bulgaria/master/data/latest_data.json)


Източник на информацията: https://en.wikipedia.org/wiki/Template:2019%E2%80%9320_coronavirus_pandemic_data/Bulgaria_medical_cases
<br><br><br>
*P.S. Съжалявам за промените спрямо оригиналната версия, но източника на данните е друг*
<br><br>
To be updated...

**#stayhome**
