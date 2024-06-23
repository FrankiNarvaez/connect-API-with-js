let map;
let autocomplete;
let marker;

function initMap() {
    // Inicializar el mapa
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 4.8087174, lng: -75.690601 },
        zoom: 8,
    });

    // Inicializar el campo de autocomplete
    const input = document.getElementById("location-input");
    autocomplete = new google.maps.places.Autocomplete(input); //Metodo de google
    autocomplete.bindTo("bounds", map);

    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
            console.error("No hay detalles : '" + place.name + "'");
            return;
        }

        // Centrar el mapa en la ubicación seleccionada
        map.setCenter(place.geometry.location);
        map.setZoom(10);

        // Colocar un marcador en la ubicación seleccionada
        if (marker) {
            marker.setMap(null);
        }
        marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
        });

        // Obtener y mostrar el clima actual en la ubicación seleccionada
        getWeather(place.geometry.location.lat(), place.geometry.location.lng());
    });
}

async function getWeather(lat, lon) {
    // Obtener el clima actual usando la API de Open Meteo
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m`);
    const data = await response.json();
    console.log(data)

    const weather = data.current.weather_code;
    const wind = data.current.wind_speed_10m;
    const temperature = data.current.temperature_2m
    const precipitation = data.current.precipitation;
    
    // Actualizar el contenido del elemento con la temperatura
    const temperatureElement = document.getElementById("temperature");
    temperatureElement.textContent = `${temperature} °C`;

    const windElement = document.getElementById("wind");
    windElement.textContent = `${wind} km/h`;

    const precipitationElement = document.getElementById("precipitation");
    precipitationElement.textContent = `${precipitation} mm`;

    const weatherElement = document.getElementById("weather-img");
    // Mostrar la imagen correspondiente según el código del clima

    if (temperature >= 30) {
        weatherElement.src = "./assets/sol.png"; // Ruta del icono para clima soleado
        weatherElement.alt = "Soleado";
    } else if (temperature >= 25) {
        weatherElement.src = "./assets/parcialmente.png"; // Ruta del icono para clima parcialmente nublado
        weatherElement.alt = "Lluvioso";
    } else if (temperature >= 10) {
        weatherElement.src = "./assets/nublado.png"; // Ruta del icono para clima nublado
        weatherElement.alt = "frio";
    } else {
        weatherElement.src = "./assets/frio.png"; // Ruta del icono para clima frío
        weatherElement.alt = "Lluvia";
    }
}

// Cargar el mapa cuando se carga la página
window.onload = initMap;
