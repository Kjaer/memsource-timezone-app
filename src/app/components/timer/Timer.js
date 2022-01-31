import { useEffect, useRef, useState } from "react";

import * as styles from "./Timer.module.css";

export function Timer(props) {
  const { setClock, cityListSignal } = props;
  const [timerFlag, setTimerFlag] = useState(true);
  const timeInputRef = useRef(null);

  useEffect(() => {
    let clock = null;

    /*
     * I decided to create clock using `<input type="time />` `valueAsDate` property.
     * By doing so, I am keep updating the time with using DOM API, and avoid re-renders
     * would cause by every second change. It also saved me from keeping the time value
     * as string in the state and maintaining of increasing second, converting from string to date and vice versa.
     * */
    if (timerFlag) {
      const timeZoneOffset = new Date().getTimezoneOffset() * 60000;
      clock = setInterval(() => {
        const localTime = new Date(Date.now() - timeZoneOffset);
        localTime.setMilliseconds(0);
        timeInputRef.current.valueAsDate = localTime;
      }, 1000);
    }

    if (!timerFlag && clock) {
      clearInterval(clock);
    }

    return () => {
      clearInterval(clock);
    };
  }, [timerFlag]);

  useEffect(() => {
    if (cityListSignal) {
      setClock(timeInputRef.current.valueAsDate);
    }
  }, [cityListSignal]);

  const setCurrentTime = () => {
    setTimerFlag(true);
    setClock(new Date(Date.now()));
  };

  const timeInputHandler = (event) => {
    setTimerFlag(false);
    setClock(event.target.valueAsDate);
  };

  return (
    <form className={styles.timerForm}>
      <label>Enter Time:</label>
      <input
        type="time"
        step={1}
        ref={timeInputRef}
        onChange={timeInputHandler}
        data-testid="timezoneapp-timer-input"
      />
      <a
        href="#"
        onClick={setCurrentTime}
        data-testid="timezoneapp-timer-current-time-link"
      >
        Use current time
      </a>
    </form>
  );
}
