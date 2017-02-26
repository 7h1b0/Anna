const Rx = require('rxjs');
const requestService = require('./requestService');
const params = require('../../config.json').weather;

module.exports = () => {
  let currentWeather = { main: { temp: params.defaultTemperature } };

  function getTemperature() {
    return currentWeather.main.temp;
  }

  function retrieveWeather() {
    Rx.Observable.fromPromise(requestService.get(`http://api.openweathermap.org/data/2.5/weather?id=${params.idCity}&units=metric&appid=${params.apiKey}`))
      .retryWhen(errors => errors.zip(Rx.Observable.range(1, 2), (n) => n).delay(params.retryDelay))
      .subscribe(
        res => currentWeather = res,
        err => console.error(err)
      );
  };

  setInterval(retrieveWeather, params.refreshDelay);

  return { getTemperature };
};
