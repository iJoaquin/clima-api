const Boton_Inicio = document.getElementById("boton_inicio");
const Seccion_Inicio = document.getElementById("seccion_inicio");
const Seccion_General = document.getElementById("seccion_general");

Boton_Inicio.addEventListener("click", function () {
    Seccion_General.style.display = "block";
    Seccion_Inicio.style.display = "none";
});

/****************************************************/
const api_key = "9b0f9f9789544022ad44530bef89deca";

const Form_Clima = document.getElementById("form_clima");
const Input_Clima = document.getElementById("input_clima");
const Datos_Clima = document.getElementById("datos_clima");

Form_Clima.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    const Input_Ciudad = Input_Clima.value;

    if (Input_Ciudad === "") {
        swal.fire({
            icon: "error",
            title: "Campo vacío",
            text: "Por favor, ingrese una ciudad para obtener el clima."
        });
        Datos_Clima.style.display = "none"
        
    } else {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${Input_Ciudad}&appid=${api_key}&units=metric`);
            const data = await response.json();
            console.log(data)

            if (response.ok) {
                // La solicitud fue exitosa, procesa los datos
                datosClima(data);
                Datos_Clima.style.display = "block"

            } else {
                swal.fire({
                    icon: "error",
                    title: "Ciudad no encontrada",
                    text: "Ingrese una ciudad válida para obtener el clima."
                });
            }

        } catch (error) {
            console.error(error);
            swal.fire({
                icon: "error",
                title: "Error en la solicitud",
                text: "Hubo un problema al obtener los datos del clima. Por favor, inténtalo de nuevo más tarde."
            });
        }
    }
});

/****************************************************/
async function datosClima(data) {
    const Temperatura = Math.round(data.main.temp);

    const Descripcion = data.weather[0].description;

    const Pais = data.sys.country;

    const fechaHoraLocal = new Date((data.dt + data.timezone) * 1000);
    const offsetMilliseconds = fechaHoraLocal.getTimezoneOffset() * 60 * 1000;
    const horaLocalCorregida = new Date(fechaHoraLocal.getTime() + offsetMilliseconds);
    const Hora = horaLocalCorregida.toLocaleString();

    const Icono = data.weather[0].icon;

    const Detalles = [
        /*Sensacion termica*/
        `${Math.round(data.main.feels_like)}ºC`,
        /*Humedad*/
        `${data.main.humidity}%`,
        /*Velocidad del viento*/
        `${data.wind.speed}km/h`,
    ];

    const Detalles_Temperatura = `Máx: ${data.main.temp_max}ºC/Min: ${data.main.temp_min}ºC`;

    Datos_Clima.querySelector(".div_icono_temperatura img").src = `http://openweathermap.org/img/wn/${Icono}.png`;
    Datos_Clima.querySelector(".div_icono_temperatura h3").textContent = `${Temperatura}ºC`;
    Datos_Clima.querySelector(".div_ambiente h3").textContent = Descripcion;
    Datos_Clima.querySelector(".div_pais h3").textContent = `País: ${Pais}`;
    Datos_Clima.querySelector(".div_hora h3").textContent = Hora;
    Datos_Clima.querySelector(".div_detalles").innerHTML = Detalles.map((detalle) => `<div>${detalle}</div>`).join("");
    Datos_Clima.querySelector(".div_max_min div").textContent = Detalles_Temperatura;
}