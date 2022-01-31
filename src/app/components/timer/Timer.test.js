import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Timer } from "./Timer";

describe("Timer Component", () => {
  beforeEach(() => {
    /*
     * setting jest fake timer to specific time is important for two reasons. First is consistency of the tests
     * and prevent flakiness due to run in different timezones. Second, <input type="time" /> element set date
     * as default 01.01.1970 Unix Epoch. I prepare a small demo to illustrate the behaviour:
     * https://jsfiddle.net/kjaer/3o8p5n2r/13
     *
     * Setting time begins from 01.01.1970 is brings the advantage of consistently using time functions like getTime()
     */
    jest
      .useFakeTimers("modern")
      .setSystemTime(new Date("Thu, 01 Jan 1970 14:35:26 GMT").getTime());
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("starts clock timer as default", () => {
    const mockSetClock = jest.fn();
    const mockSignal = "";
    const { queryByTestId } = render(
      <Timer setClock={mockSetClock} cityListSignal={mockSignal} />
    );

    jest.advanceTimersByTime(1000);

    const timerInput = queryByTestId("timezoneapp-timer-input");
    const previousTime = timerInput.valueAsDate.getTime();

    jest.advanceTimersByTime(1000);
    const currentTime = timerInput.valueAsDate.getTime();

    expect(currentTime > previousTime).toBeTruthy();
    expect(mockSetClock).not.toHaveBeenCalled();
  });

  it("user can change time value and time stops.", () => {
    const mockSetClock = jest.fn();
    const mockSignal = "";
    const { queryByTestId } = render(
      <Timer setClock={mockSetClock} cityListSignal={mockSignal} />
    );

    const timerInput = queryByTestId("timezoneapp-timer-input");
    userEvent.type(timerInput, "18:00:00");
    const previousTime = timerInput.valueAsDate.getTime();

    // push timers 5 minutes later make sure time value in the input won't change
    jest.advanceTimersByTime(300000);

    const currentTime = timerInput.valueAsDate.getTime();

    expect(currentTime === previousTime).toBeTruthy();
    expect(mockSetClock).toHaveBeenCalledWith(timerInput.valueAsDate);
  });

  it('user can retrieve local time by using "Use Current Time" link', () => {
    const mockSetClock = jest.fn();
    const mockSignal = "";
    const { queryByTestId } = render(
      <Timer setClock={mockSetClock} cityListSignal={mockSignal} />
    );

    const timerInput = queryByTestId("timezoneapp-timer-input");
    userEvent.type(timerInput, "18:00:00");

    expect(timerInput.valueAsDate.getUTCHours()).toEqual(18);
    expect(timerInput.valueAsDate.getUTCMinutes()).toEqual(0);
    expect(timerInput.valueAsDate.getUTCSeconds()).toEqual(0);
    expect(mockSetClock).toHaveBeenCalledWith(timerInput.valueAsDate);

    const currentTimeLink = queryByTestId(
      "timezoneapp-timer-current-time-link"
    );
    userEvent.click(currentTimeLink);

    const clockTime = new Date(Date.now());
    jest.advanceTimersByTime(2000);

    // Current Time link sets the time with timezone offset addition.
    // In order to check it properly, I am gonna substract the timezone offset,
    // Hint, timezoneOffset's value always negative.

    const timeZoneOffset = new Date().getTimezoneOffset() * 60000;
    const UTCTime = new Date(timerInput.valueAsDate.getTime() + timeZoneOffset);

    expect(UTCTime.getUTCHours()).toEqual(14);
    expect(UTCTime.getUTCMinutes()).toEqual(35);
    expect(UTCTime.getUTCSeconds()).toEqual(28);
    expect(mockSetClock).toHaveBeenCalledWith(clockTime);
  });

  it("when new city list change (addition/removal of city) Timer sets the clock", () => {
    const mockSetClock = jest.fn();
    let mockSignal = "";

    const { queryByTestId, rerender } = render(
      <Timer setClock={mockSetClock} cityListSignal={mockSignal} />
    );
    jest.advanceTimersByTime(1000);

    expect(mockSetClock).not.toHaveBeenCalled();

    mockSignal = "TEST-SIGNAL";
    rerender(<Timer setClock={mockSetClock} cityListSignal={mockSignal} />);

    const timerInput = queryByTestId("timezoneapp-timer-input");
    expect(mockSetClock).toHaveBeenCalledWith(timerInput.valueAsDate);
  });
});
