const spinner = document.querySelector("#spinner");

/*************** RECIPES.JS FUNCTIONS ***************/

// Get all categories from the API
export async function getCategories(categorias) {
    try {
        // Accedeix a la API i recupera dades
        const apiUrl = "https://www.themealdb.com/api/json/v1/1/list.php?c=list";
        const response = await fetch(apiUrl); 
        const categories = await response.json();
        
        for (const category of categories.meals) {
            categorias.push(category.strCategory);
        }
        return categorias;

    } catch(error){
        console.log("Error fetching data ", error);
    }
}

/*************** RECIPES.JS AND FAVOURITES.JS SHARED FUNCTIONS ***************/

// Get all recipes from the API
export async function getAllData() {
    try {
        showSpinner();

        // Accedeix a la API i recupera dades
        const apiUrl = "https://www.themealdb.com/api/json/v1/1/search.php?f=%";
        const response = await fetch(apiUrl); 
        const recetas = await response.json();

        let recetasBackup = [...recetas.meals];

        hideSpinner();

        return recetas;
    } catch(error){
        console.log("Error fetching data ", error);
    }
}


/*************** DETAIL.JS FILE ***************/

// Get the recipe with the id received from the API
export async function getReceta(idReceta) {
    try {
        showSpinner();
        // Accedeix a la API i recupera dades
        const apiUrl = "https://www.themealdb.com/api/json/v1/1/lookup.php?i="+idReceta;
        const response = await fetch(apiUrl); 
        const receta = await response.json();
    
        hideSpinner();
        return receta;

    } catch(error){
        console.log("Error fetching data ", error);
    }
}

// Get the flag of the recipe country selected
export async function getFlag(gentilicio) {
    const response = await fetch("./module/countries.json");
    const flags = await response.json();
    for(const flag of flags.flags) {
        if(flag.code === gentilicio) {
            return flag.flag;
        }
    }
}

/*************** COMMON IN ALL JS FILES (SPINNER) ***************/

// Show and hide the spinner
function showSpinner() {
    spinner.classList.add("display");
}

function hideSpinner() {
    spinner.classList.remove("display");
}
