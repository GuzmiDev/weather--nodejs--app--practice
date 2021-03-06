require('dotenv').config();

const { pausa, inquirerMenu, leerInput, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");
const colors = require('colors');


const main = async () => {
  let opt = "";
  const busquedas = new Busquedas();
  console.log(process.env);

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        //Mostrar mensaje
        const ciudadBuscada = await leerInput("Ciudad: ");

        // buscar los lugares
        const lugares = await busquedas.buscarLugar(ciudadBuscada);
        
        // seleccionar el lugar
        const id = await listarLugares(lugares);
        if (id === 0) continue

        const lugarSelecionado = lugares.find(lugar => lugar.id === id);

            //Guardar historial
          busquedas.agregarHistorial(lugarSelecionado.name)


        //clima
        const {latitud,longitud } = lugarSelecionado;
        const datosClima = await busquedas.climaLugar(latitud, longitud);


        //Mostrar resultados
        console.clear();
        console.log("\n Información de la ciudad\n".green);
        console.log("Ciudad:", colors.magenta(lugarSelecionado.name));
        console.log("Lat:", lugarSelecionado.latitud);
        console.log("Lng:", lugarSelecionado.longitud);
        console.log("Temperatura:", datosClima.temp);
        console.log("Mínima:", datosClima.temp_min);
        console.log("Máxima:",datosClima.temp_min);
        console.log("Estado:",datosClima.description,);

        break;
      case 2:
        busquedas.historialCapitalizado.forEach((ciudad, i)=>{console.log(`${i+1}. ${ciudad}`);})
        break;

      default:
        break;
    }

    opt !== 0 ? await pausa() : null;
  } while (opt !== 0);
};

main();
