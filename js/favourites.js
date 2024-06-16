const section = document.querySelector('section');
const spinner = document.querySelector("#spinner");
const busqueda = document.querySelector("#buscar");

let arrayFavoritos = [];

let recetasBackup = [];
const arrayFiltrado = {};

const recetas = await getAllData();

/************************** SPINNER **************************/
function showSpinner() {
    spinner.classList.add("display");
}

function hideSpinner() {
    spinner.classList.remove("display");
}

/************************** BUSQUEDA **************************/
function funcionFiltro(arrayFiltrado) {
    const palabra = document.querySelector("#palabraABuscar").value;
    return arrayFiltrado.strMeal.toLowerCase().includes(palabra.toLowerCase());
}

busqueda.addEventListener('click', function (e) {
    let recetasFilter = arrayFiltrado.meals.filter(funcionFiltro);
    let recetasObjeto = {};
    recetasObjeto["meals"] = recetasFilter;
    mostrarDatosFavoritos(recetasObjeto);
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
        
        hideSpinner();
        obtenerFavoritos(recetas);
        //console.log(arrayFavoritos)
        mostrarDatosFavoritos(arrayFiltrado);
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

// MOSTRAR SOLO FAVORITOS
function obtenerFavoritos(recetas) {
    const storedUserData = localStorage.getItem('favouriteMeals');
       
    if (storedUserData) {
        arrayFavoritos = JSON.parse(storedUserData);
    }

    for (const receta of recetas.meals) {
        const resultado = arrayFavoritos.find((recipe) => recipe.name ===  receta.strMeal);
        if (resultado) {
            recetasBackup.push(receta);
        }
        arrayFiltrado["meals"] = recetasBackup;
    }
    return arrayFiltrado;

}

/************************** MOSTRAR DADES  **************************/
function mostrarDatosFavoritos(recetas) {
    
    clearDiv();
    const div = document.querySelector('#recetas').content;
    
    /***** ARRAY DE ELEMENTOS SIN IMAGEN PREVIEW *************/
    const idSinPreview = ['52873', '52900', '52930', '52932'];

    //console.log(recetas)
    for (const receta of recetas.meals) {
        //const resultado = arrayFavoritos.find((recipe) => recipe.name ===  receta.strMeal);
        
        //if (resultado) {
            //recetasBackup.push(receta);
            const fr = div.cloneNode(true);
           
            if(idSinPreview.includes(receta.idMeal)) {
                fr.querySelector("img").src = receta.strMealThumb;
            } else {
                fr.querySelector("img").src = receta.strMealThumb+"/preview";
            }
            fr.querySelector("img").alt= receta.strMeal;
            fr.querySelector(".title").textContent = receta.strMeal;
            fr.querySelector("a").href = 'detail.html?s='+receta.idMeal;
            section.appendChild(fr); // Mostrar en el DOM*/
       // }
    }
    //arrayFiltrado["meals"] = recetasBackup;
    //console.log(arrayFiltrado)
    mostrarNumeroRecetas(recetas);
}

/************************** REFRESH DEL CONTENIDOR DE DADES  **************************/
function clearDiv(div) {
    document.querySelector(".row").innerHTML = '';
}