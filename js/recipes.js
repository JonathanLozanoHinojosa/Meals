const section = document.querySelector('section');
const spinner = document.querySelector("#spinner");
const busqueda = document.querySelector("#buscar");

let recetasBackup = [];
const recetas = await getAllData();

/************************** SPINNER **************************/
function showSpinner() {
    spinner.classList.add("display");
}

function hideSpinner() {
    spinner.classList.remove("display");
}

/************************** BUSQUEDA **************************/
function funcionFiltro(recetas) {
    const palabra = document.querySelector("#palabraABuscar").value;
    return recetas.strMeal.toLowerCase().includes(palabra.toLowerCase());
}

busqueda.addEventListener('click', function (e) {
    let recetasFilter = recetas.meals.filter(funcionFiltro);
    let recetasObjeto = {};
    recetasObjeto["meals"] = recetasFilter;
    
    mostrarDatos(recetasObjeto)
});

/************************** ORDENACIÓ **************************/
const select = document.getElementById('select');

select.addEventListener('change', function (e) {
    
    if(select.value === '1') {
        recetasBackup.meals.sort((a, b) => {
            if ((a.strMeal.trimStart()) < (b.strMeal.trimStart())) {
              return -1;
            } else if ((a.strMeal.trimStart()) > (b.strMeal.trimStart())) {
              return 1;
            }
            return 0;
          });
          mostrarDatos(recetasBackup)
    } else {
        recetasBackup.meals.sort((a, b) => {
            if ((a.strMeal.trimStart()) < (b.strMeal.trimStart())) {
              return 1;
            } else if ((a.strMeal.trimStart()) > (b.strMeal.trimStart())) {
              return -1;
            }
            return 0;
          });
          mostrarDatos(recetasBackup)
    } 
});

/************************** OBTENCIÓ DE RECEPTES API **************************/
async function getAllData() {
    try {
        showSpinner();

        // Accedeix a la API i recupera dades
        const apiUrl = "https://www.themealdb.com/api/json/v1/1/search.php?f=%";
        const response = await fetch(apiUrl); 
        const recetas = await response.json();
        //console.log(recetas.meals[0]);
        //return recetas;

        recetasBackup = recetas;
        
        hideSpinner();
        mostrarDatos(recetas);
        return recetas
    } catch(error){
        console.log("Error fetching data ", error);
    }
    //container.textContent = JSON.stringify(data);
}

/************************** MOSTRAR QUANTITAT RECEPTES  **************************/
function mostrarNumeroRecetas(recetas) {
    document.querySelector('.numItems').textContent = `Meals: ${recetas.meals.length} items`;
}


/************************** MOSTRAR DADES  **************************/
function mostrarDatos(recetas) {
    
    clearDiv();
    const div = document.querySelector('#recetas').content;
    
    /**** FRAGMENT **********/
    const fragment = document.createDocumentFragment();
    
    //console.log(recetas)
    for (const receta of recetas.meals) {
        const fr = div.cloneNode(true);
        
        fr.querySelector("img").src = receta.strMealThumb; //+"/preview";
        fr.querySelector("img").alt= receta.strMeal;  
        fr.querySelector(".title").textContent = receta.strMeal;
        fr.querySelector("a").href = 'detail.html?s='+receta.idMeal;
        
        //section.appendChild(fr); // Mostrar en el DOM*/
        /* FRAGMENT */
        fragment.appendChild(fr);
    }
    /* AÑADIR EL FRAGMENT AL CONTENEDOR */
    section.appendChild(fragment);
    mostrarNumeroRecetas(recetas);
}

/************************** REFRESH DEL CONTENIDOR DE DADES  **************************/
function clearDiv(div) {
    document.querySelector(".row").innerHTML = '';
}