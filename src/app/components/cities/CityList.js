import { useEffect, useState } from "react";
import { locale } from "../../../common-utils/settings";

import * as styles from "./Cities.module.css";

export function CityList(props) {
  const { newCity, clock, cityListChangeCallback } = props;
  const [cityTable, setCityTable] = useState([]);

  useEffect(() => {
    if (!newCity) {
      return;
    }

    setCityTable((prevCities) => [
      ...prevCities,
      {
        id: newCity.id,
        name: newCity.name,
        timezone: newCity.timezone,
        time: function (clock) {
          return clock.toLocaleTimeString(locale, {
            timeZone: this.timezone,
            hour: "2-digit",
            minute: "2-digit",
          });
        },
      },
    ]);

    //credit for generating random string: https://stackoverflow.com/a/50901817/5018572
    cityListChangeCallback(btoa(Math.random().toString()).substr(10, 5));
  }, [newCity]);

  function removeChosenCity(removingCity) {
    const newCityTable = cityTable.filter(
      (city) => city.id !== removingCity.id
    );

    setCityTable(newCityTable);
    cityListChangeCallback(btoa(Math.random().toString()).substr(10, 5));
  }

  if (cityTable.length === 0) {
    return null;
  }

  return (
    <table className={styles.cityTable}>
      <thead>
        <tr>
          <th colSpan={4}> C I T I E S </th>
        </tr>
      </thead>
      <tbody>
        {cityTable.map((city) => (
          <tr key={city.id} data-testid="timezoneapp-city-list-table-item">
            <td>{city.name}</td>
            <td data-testid="timezoneapp-city-list-table-city-item-clock">
              {city.time(clock)}
            </td>
            <td>{city.timezone}</td>
            <td>
              <a
                href="#"
                onClick={(e) => removeChosenCity(city)}
                data-testid="timezoneapp-city-list-table-remove-city-button"
              >
                <strong className={styles.removeBtn}>&times;</strong>
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
