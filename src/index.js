import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const inputItem = document.querySelector('input[id="search-box"]');
const listItem = document.querySelector('.country-list');
const infoItem = document.querySelector('.country-info');
inputItem.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput() {
  if (inputItem.value.trim() === '') {
    infoItem.innerHTML = '';
    listItem.innerHTML = '';
    return;
  }
  fetchCountries(inputItem.value.trim())
    .then(countries => {
      if (countries.length === 1) {
        createCountryInfo(countries);
        listItem.innerHTML = '';
      } else if (countries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        listItem.innerHTML = '';
        infoItem.innerHTML = '';
      } else if (countries.length >= 2 && countries.length <= 10) {
        createCountryList(countries);
        infoItem.innerHTML = '';
      }
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      infoItem.innerHTML = '';
      listItem.innerHTML = '';
    });
}

function createCountryInfo(countries) {
  const markup = countries
    .map(country => {
      return `<div>
    <img src="${country.flags.svg}" alt="flag" width="20" height="20">
    <h2 class="text">${country.name.official}</h2>
    <p><span class="text">Capital: </span>${country.capital}</p>
    <p><span class="text">Population: </span>${country.population}</p>
    <p><span class="text">Languages: </span>${Object.values(
      country.languages
    )}</p>
  </div>`;
    })
    .join('');
  infoItem.innerHTML = markup;
}

function createCountryList(countries) {
  const markup = countries
    .map(country => {
      return `<li>
    <img src="${country.flags.svg}" alt="flag" width="20" height="20">
    <p class="flag-text">${country.name.official}</p>
  </li>`;
    })
    .join('');
  listItem.innerHTML = markup;
}
