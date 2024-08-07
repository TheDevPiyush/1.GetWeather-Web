import '../Styles/home.css'
import React, { useState, useEffect, useRef } from 'react';
import sun from '../Assets/sunny2.jpg'
import rain from '../Assets/rain.jpg'
import mist from '../Assets/mist.jpg'
import cloud from '../Assets/cloud.jpg'
import thunder from '../Assets/thunder.jpg'
import snow from '../Assets/snow.jpg'
import defaultPic from '../Assets/default.png'
import Compass from './Compass';
export default function Home() {
    const [weatherData, setWeatherData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [error, setError] = useState(null);
    const [background, setBackgraound] = useState('');
    const [condition, setCondition] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [location, setLocation] = useState({ latitude: 0, longitude: 0 })
    const [autocompleteResults, setAutocompleteResults] = useState([]);
    const [show, setShow] = useState(false);
    const inputRef = useRef(null)
    const modalRef = useRef(null);
    const [clearBtn, setClearBtn] = useState(false)
    const [saveModal, setsaveModal] = useState(false)

    const fetchWeatherData = async () => {
        setIsLoading(true);

        const url = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${location.latitude}%2C${location.longitude}&days=3`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'YOUR_API_KEY',
                'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
            }
        };

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

        if (
            lowercaseCondition.includes("clear") ||
            lowercaseCondition.includes("sunny") ||
            lowercaseCondition.includes("fair")
        ) {
            setBackgraound(sun)
        } else if (
            lowercaseCondition.includes("rain") ||
            lowercaseCondition.includes("showers") ||
            lowercaseCondition.includes("drizzle")
        ) {
            setBackgraound(rain)
        } else if (
            lowercaseCondition.includes("cloudy") ||
            lowercaseCondition.includes("overcast") ||
            lowercaseCondition.includes("partly cloudy") ||
            lowercaseCondition.includes("mostly cloudy")
        ) {
            setBackgraound(cloud)
        } else if (
            lowercaseCondition.includes("fog") ||
            lowercaseCondition.includes("mist") ||
            lowercaseCondition.includes("haze") ||
            lowercaseCondition.includes("rainy")
        ) {
            setBackgraound(mist)
        } else if (
            lowercaseCondition.includes("thunderstorm") ||
            lowercaseCondition.includes("storm") ||
            lowercaseCondition.includes("thundery")
        ) {
            setBackgraound(thunder)
        } else if (
            lowercaseCondition.includes("snow") ||
            lowercaseCondition.includes("blizzard")
        ) {
            setBackgraound(snow)
        } else {
            setBackgraound(defaultPic)
        }
    }

    const handleInputChange = async (e) => {
        const value = e.target.value
        setInputValue(value);
        value.length >= 1 ? setClearBtn(true) : setClearBtn(false)

    }

    const fetchSuggestions = async () => {
        setIsLoadingSuggestions(true)
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
            setIsLoadingSuggestions(false)

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchSuggestions();
        }, 1500);

        return () => clearTimeout(delayDebounce);
    }, [inputValue])

    useEffect(() => { changeBackground() },
        [weatherData])
    useEffect(() => {
        changeBackground()
    }, [])

    useEffect(() => {
        const savedLat = localStorage.getItem("lat");
        const savedLon = localStorage.getItem("lon");

        if (savedLat && savedLon) {
            setLocation({ latitude: parseFloat(savedLat), longitude: parseFloat(savedLon) });
        } else {
            setLocation({ latitude: Math.random() * 80, longitude: Math.random() * 50 });
        }
    }, []);
    useEffect(() => {
        if (location.latitude !== 0 || location.longitude !== 0) {
            fetchWeatherData();
        }
    }, [location]);


    const handleSelect = (lat, lon) => {
        setShow(false)
        setLocation({
            latitude: lat, longitude: lon
        });
    }
    const handleSearchBtn = () => {
        setShow(!show);
        setTimeout(() => {
            if (!show) { inputRef.current.focus(); }
        }, 150);
    }

    const handleSavelocation = (data) => {
        if (data === "yes") {
            localStorage.setItem("lat", location.latitude)
            localStorage.setItem("lon", location.longitude)
            setsaveModal(false)
        }
        else {
            setsaveModal(false)
        }
    }


    if (error) {
        return <div className='error'>
            <div className="text">
                <i class="fa-sharp fa-regular fa-bug"></i> <br />
                Oops! Ran into some bugs. Please refresh.
            </div>
            <div className="msg">
                It's not you. It's us. <i class="fa-light fa-face-frown-slight"></i>
            </div>
        </div>;
    }

    return (
        <>
            {weatherData && (


                <div className='main'>
                    {show &&
                        <div className="modal-container">
                            <div className="modal" onClick={() => { setShow(!show) }}>
                            </div>
                            <div ref={modalRef} className="searchBtn">
                                <div className="input-container">
                                    <input value={inputValue}
                                        onChange={handleInputChange} ref={inputRef} placeholder='Search City, State, Country...' type="text" />

                                    {!isLoadingSuggestions ? <div className="clear">
                                        {clearBtn && <i class="fas fa-plus" onClick={() => {
                                            setInputValue(""); inputRef.value = ""; setClearBtn(false); setTimeout(() => {
                                                inputRef.current.focus();
                                            }, 150);
                                        }}></i>}
                                    </div>
                                        :
                                        <div className="load-suggestion">
                                            <img id='gif' className='gif' src={"https://i.gifer.com/VAyR.gif"} alt="GIF" />
                                        </div>}
                                </div>
                                <div className="line"></div>
                                <div className="searchedResults">
                                    {autocompleteResults && autocompleteResults.length > 0 ?
                                        (
                                            <div className='search'>
                                                {autocompleteResults.map((result, index) => (
                                                    <div onClick={() => { handleSelect(result.lat, result.lon) }} className='items' key={index}>{result.name}, {result.region}, {result.country}</div>
                                                ))}
                                            </div>
                                        )
                                        : <div className="note">Search locations,    you'll see results here.</div>
                                    }
                                </div>
                            </div>
                        </div>}

                    {saveModal && <div className="saveModal" onClick={() => { setsaveModal(false) }}>
                        <div className="askContainer">
                            Do you want to pin <span id='modal-name'> {weatherData.location.name} </span> as your default location?
                            <div className="modal-btns">
                                <div className="noBtn btns" onClick={() => { handleSavelocation("no") }}>No</div>
                                <div className="middleBorder"></div>
                                <div className="yesbtn btns" onClick={() => { handleSavelocation("yes") }}>Yes</div>
                            </div>
                        </div>
                    </div>}

                    <img src={`${background}`} alt="" id='image' className='image' />

                    <div className="container">
                        <div className="blur-box1">
                            {isLoading ? <img id='gif' className='gif' src={"https://i.gifer.com/VAyR.gif"} alt="GIF" /> : <div className="txt2">
                                <i class="fa-sharp fa-regular fa-location-pin-lock" onClick={() => { setsaveModal(true) }}></i>
                                {weatherData.location.name} <span onClick={handleSearchBtn}><i className="fa-regular fa-magnifying-glass-location fa-search"></i></span>
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
                                        <div className="time data-items">{hour.time.split(' ')[1]}</div>
                                        <div className="temp data-items">{Math.floor(hour.temp_c)}°</div>
                                        <div className="cond data-items"> {hour.condition.text}</div>
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
                                        <div className="time data-items">{hour.time.split(' ')[1]}</div>
                                        <div className="temp data-items">{Math.floor(hour.temp_c)}°</div>
                                        <div className="cond data-items"> {hour.condition.text}</div>
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
