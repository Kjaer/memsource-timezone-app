import { render, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockCities from "../../../api/mock/city-timezone.json";

import { CitySearchForm } from "./CitySearchForm";

jest.mock("../../../api/city-timezone", () => {
  return {
    getCitySuggestions: jest.fn(() => {
      const { records } = mockCities;
      return Promise.resolve({ records });
    }),
  };
});

describe("City Search Component", () => {
  it("Brings city list based on the query from city suggestion api", async () => {
    const mockSetCity = jest.fn();

    const { queryByTestId } = render(
      <CitySearchForm citySelectCallback={mockSetCity} />
    );

    expect(queryByTestId("timezoneapp-city-search-form-city-list")).toBeNull();

    const citySearchInput = queryByTestId(
      "timezoneapp-city-search-form-city-input"
    );

    userEvent.type(citySearchInput, "tok");

    await waitFor(() => {
      expect(
        queryByTestId("timezoneapp-city-search-form-city-list")
      ).toBeVisible();
    });
  });

  it("clears the city search input with clear button next to input", async () => {
    const mockSetCity = jest.fn();

    const { queryByTestId, queryAllByTestId } = render(
      <CitySearchForm citySelectCallback={mockSetCity} />
    );

    const citySearchInput = queryByTestId(
      "timezoneapp-city-search-form-city-input"
    );

    await act(async () => {
      userEvent.type(citySearchInput, "tok");
    });

    const citySuggestionLink = queryAllByTestId(
      "timezoneapp-city-search-form-city-suggestion-item"
    )[0];

    userEvent.click(citySuggestionLink);

    expect(citySearchInput.value).toBe("Tokat");

    const clearInputButton = queryByTestId(
      "timezoneapp-city-search-form-clear-city-button"
    );
    userEvent.click(clearInputButton);

    expect(citySearchInput.value).toBe("");
  });

  it("call city callback with the selected city on form submit", async () => {
    const mockSetCity = jest.fn();

    const { queryByTestId, queryAllByTestId } = render(
      <CitySearchForm citySelectCallback={mockSetCity} />
    );

    const citySearchInput = queryByTestId(
      "timezoneapp-city-search-form-city-input"
    );

    await act(async () => {
      userEvent.type(citySearchInput, "tok");
    });

    const citySuggestionLink = queryAllByTestId(
      "timezoneapp-city-search-form-city-suggestion-item"
    )[0];

    userEvent.click(citySuggestionLink);

    const submitButton = queryByTestId(
      "timezoneapp-city-search-form-submit-button"
    );

    userEvent.click(submitButton);

    const chosenCity = {
      name: "Tokat",
      country: "Turkey",
      countryCode: "TR",
      id: "9055773625f4b1cc39f3a69e9d56b9b4c6f633cc",
      timezone: "Europe/Istanbul",
    };

    expect(mockSetCity).toHaveBeenCalledWith(chosenCity);
  });
});
