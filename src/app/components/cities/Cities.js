import { useState } from "react";

import { CityList } from "./CityList";
import { CitySearchForm } from "./CitySearchForm";

export function Cities(props) {
  const { clock, invokeCityListChange } = props;
  const [city, setCity] = useState(null);

  return (
    <>
      <CitySearchForm citySelectCallback={setCity} />
      <br />
      <CityList
        newCity={city}
        clock={clock}
        cityListChangeCallback={invokeCityListChange}
      />
    </>
  );
}
