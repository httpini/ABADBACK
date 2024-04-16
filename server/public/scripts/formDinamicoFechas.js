let todosEquipos
let todasTernas 
const URL = "http://administracion.abadfutbol.com.ar"
//FALTA AGREGAR LA FUNCION DEL SELECT DE LAS TERNAS NOMAS
async function agregar_partido(){
    let equiposSeleccionados=[]
           

    //BUSCAMOS LOS EQUIPOS YA SELECCIONADOS EN PARTIDOS Y LOS AGREGAMOS A EQUIPOS SELECCIONADOS
    const selectElementL = document.querySelectorAll('#local_id');
    selectElementL.forEach(e=>{
        if (e.value && e.value != "-"){
            equiposSeleccionados.push(e.value)
        }
    })
    const selectElementV = document.querySelectorAll('#visitante_id');
    selectElementV.forEach(e=>{
        if (e.value && e.value != "-"){
            equiposSeleccionados.push(e.value)
        }
    })
   
    //AGARRAMOS EL TORNEO_ID PARA poder filtrar los equipos que pertenezcan a ese torneo
    var torneo_id = document.getElementById("torneo_id").value;

    // Nos traemos los datos de las ternas
    let request2 = await fetch(`${URL}/ternas/all`)
    let response2 = await request2.json()   
    todasTernas = response2

    //llamamos a la api de nuestra aplicacion web para que nos devuelva los equipos
    let request = await fetch(`${URL}/equipos-torneos/all`)
    let response = await request.json()   
    todosEquipos = response

    //los filtramos por el torneo
    todosEquipos = todosEquipos.filter( e => e.torneo.id == torneo_id)

    // Filtrar los equipos disponibles para este partido
    for (i=0 ; i<equiposSeleccionados.length ; i++) {
        todosEquipos = todosEquipos.filter(e=> e.id != equiposSeleccionados[i])
    }

    //agarramos el fieldset donde vamos a llenar los equipos
    const fieldset = document.getElementById('partidos');


    //aca defini las opciones deshabilitadas para los select
    var disabledOptionV = document.createElement("option");
    disabledOptionV.disabled =true
    disabledOptionV.selected = true
    disabledOptionV.value = "-"
    disabledOptionV.textContent = "Selecciona..."

    var disabledOptionL = document.createElement("option");
    disabledOptionL.disabled =true
    disabledOptionL.selected = true
    disabledOptionL.value="-"
    disabledOptionL.textContent = "Selecciona..."

    var disabledOptionT = document.createElement("option")
    disabledOptionT.selected = true
    disabledOptionT.value= 0//DEJAMOS UN GUION, CUANDO LEVANTO EL DATO DEBO COLOCAR NULL EN LA BASE DE DATOS
    disabledOptionT.textContent = "A definir..."


    // Creamos el div donde vamos a almacenar los elementos select y label para cada partido
    const partido_div = document.createElement('div');


    //Creamos los elementos correspondientes al equipo local
    const localLabel = document.createElement('label');
    localLabel.textContent = 'Local: ';
    localLabel.htmlFor = "local_id"

    const localSelect = document.createElement('select');
    localSelect.name = "local_id"
    localSelect.id = "local_id"


    //tanto aca en el select de local como en el de visitante, creamos onchange para que cuando se elija un equipo no se pueda elegir en el otro
    localSelect.addEventListener('change', () => {
        const value = localSelect.value;
        const visitanteOptions = visitanteSelect.options;
        for (let i = 0; i < visitanteOptions.length; i++) {
            if (visitanteOptions[i].value === value) {
                visitanteOptions[i].disabled = true;
                break;
            }
        }
    });

    //Agregamos la opcion deshabilitada que aparece primero
    localSelect.appendChild(disabledOptionL);

    //agregamos las opciones de los equipos
    todosEquipos.forEach(e => {
      const option = document.createElement('option');
      option.value = e.id;
      option.textContent = e.equipo.name;
      localSelect.appendChild(option);
    });


    // creamos los elementos correspondientes al equipo visitante
    const visitanteLabel = document.createElement('label');
    visitanteLabel.textContent = 'Visitante: ';
    visitanteLabel.htmlFor = "visitante_id"

    const visitanteSelect = document.createElement('select');
    visitanteSelect.name = "visitante_id"
    visitanteSelect.id = "visitante_id"

    visitanteSelect.appendChild(disabledOptionV);

    visitanteSelect.addEventListener('change', () => {
        const value = visitanteSelect.value;
        const localOptions = localSelect.options;
        for (let i = 0; i < localOptions.length; i++) {
            if (localOptions[i].value === value) {
            localOptions[i].disabled = true;
            break;
        }
        }
    });

    todosEquipos.forEach(e => {
        const option = document.createElement('option');
        option.value = e.id;
        option.textContent = e.equipo.name;
        visitanteSelect.appendChild(option);
    });



    const ternaLabel = document.createElement('label');
    ternaLabel.textContent = 'Terna: ';
    ternaLabel.htmlFor = "terna_id"

    const ternaSelect = document.createElement('select');
    ternaSelect.name = "terna_id"
    ternaSelect.id = "terna_id"

    ternaSelect.appendChild(disabledOptionT);

    todasTernas.forEach(t => {
        const option = document.createElement('option');
        option.value = t.id;
        option.textContent = t.name;
        ternaSelect.appendChild(option);
    });

    //agregamos boton de eliminar partido por si nos equivocamos
    const eliminarBtn = document.createElement('button');
    eliminarBtn.textContent = 'Eliminar';
    eliminarBtn.onclick = () => {
        partido_div.remove();
    };

    //agregamos todos los elementos al div de partido que creamos anteriormente
    partido_div.appendChild(localLabel);
    partido_div.appendChild(localSelect);
    partido_div.appendChild(visitanteLabel);
    partido_div.appendChild(visitanteSelect);

    partido_div.appendChild(ternaLabel)
    partido_div.appendChild(ternaSelect)

    partido_div.appendChild(eliminarBtn);

    // Agregamos el div de partido dentro del fieldset que llamamos al inicio de la funcion
    fieldset.appendChild(partido_div);

}
