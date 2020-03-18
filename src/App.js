import React, { useState, useEffect } from "react";
import Global from "./Global";
import "./css/style.css";

function useStats(url) {
  const [stats, setStats] = useState();
  useEffect(() => {
    async function fetchData() {
      console.log("Fetching data");
      const data = await fetch(url).then(res => res.json());
      setStats(data);
    }
    fetchData();
  }, []);
  return stats;
}

function GlobalNot() {
  const statsGlobal = useStats("https://covid19.mathdro.id/api/");
  const chart = useStats("https://covid19.mathdro.id/api/daily");

  if (!statsGlobal) return <p className="loading">Loading....</p>;
  if (!chart) return <p className="loading">Loading....</p>;

  let chartData = chart.map(data => data.totalConfirmed);
  console.log(chart[chart.length - 1].deltaConfirmed);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  return (
    <div>
      <h4 className="title">WORLDWIDE</h4>

      <div className="global-wrapper">
        <div className="global-grid">
          <div className="global-stats">
            <p>Confirmed</p>
            <h4 className="infected-val">
              {numberWithCommas(statsGlobal.confirmed.value)}
            </h4>
          </div>

          <div className="global-stats">
            <p>Recovered</p>
            <h4 className="recovered-val">
              {numberWithCommas(statsGlobal.recovered.value)}
            </h4>
          </div>

          <div className="global-stats">
            <p>Deaths</p>
            <h4 className="deaths-val">
              {numberWithCommas(statsGlobal.deaths.value)}
            </h4>
          </div>
        </div>

        <div className="global-daily">
          <small>
            Today confirmed: {chart[chart.length - 1].deltaConfirmed}
          </small>
          <br />
          <small>
            Today recovered: {chart[chart.length - 1].deltaRecovered}
          </small>
        </div>
      </div>
    </div>
  );
}

function Stats() {
  const format = require("date-format");
  const stats = useStats("https://covid19.mathdro.id/api/countries/ID");
  const statsGlobal = useStats("https://covid19.mathdro.id/api/");

  if (!stats) return <p className="loading">Loading....</p>;
  if (!statsGlobal) return <p className="loading">Loading....</p>;

  return (
    <div>
      <main>
        <Global></Global>

        <h4>INDONESIA</h4>
        <div className="desktop-flex">
          <div className="stats-wrapper infected">
            <p>Confirmed:</p>
            <h4 className="infected-val">{stats.confirmed.value}</h4>
          </div>

          <div className="stats-wrapper recovered">
            <p>Recovered:</p>
            <h4 className="recovered-val">{stats.recovered.value}</h4>
          </div>

          <div className="stats-wrapper deaths">
            <p>Deaths:</p>
            <h4 className="deaths-val">{stats.deaths.value}</h4>
          </div>
        </div>
      </main>

      <footer>
        <p>Last update</p>
        <p>
          Worldwide:{" "}
          {format.asString(
            "dd-MM-yyyy hh:mm:ss",
            new Date(statsGlobal.lastUpdate)
          )}{" "}
          WIB
        </p>
        <p>
          Indonesia:{" "}
          {format.asString("dd-MM-yyyy hh:mm:ss", new Date(stats.lastUpdate))}{" "}
          WIB
        </p>
        <small>raharditya.com</small>
      </footer>
    </div>
  );
}

function App() {
  return (
    <body>
      <div className="page-wrapper">
        <header>
          <h3>COVID-19 Monitor</h3>
        </header>

        <Stats></Stats>
      </div>
    </body>
  );
}

export default App;
