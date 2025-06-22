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

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(
      position => resolve(position),
      err => reject(err),
      navigator.geolocation.getCurrentPosition(resolve, reject)
    );
  });
};
getPosition();

//old way of using promises
// const whereAmI = function () {
//   getPosition()
//     .then(pos => {
//       const { latitude: lat, longitude: lng } = pos.coords;

//       return fetch(
//         `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
//       );
//     })
//     .then(res => res.json())
//     .then(data => {
//       console.log(data);
//       console.log(`You are in ${data.city},${data.principalSubdivision}`);
//       if (!data) throw new Error(`Your location could not be found`);
//       return fetch(`https://restcountries.com/v3.1/alpha/${data.countryCode}`);
//     })
//     .then(res => res.json())
//     .then(data => {
//       renderCountry(data[0]);
//     })
//     .catch(err => {
//       console.log(`There was a problem, ${err.message}`);
//     });
// };

const whereAmI = async function () {
  try {
    const position = await getPosition(); //gets users current position

    const { latitude: lat, longitude: lng } = await position.coords; //takes users coordinates from position()

    const getCity = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}` // uses API to reverse geocode and get user exact postion
    );
    const cityData = await getCity.json(); // parses getCity to usable json

    const getCountry = await fetch(
      `https://restcountries.com/v3.1/alpha?codes=${cityData.countryCode}` //uses 2nd API to get country info
    );
    const countryData = await getCountry.json(); //parses 2nd API data to usable json()

    renderCountry(countryData[0]);

    btn.style.display = 'none';
  } catch (err) {
    console.error(`There was a issue getting your data: ${err}`);
  }
};

btn.addEventListener('click', function () {
  whereAmI();
});
