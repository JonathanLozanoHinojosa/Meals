import { getAllData } from "../module/getData.js";

// Objectes del DOM
const section = document.querySelector('section');
const busqueda = document.querySelector("#buscar");

let arrayFavoritos = [];

let recetasBackup = [];
const arrayFiltrado = {};

// Carrega inicial de l'aplicació
const recetas = await getAllData();
obtenerFavoritos(recetas);
mostrarDatosFavoritos(arrayFiltrado);

/************************** CERCA **************************/
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

/************************** MOSTRAR QUANTITAT RECEPTES **************************/
function mostrarNumeroRecetas(recetas) {
    document.querySelector('.numItems').textContent = `Meals: ${recetas.meals.length} items`;
}

// De totes les receptes, mostrem nomès les receptes que estiguin al localstorage
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

/************************** MOSTRAR DADES AL DOM  **************************/
function mostrarDatosFavoritos(recetas) {
    
    clearDiv();
    const div = document.querySelector('#recetas').content;
    
    // Array dels elements sense imatge preview
    const idSinPreview = ['52873', '52900', '52930', '52932'];

    for (const receta of recetas.meals) {
        const fr = div.cloneNode(true);
           
        idSinPreview.includes(receta.idMeal) ? fr.querySelector("img").src = receta.strMealThumb : fr.querySelector("img").src = receta.strMealThumb+"/preview";
        fr.querySelector("img").alt= receta.strMeal;
        fr.querySelector(".title").textContent = receta.strMeal;
        fr.querySelector("a").href = 'detail.html?s='+receta.idMeal;
        section.appendChild(fr); // Mostrar en el DOM*/
    }
    
    mostrarNumeroRecetas(recetas);
}

/************************** REFRESH DEL CONTENIDOR DE DADES  **************************/
function clearDiv(div) {
    document.querySelector(".row").innerHTML = '';
}
