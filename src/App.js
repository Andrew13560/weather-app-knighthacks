import "./App.css";
import {
  Container,
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@material-ui/core";

import { useState } from "react";

// Temporary server
// const proxy = "http://cors-anywhere.herokuapp.com/";
const cityURL = "https://www.metaweather.com/api/location/search/?query=";
const woeidURL = "https://www.metaweather.com/api/location/";
const imgURL = "https://www.metaweather.com/static/img/weather/";

function toFarenheit(celcius) {
  return Math.round(celcius * 1.8 + 32);
}

// This function is a component
function App() {
  const [query, setQuery] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  // 0 is default value
  const [num, setNum] = useState(0);

  console.log(query);
  console.log(weatherData);
  // Never do this
  // num = 5

  function onType(event) {
    setQuery(event.target.value);
  }

  function fetchWeatherData() {
    setLoading(true);
    fetch(cityURL + query)
      .then((blob) => blob.json())
      .then((data) => {
        console.log(data);
        const city = data[0];
        const woeid = city.woeid;
        fetch(woeidURL + woeid)
          .then((blob) => blob.json())
          .then((cityData) => {
            console.log(cityData);
            const weeklyWeatherData = cityData.consolidated_weather;
            // [] the 3 items below are part of an array
            const data = weeklyWeatherData.map((day) => {
              const highTemp = toFarenheit(day.max_temp);
              const lowTemp = toFarenheit(day.min_temp);
              const weatherState = day.weather_state_name;
              const abbr = day.weather_state_abbr;
              return { highTemp, lowTemp, weatherState, abbr };
            });
            setLoading(false);
            // Below is an object literal
            setWeatherData(data);
          });
      });
  }

  // can store HTML inside a variable
  let output = null;

  if (loading) {
    output = <CircularProgress />;
  } else if (weatherData !== null) {
    output = <WeeklyForecast weather={weatherData} />;
  }

  return (
    <Container>
      <Box m={5}>
        <form>
          <TextField value={query} label="Enter a city!" onChange={onType} />
          <Button
            variant="contained"
            color="primary"
            onClick={fetchWeatherData}
          >
            Click me!
          </Button>
        </form>
      </Box>
      {output}
    </Container>
  );
}

// using props
function WeeklyForecast(props) {
  return props.weather.map((day) => <DailyForecast weather={day} />);
}

// This function destructures props
function DailyForecast({ weather }) {
  return (
    <Box display="inline-block" m={1}>
      <Card elevation={5}>
        <CardContent>
          {/* {react{object literal}} */}
          <img style={{ height: 140 }} src={imgURL + weather.abbr + ".svg"} />
          <Typography>
            High: {weather.highTemp}°F <br />
            Low: {weather.lowTemp}°F <br />
            Weather: {weather.weatherState} <br />
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default App;
