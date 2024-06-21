import {getAllData, getCategories} from '../module/getData.js';

// Objectes del DOM
const section = document.querySelector('section');
const busqueda = document.querySelector("#buscar");
const contenedorDropdown = document.querySelector('div.dropdown');
const botonCategoriaFiltro = document.querySelector("#botonFilterCategory");

// Carrega inicial de l'aplicació
let categoriasSeleccionadas = [];
const recetas = await getAllData();

//let recetasBackup = recetas;
let recetasBackup = {};
recetasBackup["meals"] = [...recetas.meals];

let categorias = [];
categorias = await getCategories(categorias);
mostrarDatos(recetas);
addCategoriesDropdown(categorias);


/************************** CERCA PER NOM **************************/
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

/************************** ORDENACIÓ A-Z/Z-A **************************/
const select = document.getElementById('select');

select.addEventListener('change', function (e) {
    
    if(select.value === '1') {
        recetasBackup.meals.sort((a, b) => {
            return (a.strMeal.trimStart().localeCompare(b.strMeal.trimStart()));
          });
    } else {
        recetasBackup.meals.sort((a, b) => {
            return (b.strMeal.trimStart().localeCompare(a.strMeal.trimStart()));
          });
    }
    
    mostrarDatos(recetasBackup);
});

/************************** MOSTRAR QUANTITAT DE RECEPTES  **************************/
function mostrarNumeroRecetas(recetas) {
    document.querySelector('.numItems').textContent = `Meals: ${recetas.meals.length} items`;
}


/************************** MOSTRAR DADES DOM **************************/
function mostrarDatos(recetas) {
    
    clearDiv();
    const div = document.querySelector('#recetas').content;
    
    // Creació del fragment
    const fragment = document.createDocumentFragment();
    
    // Array ambs id's de les receptes sense imatge preview
    const idSinPreview = ['52873', '52900', '52930', '52932'];
    
    for (const receta of recetas.meals) {
        const fr = div.cloneNode(true);
        
        idSinPreview.includes(receta.idMeal) ? fr.querySelector("img").src = receta.strMealThumb : fr.querySelector("img").src = receta.strMealThumb+"/preview";   
        fr.querySelector("img").alt= receta.strMeal;  
        fr.querySelector(".title").textContent = receta.strMeal;
        fr.querySelector("a").href = 'detail.html?s='+receta.idMeal;
        
        //section.appendChild(fr); // Mostrar en el DOM*/
        // Afegim al fragment
        fragment.appendChild(fr);
    }

    // Afegim el fragment al contenidor
    section.appendChild(fragment);
    mostrarNumeroRecetas(recetas);
}

/************************** REFRESH DEL CONTENIDOR DE DADES  **************************/
function clearDiv(div) {
    document.querySelector(".row").innerHTML = '';
}


/*************** CATEGORIES ***************/

// Mostrar les categories al dropdown list
function addCategoriesDropdown (categorias) {
    for(const categoria of categorias){

        const div = document.querySelector('#dropdownTemplate').content;
        const contenedor = document.querySelector('.dropdownContent');
        const fr = div.cloneNode(true);
        
        fr.querySelector("input").value = categoria;
        fr.querySelector("span").textContent = categoria;
        
        contenedor.appendChild(fr); // Mostrar en el DOM*/

    }
}

// Event clicking elements in dropdown list
contenedorDropdown.addEventListener('click', function(event) {
    const dropdown = document.querySelector('.dropdownContent');
    const inputs = document.querySelectorAll('input.a');
    for (const input of inputs) {
        if (event.target === input) {
            if (!categoriasSeleccionadas.includes(input.value)) {
                categoriasSeleccionadas.push(input.value);
            } else {
                const index = categoriasSeleccionadas.indexOf(input.value);
                categoriasSeleccionadas.splice(index,1);
            }
        }
    }
});

// Event al fer click al botó de categories
botonCategoriaFiltro.addEventListener('click', function() {
    let recetasFilter = recetas.meals.filter(filtroCategoria);
    let recetasObjeto = {};
    recetasObjeto["meals"] = recetasFilter;
    mostrarDatos(recetasObjeto)
});

// Filtre per mostrar nomès les receptes seleccionades
function filtroCategoria(recetas) {
    if (categoriasSeleccionadas.length === 0) {
        return recetas;
    } else {
        return categoriasSeleccionadas.includes(recetas.strCategory);
    }
}
