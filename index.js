const bodyParser = require("body-parser");
const express = require("express");
const ejs = require("ejs");
const https = require("https");
const _ = require("lodash");
require("dotenv").config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/weather-app", (req,res) =>{
    res.render("weather-app.ejs")
})


app.post("/weather-app", (req, res) => {
    const name = _.capitalize(req.body.cityName);
    const ApiKey = "3dd5dd34e35bd35ae86b9fcfa72b7739";

    const URL =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        name +
        "&appid=" +
        ApiKey +
        "&units=metric";
    https.get(URL, function (response) {
        response.on("data", function (data) {
            if (response.statusCode === 200) {
                const weatherInfo = JSON.parse(data);
                let temperature = Math.round(weatherInfo.main.temp);
                let weatherDescription = weatherInfo.weather[0].description;
                let icon =
                    "https://openweathermap.org/img/wn/" +
                    weatherInfo.weather[0].icon +
                    "@2x.png";

                res.render("weather-app-result.ejs", {
                    city: name,
                    temp: temperature,
                    description: weatherDescription,
                    weatherIcon: icon,
                });
            } else {
                res.render("weather-app-apology.ejs");
            }
        });
    });
});

app.listen(process.env.PORT || 3000, function () {
    console.log("server started at port 3000");
});