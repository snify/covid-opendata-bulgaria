# covid-opendata-bulgaria
Open data aggregate about COVID-19 pandemic in Bulgaria
---

Всекидневна информация ще бъде качвана тук.\
Събирането на броят случаи по градове става автиматично на няколко часа.
<br>

Събира се информация за:
* [Статистика за заболели по региони и по дни - /data](/data "API endpoint")
* [Болници лекуващи COVID-19 в България (следва събиране на адреси и телефони) - /docs](/docs/%D0%A1%D0%BF%D0%B8%D1%81%D1%8A%D0%BA%20%D0%B1%D0%BE%D0%BB%D0%BD%D0%B8%D1%86%D0%B8%20COVID-19%20%D0%B2%20%D0%91%D1%8A%D0%BB%D0%B3%D0%B0%D1%80%D0%B8%D1%8F%20-%2027.03.2020%20revision%201.xlsx "Списък с болници")
* Дарителски сметки на болници и други (скоро ще бъде достъпно)
* Лаборатории правещи тестове за COVID-19 (скоро ще бъде достъпно)

<br><br>
## API endpoint info
На това репо в /data има 3 файла, които се генерират автоматично през няколко часа:
* [historical_data.json](/data/historical_data.json) - пълен JSON със случаите по дати и региони
* [latest_data.json](/data/latest_data.json) - кратък JSON с новите случаи за деня по региони и summary за всички до този момент
* [last_update.json](/data/latest_data.json) - timestamp на последно обновяване на репото (случва се само при промени)

Източник на информацията: https://en.wikipedia.org/wiki/Template:2019%E2%80%9320_coronavirus_pandemic_data/Bulgaria_medical_cases
<br><br><br>
*P.S. Съжалявам за промените спрямо оригиналната версия, но източника на данните е друг*
<br><br>
To be updated...

**#stayhome**
