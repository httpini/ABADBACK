let path = require('path');
require('dotenv').config({
    path: path.resolve(__dirname, `../../.env`),
})
let URL = process.env.URL 
let todasCategorias
let todasSubcategorias
let todosEquipos


//definimos las variables donde vamos a traer la lista completa de datos desde el modelo
       
    async function cambia_categoria(){

        const equiposTorneo = document.getElementById("equiposTorneo");
        while (equiposTorneo.firstChild) {
            equiposTorneo.removeChild(equiposTorneo.firstChild);
        }//ELIMINAMOS LOS EQUIPOS DE OTRA CATEGORIA APENAS INVOCAMOS A LA FUNCION 


        var categoria_id = document.getElementById("categoria_id").value;
        //con esta categoria_id, podemos buscar los equipos y subcategorias que pertenezcan a la categoria. por eso la almacenamos

        let request = await fetch(`${URL}/categorias/all`) 
        let response = await request.json()   
        todasCategorias = response
        //traemos la lista de todas las categorias

        

        let request2 = await fetch(`${URL}/subcategorias/all`)
        let response2 = await request2.json()   
        todasSubcategorias = response2
        //TRAEMOS LA LISTA DE TODAS LAS SUBCATEGORIAS

        todasSubcategorias = todasSubcategorias.filter( sub => sub.categoria_id == categoria_id)
        //FILTRAMOS LAS SUBCATEGORIAS QUE PERTENEZCAN A LA CATEGORIA SELECCIONADA
        
        


        let request3 = await fetch(`${URL}/equipos/all`)
        let response3 = await request3.json()   
        todosEquipos = response3

        todosEquipos = todosEquipos.filter( equi => equi.categoria_id == categoria_id)
        // lo mismo con los equipos traemos la lista completa y filtramos los que sean de la categoria seleccionada
    
        
        var select = document.getElementById("subcategoria_id");
        select.innerHTML = '';
        //SELECCIONAMOS LA ETIQUETA SELECT DONDE VAMOS A COLOCAR LOS OPTION DE 

        if(todasSubcategorias.length > 0){
            
        var option = document.createElement("option");
            option.disabled =true
            option.selected = true
            option.text = "Selecciona una subcategoria" 
            select.appendChild(option);

        todasSubcategorias.forEach(subcategoria => {
            var option = document.createElement("option");
            option.value = subcategoria.id;
            option.text = subcategoria.name;
            select.appendChild(option);
        })
        } else{ 
            var option = document.createElement("option");
            option.disabled =true
            option.selected = true
            option.text = "Esta categoria no posee subcategorias" 
            select.appendChild(option);

        }

        todosEquipos.forEach(equipo => {
            var div = document.createElement("div");
            var input = document.createElement("input");
            input.type = "checkbox";
            input.name = "equiposTorneo";
            input.value = equipo.id;
            input.id= equipo.id;
            var label = document.createElement("label");
            label.innerHTML = equipo.name;
            

            div.appendChild(input);
            div.appendChild(label);
            document.getElementById("equiposTorneo").appendChild(div);
        })
        
}
    
