export async function getFlag(gentilicio) {
    const response = await fetch("./module/countries.json");
    const flags = await response.json();
    for(const flag of flags.flags) {
        if(flag.code === gentilicio) {
            return flag.flag;
        }
    }
   // console.log(flags.flags);
}





export async function getCategories() {
    try {
        // Accedeix a la API i recupera dades
        const apiUrl = "https://www.themealdb.com/api/json/v1/1/list.php?c=list";
        const response = await fetch(apiUrl); 
        const categories = await response.json();
    
        //console.log(data.meals[0].strCategory)
        return categories;
        /*for (const category of categories.meals) {
            console.log(category.strCategory)
        }*/
        //container.textContent = JSON.stringify(data);
    } catch(error){
        console.log("Error fetching data ", error);
    }
}


export async function getCountries() {
    try {
        // Accedeix a la API i recupera dades
        const apiUrl = "https://www.themealdb.com/api/json/v1/1/list.php?a=list";
        const response = await fetch(apiUrl); 
        const countries = await response.json();
    
        //console.log(data)
        return countries;
        /*for (const country of countries.meals) {
            console.log(country.strArea)
        }*/
        //container.textContent = JSON.stringify(data);
    } catch(error){
        console.log("Error fetching data ", error);
    }
}

export async function getIngredients() {
    try {
        // Accedeix a la API i recupera dades
        const apiUrl = "https://www.themealdb.com/api/json/v1/1/list.php?i=list";
        const response = await fetch(apiUrl); 
        const ingredients = await response.json();
    
        return ingredients;
        //console.log(data)
        /*for (const ingredient of ingredients.meals) {
            console.log(ingredient.strIngredient)
        }*/
        //container.textContent = JSON.stringify(data);
    } catch(error){
        console.log("Error fetching data ", error);
    }
}


export async function getReceta(nombreReceta) {
    try {
        // Accedeix a la API i recupera dades
        const apiUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s="+nombreReceta;
        const response = await fetch(apiUrl); 
        const receta = await response.json();
    
        return receta;

    } catch(error){
        console.log("Error fetching data ", error);
    }
}