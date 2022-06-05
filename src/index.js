import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

import { fetchCountries } from './fetchCountries';

const Refs = {
  inputRef: document.querySelector('#search-box'),
  countryListRef: document.querySelector('.country-list'),
  countryInfoRef: document.querySelector('.country-info'),
};
// console.log(Refs.inputRef);

const DEBOUNCE_DELAY = 300;

Refs.inputRef.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  e.preventDefault();
  let inputValue = e.target.value.trim();
  if (inputValue === '') {
    Refs.countryListRef.innerHTML = '';
    Refs.countryInfoRef.innerHTML = '';
    return;
  } else if (inputValue.length == 1) {
    Refs.countryListRef.innerHTML = '';
    Refs.countryInfoRef.innerHTML = '';
  }

  fetchCountries(inputValue)
    .then(result => {
      if (result.length > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
      } else if (result.length >= 2 && result.length <= 10) {
        Refs.countryListRef.innerHTML = '';
        Refs.countryInfoRef.innerHTML = '';
        Refs.countryListRef.innerHTML = createListMarkUp(result);
      } else if ((result.length = 1)) {
        // const countries = result.map(({ flag, name, capital, population, languages }) => {});

        Refs.countryListRef.innerHTML = '';
        Refs.countryInfoRef.innerHTML = createCountryCard(result);
      }
    })
    .catch(err => {
      if (inputValue.length > 0) {
        Refs.countryListRef.innerHTML = '';
        Refs.countryInfoRef.innerHTML = '';
        onError();
      }
    });
}

function createListMarkUp(items) {
  return items
    .map(item => {
      return `<li class="country-list__items"><img src="${item.flags.svg}" alt="${item.name.official}" width='30px' height='20px'>
 <span>${item.name.official}</span></li>`;
    })
    .join('');
}

function createCountryCard(items) {
  return items
    .map(item => {
      return `<div>
        <p class="country-info__line"><img src="${item.flags.svg}" alt="${
        item.name.official
      }" width='30px' height='20px'>
        ${item.name.official}</p>
        <p class="country-info__line"> <span class="keyName">Capital</span>: ${item.capital}</p>
        <p class="country-info__line"> <span class="keyName">Population</span>: ${
          item.population
        }</p>
        <p class="country-info__line"> <span class="keyName">languages</span>: ${Object.values(
          item.languages,
        ).join(', ')}</p>
    </div>`;
    })
    .join('');
}

function onError(err) {
  //   console.log(err);
  Notiflix.Notify.failure('Oops, there is no country with that name');
}
