'use strict';
import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchUsers } from './fetchCountries';

const inputCountry = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInformation = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

const drawCountryInfo = ({ name, capital, population, flags, languages }) => {
  const parsedlanguages = languages.map(lang => lang.name).join(', ');
  countryInformation.innerHTML = '';
  countryList.innerHTML = '';
  countryInformation.innerHTML = `<div class = "country-info__box"><img class="img-info" src="${flags.svg}"><a class="country-info__title">${name}</a class ="country-info__link"></div><a class ="country-info__link"><span class ="country-info__span">Capital:</span> ${capital}</a><a class ="country-info__link"><span class ="country-info__span">Population:</span> ${population}</a><a class ="country-info__link"><span class ="country-info__span">Languages:</span> ${parsedlanguages}</a>`;
};

function drawCountryBlock(countries) {
  const countriesArray = countries.map(({ name, flags }) => {
    const countryCard = document.createElement('div');
    countryCard.classList.add('card');
    countryCard.innerHTML = `<img class="img-block" src="${flags.svg}"><a class="country-list-link">${name}</a>`;

    return countryCard;
  });

  countryList.innerHTML = '';
  countryInformation.innerHTML = '';
  countryList.append(...countriesArray);
}

function onlyLetters(str) {
  return /^[a-zA-Z\s ]+$/.test(str);
}

const inputHandler = () => {
  const country = inputCountry.value;

  if (country === '') {
    countryInformation.innerHTML = '';
    countryList.innerHTML = '';
  } else {
    if (onlyLetters(country)) {
      fetchUsers(country)
        .then(countries => {
          if (countries.length > 10) {
            Notiflix.Notify.info(
              'Too many matches found. Please enter a more specific name.'
            );
            return;
          }
          if (countries.length === 1) {
            return drawCountryInfo(countries[0]);
          }
          return drawCountryBlock(countries);
        })
        .catch(() => {
          countryInformation.innerHTML = '';
          countryList.innerHTML = '';
          Notiflix.Notify.failure('Oops, there is no country with that name');
        });
    } else {
      Notiflix.Notify.info('You can use only letters and spaces');
    }
  }
};

inputCountry.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));
