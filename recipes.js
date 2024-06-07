const section = document.querySelector('section');
const spinner = document.querySelector("#spinner");

const recetas = await getAllData();


// SHOW SPINNER loading
function displaySpinner() {
    spinner.classList.add("display");
}

// HIDE SPINNER
function hideSpinner() {
    spinner.classList.remove("display");
}

async function getAllData() {
    try {
        displaySpinner();

        // Accedeix a la API i recupera dades
        const apiUrl = "https://www.themealdb.com/api/json/v1/1/search.php?f=%";
        const response = await fetch(apiUrl); 
        const recetas = await response.json();
        //console.log(recetas.meals[0]);
        //return recetas;

        hideSpinner();
        mostrarDatos(recetas);
        mostrarNumeroRecetas(recetas);
    } catch(error){
        console.log("Error fetching data ", error);
    }
    //container.textContent = JSON.stringify(data);
}


function mostrarNumeroRecetas(recetas) {
    document.querySelector('.numItems').textContent = `Meals: ${recetas.meals.length} items`;
}

// sin el async await recetas sería una promesa
function mostrarDatos(recetas) {
    const div = document.querySelector('#recetas').content;
    //console.log(recetas)
    for (const receta of recetas.meals) {
        const fr = div.cloneNode(true);
        
        fr.querySelector("img").src = receta.strMealThumb; //+"/preview";
        fr.querySelector("img").alt= receta.strMeal;  
        fr.querySelector(".title").textContent = receta.strMeal;
        fr.querySelector("a").href = 'detail.html?s='+receta.strMeal;
        
        section.appendChild(fr); // Mostrar en el DOM*/
    }
}