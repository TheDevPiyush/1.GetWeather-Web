import '../Styles/home.css'
import React, { useState, useEffect } from 'react';
import sun from '../Assets/sunny2.jpg'
import rain from '../Assets/rain.jpg'
import mist from '../Assets/mist.jpg'
import cloud from '../Assets/cloud.jpg'
import thunder from '../Assets/thunder.jpg'
import snow from '../Assets/snow.jpg'
import Compass from './Compass';
export default function Home() {
    const [weatherData, setWeatherData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [count, setCount] = useState(0)
    const [background, setBackgraound] = useState('');
    const [condition, setCondition] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [location, setLocation] = useState({ latitude: Math.random() * 80, longitude: Math.random() * 50 })
    const [autocompleteResults, setAutocompleteResults] = useState([]);
    const [show, setShow] = useState(false);

    const fetchWeatherData = async () => {
        setIsLoading(true);
        const url = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${location.latitude}%2C${location.longitude}&days=3`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '72d949d974msh3127b927519e7d0p1bfb7djsn6c36e0cda251',
                'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
            }
        };
        setCount(count + 1)
        console.log(count)

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            setWeatherData(result);
            setIsLoading(false);
            setCondition(result.current.condition.text)

        } catch (error) {
            setError(error);
            setIsLoading(false);
        }
    };

    const changeBackground = () => {
        const lowercaseCondition = condition.toLowerCase();
        console.log(lowercaseCondition)

        if (
            lowercaseCondition.includes("clear") ||
            lowercaseCondition.includes("sunny") ||
            lowercaseCondition.includes("fair")
        ) {
            console.log("It's a clear day.");
            setBackgraound(sun)
        } else if (
            lowercaseCondition.includes("rain") ||
            lowercaseCondition.includes("showers") ||
            lowercaseCondition.includes("drizzle")
        ) {
            console.log("It's raining.");
            setBackgraound(rain)
        } else if (
            lowercaseCondition.includes("cloudy") ||
            lowercaseCondition.includes("overcast") ||
            lowercaseCondition.includes("partly cloudy") ||
            lowercaseCondition.includes("mostly cloudy")
        ) {
            console.log("It's cloudy.");
            setBackgraound(cloud)
        } else if (
            lowercaseCondition.includes("fog") ||
            lowercaseCondition.includes("mist") ||
            lowercaseCondition.includes("haze") ||
            lowercaseCondition.includes("rainy")
        ) {
            console.log("It's foggy.");
            setBackgraound(mist)
        } else if (
            lowercaseCondition.includes("thunderstorm") ||
            lowercaseCondition.includes("storm") ||
            lowercaseCondition.includes("thundery")
        ) {
            console.log("There's a thunderstorm.");
            setBackgraound(thunder)
        } else if (
            lowercaseCondition.includes("snow") ||
            lowercaseCondition.includes("blizzard")
        ) {
            console.log("It's snowing.");
            setBackgraound(snow)
        } else {
            console.log("Unknown weather condition.");
            setBackgraound(cloud)

        }
    }

    const handleInputChange = async (e) => {
        const value = e.target.value;
        setInputValue(value);

        const url = `https://weatherapi-com.p.rapidapi.com/search.json?q=${inputValue}`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '72d949d974msh3127b927519e7d0p1bfb7djsn6c36e0cda251',
                'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            setAutocompleteResults(result)
            console.log(result);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchWeatherData();
    }, []);

    useEffect(() => { changeBackground() }, [weatherData])

    useEffect(() => {
        fetchWeatherData();
    }, [location]);

    const handleSelect = (lat, lon) => {
        setShow(false)
        setLocation({
            latitude: lat, longitude: lon
        });
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <>
            {weatherData && (


                <div className='main'>
                    {show && <div className="searchBtn">
                        <input value={inputValue}
                            onChange={handleInputChange} placeholder='Search City, State, Country or region name' type="text" />
                        <div className="line"></div>
                        <div className="searchedResults">
                            {autocompleteResults && autocompleteResults.length > 0 && (
                                <div className='search'>
                                    {autocompleteResults.map((result, index) => (
                                        <div onClick={() => { handleSelect(result.lat, result.lon) }} className='items' key={index}>{result.name}, {result.region}, {result.country}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>}
                    <img src={`${background}`} alt="" id='image' className='image' />
                    <div className="container">
                        <div className="blur-box1">
                            {isLoading ? <img id='gif' className='gif' src={"https://i.gifer.com/VAyR.gif"} alt="GIF" /> : <div className="txt2">
                                {weatherData.location.name} <span onClick={() => { setShow(!show) }}><i className="fa-regular fa-magnifying-glass-location fa-search"></i></span>
                            </div>}
                            <div className="txt1">
                                {Math.floor(weatherData.current.temp_c)}°
                                <div className="condition">
                                    {condition}
                                </div>
                            </div>
                            <div className="highLow">
                                <div className="high">
                                    H:{Math.floor(weatherData.forecast.forecastday[0].day.maxtemp_c)}°
                                </div>

                                <div className="low">
                                    L:{Math.floor(weatherData.forecast.forecastday[0].day.mintemp_c)}°
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="forecast">
                        <div className="title">
                            Today's Hourly Forecasts
                        </div>
                        <div className='forecast-data'>
                            {weatherData.forecast.forecastday[0].hour.map((hour, index) => (
                                <div className='forecast-container' key={index}>
                                    <div className="data-container">
                                        <div className="time">{hour.time.split(' ')[1]}</div>
                                        <div className="temp">{Math.floor(hour.temp_c)}°</div>
                                        <div className="cond"> {hour.condition.text}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="forecast">
                        <div className="title">
                            Tomorrow's Hourly Forecasts
                        </div>
                        <div className='forecast-data'>
                            {weatherData.forecast.forecastday[1].hour.map((hour, index) => (
                                <div className='forecast-container' key={index}>
                                    <div className="data-container">
                                        <div className="time">{hour.time.split(' ')[1]}</div>
                                        <div className="temp">{Math.floor(hour.temp_c)}°</div>
                                        <div className="cond"> {hour.condition.text}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="wind">
                        <div className="wind-box">
                            <div className="wind-title">Wind</div>
                            <div className="wind-data">
                                <div className="wind-speed">{Math.floor(weatherData.current.wind_kph)}<span id='kph'> KPH</span> </div>
                                <div className="wind-dir">
                                    <span id='wind-txt'>
                                        {weatherData.current.wind_dir}
                                    </span>
                                    <Compass windDirection={weatherData.current.wind_dir} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <p>Feels Like: {weatherData.current.feelslike_c}°C</p>
                </div>
            )}
        </>
    )
}
