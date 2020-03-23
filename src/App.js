import React, { useState, useEffect } from "react";
import Global from "./Global";
import Chart from "./Chart";
import "./css/style.css";

function useStats(url) {
  const [stats, setStats] = useState();
  useEffect(() => {
    async function fetchData() {
      const data = await fetch(url).then(res => res.json());
      setStats(data);
    }
    fetchData();
  }, [url]);
  return stats;
}

function useChart() {
  const [chart, setChart] = useState();
  useEffect(() => {
    async function fetchData() {
      const data = await fetch(
        "https://indonesia-covid-19.mathdro.id/api/harian"
      ).then(res => res.json());
      setChart(data);
    }
    fetchData();
  }, []);

  // if (!chart) return <p className="loading">Loading....</p>;

  const chartArray = chart.data.map(active => [
    active.fid,
    active.jumlahpasiendalamperawatan
  ]);

  return chartArray;
}

function Stats() {
  const [drop, setDrop] = useState(false);

  const format = require("date-format");
  const stats = useStats("https://indonesia-covid-19.mathdro.id/api/harian");
  const stats2 = useStats("https://indonesia-covid-19.mathdro.id/api/");
  const statsGlobal = useStats("https://covid19.mathdro.id/api/");
  const exchange = useStats(
    "https://openexchangerates.org/api/latest.json?app_id=54c9fa765c4b4c49840a06ef6142e6d1"
  );

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function changeClass() {
    setDrop(!drop);
  }

  if (!stats2) return <p className="loading">Loading....</p>;
  if (!stats) return <p className="loading">Loading....</p>;
  if (!statsGlobal) return <p className="loading">Loading....</p>;
  if (!exchange) return <p className="loading">Loading....</p>;

  // console.log(chartArray);

  return (
    <div>
      <main>
        <Global></Global>

        <h4>INDONESIA</h4>

        <Chart></Chart>

        <div className="desktop-flex">
          <div className="stats-wrapper infected">
            <p>Confirmed:</p>
            <h4 className="infected-val">{stats2.jumlahKasus}</h4>
            <small>
              Today:{" "}
              {stats.data[stats.data.length - 1].jumlahKasusBaruperHari != null
                ? stats.data[stats.data.length - 1].jumlahKasusBaruperHari
                : "0"}
            </small>
          </div>

          <div className="stats-wrapper recovered">
            <p>Recovered:</p>
            <h4 className="recovered-val">{stats2.sembuh}</h4>
            <small>
              Active:{" "}
              {stats.data[stats.data.length - 1].jumlahpasiendalamperawatan !=
              null
                ? stats.data[stats.data.length - 1].jumlahpasiendalamperawatan
                : stats.data[stats.data.length - 2].jumlahpasiendalamperawatan}
            </small>
          </div>

          <div className="stats-wrapper deaths">
            <p>Deaths:</p>
            <h4 className="deaths-val">{stats2.meninggal}</h4>
            <small>
              Today:{" "}
              {stats.data[stats.data.length - 1].jumlahPasienMeninggal != null
                ? stats.data[stats.data.length - 1].jumlahPasienMeninggal -
                  stats.data[stats.data.length - 2].jumlahPasienMeninggal
                : "0"}
            </small>
          </div>
        </div>

        <h3 className="province-title">Cases by Province</h3>

        <div className={"province-wrapper " + drop}>
          <StatsProvince></StatsProvince>
        </div>

        <p onClick={changeClass} className="province-more">
          {drop ? "View less" : "View more"}
        </p>

        <div className="exchange">
          <small>$1 USD = </small>
          <h4>Rp {numberWithCommas(exchange.rates.IDR)}</h4>
        </div>
      </main>

      <footer>
        <p>Last update:</p>
        <p>
          {format.asString(
            "dd-MM-yyyy hh:mm:ss",
            new Date(statsGlobal.lastUpdate)
          )}{" "}
          WIB
        </p>
        <small>raharditya.com</small>
      </footer>
    </div>
  );
}

function StatsProvince() {
  const statsProvince = useStats(
    "https://indonesia-covid-19.mathdro.id/api/provinsi"
  );

  if (!statsProvince) return <p className="loading">Loading....</p>;

  const provinceArray = Array.from(statsProvince.data);

  const provinceOutput = provinceArray.map(prov => {
    return (
      <div className="province" key={prov.kodeProvinsi}>
        <p>{prov.provinsi}</p>
        <div className="province-stats">
          <h4 className="infected-val invected-province">{prov.kasusPosi}</h4>
          <h4 className="recovered-val recovered-province">{prov.kasusSemb}</h4>
          <h4 className="deaths-val deaths-province">{prov.kasusMeni}</h4>
        </div>
      </div>
    );
  });

  return provinceOutput;
}

function App() {
  return (
    <div className="page-wrapper">
      <header>
        <h3>COVID-19 Monitor</h3>
      </header>

      <Stats></Stats>
    </div>
  );
}

export default App;
