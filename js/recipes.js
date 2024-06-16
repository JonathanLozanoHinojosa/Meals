const section = document.querySelector('section');
const spinner = document.querySelector("#spinner");
const busqueda = document.querySelector("#buscar");
const contenedorDropdown = document.querySelector('div.dropdown');
const botonCategoriaFiltro = document.querySelector("#botonFilterCategory");

let recetasBackup = [];
let categoriasSeleccionadas = [];
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
        let categorias = [];

        hideSpinner();
        categorias = await getCategories(categorias);
        mostrarDatos(recetas);
        addCategoriesDropdown(categorias);
        return recetas;
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
    
    /***** ARRAY DE ELEMENTOS SIN IMAGEN PREVIEW *************/
    const idSinPreview = ['52873', '52900', '52930', '52932'];
    //console.log(recetas)
    for (const receta of recetas.meals) {
        const fr = div.cloneNode(true);
        if(idSinPreview.includes(receta.idMeal)) {
            fr.querySelector("img").src = receta.strMealThumb;
        } else {
            fr.querySelector("img").src = receta.strMealThumb+"/preview";
        }
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



/************************ GET CATEGORIES FROM API ************************************/
async function getCategories(categorias) {
    try {
        // Accedeix a la API i recupera dades
        const apiUrl = "https://www.themealdb.com/api/json/v1/1/list.php?c=list";
        const response = await fetch(apiUrl); 
        const categories = await response.json();
        
        //console.log(data.meals[0].strCategory)
        for (const category of categories.meals) {
            categorias.push(category.strCategory);
        }
        return categorias;
        //container.textContent = JSON.stringify(data);
    } catch(error){
        console.log("Error fetching data ", error);
    }
}

/*************** SHOW CATEGORIES IN DROPDOWN LIST ***********************/
function addCategoriesDropdown (categorias) {
    for(const categoria of categorias){
        //console.log(categoria);

        const div = document.querySelector('#dropdownTemplate').content;
        const contenedor = document.querySelector('.dropdownContent');
        const fr = div.cloneNode(true);
        
        fr.querySelector("input").value = categoria;
        fr.querySelector("span").textContent = categoria;
        
        contenedor.appendChild(fr); // Mostrar en el DOM*/

    }
}

/******************* EVENT CLICKING ELEMENTS *************************/
contenedorDropdown.addEventListener('click', function(event) {
    const dropdown = document.querySelector('.dropdownContent');
    const inputs = document.querySelectorAll('input#a');
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

botonCategoriaFiltro.addEventListener('click', function() {
    let recetasFilter = recetas.meals.filter(filtroCategoria);
    let recetasObjeto = {};
    recetasObjeto["meals"] = recetasFilter;
    mostrarDatos(recetasObjeto)
});

function filtroCategoria(recetas) {
    console.log(categoriasSeleccionadas.includes(recetas.strCategory));
    console.log(recetas.strCategory);
    if (categoriasSeleccionadas.length === 0) {
        return recetas;
    } else {
        return categoriasSeleccionadas.includes(recetas.strCategory);
    }
}
