import { useState } from "react";
import { throttle, debounce } from "throttle-debounce";
import { getCitySuggestions } from "../../../api/city-timezone";

import * as styles from "./Cities.module.css";

export function CitySearchForm(props) {
  const { citySelectCallback } = props;
  const [cityInput, setCityInput] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [chosenCity, setChosenCity] = useState(null);

  function submitCity(event) {
    event.preventDefault();

    citySelectCallback(chosenCity);
  }

  async function citySearch(keyWord) {
    const { records: citySuggestions } = await getCitySuggestions(keyWord);

    const cities = citySuggestions.map((city) => ({
      name: city.fields.name,
      country: city.fields.label_en,
      countryCode: city.fields.country_code,
      id: city.recordid,
      timezone: city.fields.timezone,
    }));

    setCitySuggestions(cities);
  }

  const autocompleteSearchDebounced = debounce(500, citySearch);
  const autocompleteSearchThrottled = throttle(500, citySearch);

  const cityInputHandler = (event) => {
    const query = event.target.value;

    /* I follow the technique described here: https://www.peterbe.com/plog/how-to-throttle-and-debounce-an-autocomplete-input-in-react
     * to simply explain by the owners words:
     * > we're going to use throttle (the eager one) in the beginning when the input is short and debounce (the patient one)
     * > when user has ignored the first autocomplete inputs and starting typing something longer.
     * > if you, in a steady pace typed in "south carolina" you'd notice that it does autocomplete lookups for "s", "sout" and "south carolina".
     * > Demo: https://codesandbox.io/s/q26rj8o6j
     */
    if (query.length < 5) {
      autocompleteSearchThrottled(query);
    } else {
      autocompleteSearchDebounced(query);
    }

    setCityInput(query);
  };

  function pickCity(city) {
    setCityInput(city.name);
    setChosenCity(city);
    setCitySuggestions([]);
  }

  function clearCityInput() {
    setCityInput("");
    setChosenCity(null);
    setCitySuggestions([]);
  }

  return (
    <form
      className={styles.citySearchForm}
      onSubmit={submitCity}
      data-testid="timezoneapp-city-search-form"
    >
      <label>Enter City Name:</label>
      <div className={styles.searchInputWrapper}>
        <input
          type="text"
          onChange={cityInputHandler}
          value={cityInput}
          data-testid="timezoneapp-city-search-form-city-input"
        />
        <a
          href="#"
          className={styles.clearCityInput}
          onClick={clearCityInput}
          data-testid="timezoneapp-city-search-form-clear-city-button"
        >
          &times;
        </a>
      </div>

      {cityInput.length > 0 && citySuggestions.length > 0 && (
        <ul
          className={styles.citySuggestionList}
          data-testid="timezoneapp-city-search-form-city-list"
        >
          {citySuggestions.map((city) => (
            <li key={city.id}>
              <a
                href="#"
                onClick={() => pickCity(city)}
                data-testid="timezoneapp-city-search-form-city-suggestion-item"
              >
                {city.name}, {city.country}
              </a>
            </li>
          ))}
        </ul>
      )}

      <button
        type="submit"
        data-testid="timezoneapp-city-search-form-submit-button"
      >
        Add to list
      </button>
    </form>
  );
}
