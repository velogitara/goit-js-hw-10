export { fetchCountries };

const baseUrl = 'https://restcountries.com/v3.1/name';
const options = 'name,capital,population,flags,languages';
function fetchCountries(name) {
  return fetch(`${baseUrl}/${name}?fields=${options}`).then(r => r.json());
}
