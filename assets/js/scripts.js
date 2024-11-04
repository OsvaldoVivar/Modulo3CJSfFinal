//alert("hola todo esta funcionando");

async function obtenerMontoDeMonedas() {
  try {
    const res = await fetch("https://mindicador.cl/api/");
    const data = await res.json();
    console.log(data);

    montoDolar = data.dolar.valor;
    montoEuro = data.euro.valor;
    montoUf = data.uf.valor;
    console.log(montoDolar);
    console.log(montoEuro);
    console.log(montoUf);
  } catch (e) {
    alert("jodio la pagina");
    console.log(e);
  }
}
obtenerMontoDeMonedas();
function showResult() {
  const amountInput = parseFloat(document.querySelector("#amountInput").value);
  const currencyAmount = document.querySelector("#currencyAmount").value;
  const dolar = montoDolar;
  const euro = montoEuro;
  const uf = montoUf;
  let result;
  // si no hay monto
  if (isNaN(amountInput) || amountInput <= 0) {
    document.getElementById("showResult").innerHTML =
      "<p>Ingrese un monto válido en CLP.</p>";
    return;
  }
  // si no hay moneda
  if (!currencyAmount) {
    document.getElementById("showResult").innerHTML =
      "<p>Favor seleccionar moneda.</p>";
    return;
  }

  if (currencyAmount === "usd") {
    result = amountInput / dolar;
  } else if (currencyAmount === "eur") {
    result = amountInput / euro;
  } else if (currencyAmount === "uf") {
    result = amountInput / uf;
  }
  //que temga solo dos decimales
  //result = result.toFixed(2);

  document.getElementById(
    "showResult"
  ).innerHTML = `<p>Tu cambio sería:$ ${result.toLocaleString("es-CL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}</p>`;
}
document.querySelector("#buttonConvert").addEventListener("click", showResult);
//______________
async function getMoneda(tipoMoneda) {
  const endpoint = `https://mindicador.cl/api/${tipoMoneda}`;
  const res = await fetch(endpoint);
  const moneda = await res.json();
  return moneda;
}

function prepararConfiguracionParaLaGrafica(moneda) {
  const tipoDeGrafica = "line";
  const titulo = `Historial de los últimos 10 días del ${moneda.nombre}`;
  const colorDeLinea = "white";

  // Extraemos los últimos 10 datos y los ordenamos cronológicamente
  const ultimos10Datos = moneda.serie.slice(0, 10).reverse();
  const labels = ultimos10Datos.map((punto) => punto.fecha.substring(0, 10));
  const valores = ultimos10Datos.map((punto) => punto.valor);

  // Configuración de la gráfica
  const config = {
    type: tipoDeGrafica,
    data: {
      labels: labels,
      datasets: [
        {
          label: titulo,
          backgroundColor: colorDeLinea,
          borderColor: colorDeLinea,
          data: valores,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: "Fecha" } },
        y: { title: { display: true, text: "Valor" } },
      },
    },
  };
  return config;
}

async function renderGrafica(tipoMoneda) {
  const moneda = await getMoneda(tipoMoneda);
  const config = prepararConfiguracionParaLaGrafica(moneda);
  const chartDOM = document.getElementById("myChart").getContext("2d");

  // Creamos una nueva gráfica
  window.myChart = new Chart(chartDOM, config);
}

// Inicializamos con el dólar como predeterminado
renderGrafica("dolar");
