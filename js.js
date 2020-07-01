const btn = document.querySelector(".btn");

const outerHTML = (current, hours) => {
    const out = document.querySelector(".weather");
    const html = `
        <div class="weather">
            <h1 class="title">Wheather in ${current.name}</h1>
            <div class="info">
            <div class="current_information">
                <img src="https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png" alt="" class="img">
                <span class="current_info">${current.weather[0].main}</span>
            </div>
            <h3 class="temp">${Math.round(current.main.temp - 273)}&deg C</h3>
            <ul class="description">
                <li class="wind">Wind: ${current.wind.speed} kmph</li>
                <li class="humidity">Humidity: ${current.main.humidity}: mm</li>
                <li class="pressure">Pressure: ${current.main.pressure}: mb</li>
            </ul>
        </div>
            <div class="time_info">
            <div class="times">
                <span class="time">${new Date(hours.list[0].dt_txt).getHours()}:00</span>
                <img src="https://openweathermap.org/img/wn/${hours.list[0].weather[0].icon}@2x.png" alt="" class="img_time">
                <span class="C">${Math.round(hours.list[0].main.temp - 273)}&deg C</span>
            </div>
            <div class="times">
                <span class="time">${new Date(hours.list[1].dt_txt).getHours()}:00</span>
                <img src="https://openweathermap.org/img/wn/${hours.list[1].weather[0].icon}@2x.png" alt="" class="img_time">
                <span class="C">${Math.round(hours.list[1].main.temp - 273)}&deg C</span>
            </div>
            <div class="times">
                <span class="time">${new Date(hours.list[2].dt_txt).getHours()}:00</span>
                <img src="https://openweathermap.org/img/wn/${hours.list[2].weather[0].icon}@2x.png" alt="" class="img_time">
                <span class="C">${Math.round(hours.list[2].main.temp - 273)}&deg C</span>
            </div>
            <div class="times">
                <span class="time">${new Date(hours.list[3].dt_txt).getHours()}:00</span>
                <img src="https://openweathermap.org/img/wn/${hours.list[3].weather[0].icon}@2x.png" alt="" class="img_time">
                <span class="C">${Math.round(hours.list[3].main.temp - 273)}&deg C</span>
            </div>
            <div class="times">
                <span class="time">${new Date(hours.list[4].dt_txt).getHours()}:00</span>
                <img src="https://openweathermap.org/img/wn/${hours.list[4].weather[0].icon}@2x.png" alt="" class="img_time">
                <span class="C">${Math.round(hours.list[4].main.temp - 273)}&deg C</span>
            </div>
            <div class="times">
                <span class="time">${new Date(hours.list[5].dt_txt).getHours()}:00</span>
                <img src="https://openweathermap.org/img/wn/${hours.list[5].weather[0].icon}@2x.png" alt="" class="img_time">
                <span class="C">${Math.round(hours.list[5].main.temp - 273)}&deg C</span>
            </div>
            <div class="times">
                <span class="time">${new Date(hours.list[6].dt_txt).getHours()}:00</span>
                <img src="https://openweathermap.org/img/wn/${hours.list[6].weather[0].icon}@2x.png" alt="" class="img_time">
                <span class="C">${Math.round(hours.list[6].main.temp - 273)}&deg C</span>
            </div>
          </div>
        </div>`
    out.innerHTML = html;
};

const getRequestHours = async (city) => {
    const url = `http://api.openweathermap.org/data/2.5/forecast?q=${city},ua&appid=a20bf99ce39cb8699facac67d0c5e013`;
    const response = await fetch(url);
    return response.json();

};

const getRequestCurrentForecast = async (city) => {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city},ua&appid=a20bf99ce39cb8699facac67d0c5e013`;
    const response = await fetch(url);
    return await response.json();
};

const currentCity = async () => {
    const currentCity = document.querySelector('.city').value;
    const currentForecast = await getRequestCurrentForecast(currentCity);
    const hoursForecast = await getRequestHours(currentCity);
    outerHTML(currentForecast, hoursForecast);

};

btn.addEventListener("click", currentCity);


