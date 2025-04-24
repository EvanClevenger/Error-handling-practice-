'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
// https://countries-api-836d.onrender.com/countries/

const renderCountry = function (data, classname = '') {
  ////HTML element
  const html = `<article class="country ${classname} ">
   <img class="country__img" src="${data.flags.png}" />
     <div class="country__data">
         <h3 class="country__name">${data.name.common}</h3>
         <h4 class="country__region">${data.region}</h4>
         <p class="country__row"><span>👫</span>${(
           +data.population / 1000000
         ).toFixed(1)}M people </p>
         <p class="country__row"><span>🗣️</span>${
           Object.values(data.languages)[0]
         }</p>
         <p class="country__row"><span>💰</span>${
           Object.values(data.currencies)[0].name
         }</p>
     </div>
   </article>`;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const renderError = function (message) {
  countriesContainer.insertAdjacentText('beforeend', message);
};

// const getCountryAndNeighbour = function (country) {
//   //Ajax call country 1
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
//   request.send();

//   request.addEventListener('load', function () {
//     const [data] = JSON.parse(request.responseText);
//     console.log(data);

//     //render country
//     renderCountry(data);

//     //Get neighbour country
//     const neighbour = data.borders[0];

//     if (!neighbour) return;

//     //Ajax call 2
//     const request2 = new XMLHttpRequest();
//     request2.open('GET', `https://restcountries.com/v3.1/alpha/${neighbour}`);
//     request2.send();

//     request2.addEventListener('load', function () {
//       const [data2] = JSON.parse(request2.responseText);
//       console.log(data2);
//       renderCountry(data2, 'neighbour');
//     });
//   });
// };
// getCountryAndNeighbour('usa');

// const getCountryData = function (country) {
//   fetch(`https://restcountries.com/v3.1/name/${country}`)
//     .then(function (response) {
//       console.log(response);
//       return response.json();
//     })
//     .then(function ([data]) {
//       console.log(data);
//       renderCountry(data);
//     });
// };
// getCountryData('usa');

// const getCountryData = function (country) {
//   //country 1
//   fetch(`https://restcountries.com/v3.1/name/${country}`)
//     .then()
//     .then(data => {
//       renderCountry(data[0]);
//       // const neighbor = data[0].borders[0];
//       const neighbor = 'hahaha';

//       if (!neighbor) return;

//       //country 2
//       return fetch(`https://restcountries.com/v3.1/alpha/${neighbor}`);
//     })
//     .then(response => {
//       if (!response.ok)
//         throw new Error(`Country not found '${response.status}'`);

//       return response.json();
//     })
//     .then(data => renderCountry(data[0], 'neighbour'))
//     .catch(err => {
//       console.error(`${err}`);
//       renderError(`Something went wrong ⛔⛔ ${err.message}. Try again`);
//     })
//     .finally(() => {
//       countriesContainer.style.opacity = 1;
//     });
// };
let lat;
let lng;

const position = function () {
  navigator.geolocation.getCurrentPosition(function (position) {
    lat = position.coords.latitude;
    lng = position.coords.longitude;
    console.log(lat, lng);
  });
};
position();

const whereAmI = function (lat, lng) {
  fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
  )
    .then(res => res.json())
    .then(data => {
      console.log(data);
      console.log(`You are in ${data.city},${data.principalSubdivision}`);
      if (!data) throw new Error(`Your location could not be found`);
      return fetch(`https://restcountries.com/v3.1/alpha/${data.countryCode}`);
    })
    .then(res => res.json())
    .then(data => {
      renderCountry(data[0]);
    })
    .catch(err => {
      console.log(`There was a problem, ${err.message}`);
    });
};

// const getJSON = function (url, errorMsg = 'Something went wrong') {
//   return fetch(url).then(response => {
//     if (!response.ok) throw new Error(`${errorMsg} '${response.status}'`);

//     return response.json();
//   });
// };

// const getCountryData = function (country) {
//   //country 1
//   getJSON(`https://restcountries.com/v3.1/name/${country}`, 'Country not found')
//     .then(data => {
//       renderCountry(data[0]);
//       const borders = data[0].borders;
//       // const neighbor = 'hahaha';
//       if (!borders || borders.length === 0)
//         throw new Error('No neighbor found!');
//       const neighbor = data[0].borders[0];
//       console.log(borders);
//       console.log(neighbor);

//       //country 2
//       return getJSON(
//         `https://restcountries.com/v3.1/alpha/${neighbor}`,
//         'Country not found'
//       );
//     })
//     .then(data => renderCountry(data[0], 'neighbour'))
//     .catch(err => {
//       console.error(`${err}`);
//       renderError(`Something went wrong ⛔ ${err.message} ⛔. Try again`);
//     })
//     .finally(() => {
//       countriesContainer.style.opacity = 1;
//     });
// };

btn.addEventListener('click', function () {
  whereAmI(lat, lng);
});
// getCountryData('ushdf');
