import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { locale } from "../../../common-utils/settings";

import { CityList } from "./CityList";

describe("City List Component", () => {
  const mockCity = {
    name: "Tokat",
    country: "Turkey",
    countryCode: "TR",
    id: "9055773625f4b1cc39f3a69e9d56b9b4c6f633cc",
    timezone: "Europe/Istanbul",
  };

  beforeEach(() => {
    /*
     * setting jest fake timer to specific time is important for
     * keeping the tests consistent and prevent flakiness due to run in different timezones
     */
    jest
      .useFakeTimers("modern")
      .setSystemTime(new Date("Thu, 01 Jan 1970 14:35:26 GMT").getTime());
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("receives new cities  from its parent and add it to list", () => {
    const mockCityListChange = jest.fn();
    const mockClock = new Date();

    const { queryByTestId } = render(
      <CityList
        newCity={mockCity}
        clock={mockClock}
        cityListChangeCallback={mockCityListChange}
      />
    );

    const cityItem = queryByTestId("timezoneapp-city-list-table-item");
    expect(cityItem).toBeInTheDocument();
  });

  it("emits a signal when new city added or city removed form list", () => {
    const mockCityListChange = jest.fn();
    const mockClock = new Date();

    const { queryByTestId } = render(
      <CityList
        newCity={mockCity}
        clock={mockClock}
        cityListChangeCallback={mockCityListChange}
      />
    );

    expect(mockCityListChange).toHaveBeenCalled();

    const removeCityButton = queryByTestId(
      "timezoneapp-city-list-table-remove-city-button"
    );
    userEvent.click(removeCityButton);

    expect(mockCityListChange).toHaveBeenCalledTimes(2);
  });

  it("receives new clock and updates cities' clock accordingly.", () => {
    const mockCityListChange = jest.fn();
    const mockClock = new Date();

    const { queryAllByTestId, rerender } = render(
      <CityList
        newCity={mockCity}
        clock={mockClock}
        cityListChangeCallback={mockCityListChange}
      />
    );

    // push time 5 minutes later and simulate adding second, new city
    jest.advanceTimersByTime(300000);

    const secondCity = {
      name: "Tokmok",
      country: "Kyrgyzstan",
      countryCode: "KG",
      id: "3d6ec64b15e72b2612e71ce1fcc6ca5133c9f068",
      timezone: "Asia/Bishkek",
    };

    const secondClock = new Date();

    rerender(
      <CityList
        newCity={secondCity}
        clock={secondClock}
        cityListChangeCallback={mockCityListChange}
      />
    );

    const clocks = queryAllByTestId(
      "timezoneapp-city-list-table-city-item-clock"
    );

    expect(clocks[0].textContent).toBe(
      secondClock.toLocaleTimeString(locale, {
        timeZone: mockCity.timezone,
        hour: "2-digit",
        minute: "2-digit",
      })
    );

    expect(clocks[1].textContent).toBe(
      secondClock.toLocaleTimeString(locale, {
        timeZone: secondCity.timezone,
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  });
});
