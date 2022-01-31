import { useState } from "react";

import { Timer } from "./components/timer/Timer";
import { Cities } from "./components/cities/Cities";

import * as styles from "./App.module.css";

export function App() {
  const [clock, setClock] = useState(new Date(Date.now()));
  const [cityListChangeSignal, setSignal] = useState("");

  return (
    <>
      <header className={styles.appTitle}>
        <h1>Timezone Converter</h1>
      </header>

      <section className={styles.appContent}>
        <article className={styles.sideBar}>
          <h2>Local time:</h2>
          <Timer setClock={setClock} cityListSignal={cityListChangeSignal} />
        </article>

        <article className={styles.content}>
          <h2>City clocks:</h2>
          <Cities clock={clock} invokeCityListChange={setSignal} />
        </article>
      </section>
    </>
  );
}
