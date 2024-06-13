const div = document.querySelector('#main-content');
const stars = document.querySelectorAll("div.star-container div.star");
const fav = document.querySelector("div.fav-container div.fav");

let params = new URLSearchParams(document.location.search);
let nombreReceta = params.get("s");

let bandera = '';
let arrayFavoritos = [];
let favoritoEncontrado = false;

//console.log(typeof(nombreReceta))
nombreReceta = nombreReceta.replaceAll(' ', '%20');

const infosReceta = await getReceta(nombreReceta);


/*************** RATING **********************************/
let rating = 0;

// entries() proporciona pares  indice:valor
for (const [index, star] of stars.entries()) {
  //console.log(index, star)
  star.addEventListener("click", () => {
    //console.log("Rating seleccionat =" , index+1);
    for (const [index2, star] of stars.entries()) {
      index >= index2 ? star.classList.add("star-pink") : star.classList.remove("star-pink");
    }
  });
}

/*********** FAVORITOS / LIKE ******************/
//let favorito = false;

fav.addEventListener("click", function(e) {
    const id = infosReceta.meals[0].idMeal;
    const name = infosReceta.meals[0].strMeal;
    if(!favoritoEncontrado) {
        fav.classList.add("fav-pink");
        addFavourite(id, name);
    } else {
        fav.classList.remove("fav-pink");
        deleteFavourite(id, name);
    }
});


function getAllFavourites(receta){
    const storedUserData = localStorage.getItem('favouriteMeals');
   
    if (storedUserData) {
        arrayFavoritos = JSON.parse(storedUserData);
        for (const favorito of arrayFavoritos){
            if(favorito.id === receta.meals[0].idMeal && favorito.name === receta.meals[0].strMeal) {
                favoritoEncontrado = true;
            }
        }
        if (favoritoEncontrado){
            fav.classList.add("fav-pink");
        } else {
            fav.classList.remove("fav-pink");
        }
    }     
}

function addFavourite(id, name) {    
    favoritoEncontrado = true;
    arrayFavoritos.push({'id': id, 'name': name});
    localStorage.setItem('favouriteMeals', JSON.stringify(arrayFavoritos))
}

function deleteFavourite(id, name) {
    favoritoEncontrado = false;
    localStorage.clear();
    arrayFavoritos = arrayFavoritos.filter( el => el.name !== name &&  el.id !== id)
    localStorage.setItem('favouriteMeals', JSON.stringify(arrayFavoritos))
}


/************************** OBTENCIÓ DE RECEPTA SELECCIONADA API **************************/
async function getReceta(nombreReceta) {
    try {
        // Accedeix a la API i recupera dades
        const apiUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s="+nombreReceta;
        const response = await fetch(apiUrl); 
        const receta = await response.json();
    
        //return receta;
        bandera = await getFlag(receta.meals[0].strArea)
        mostrarReceta(receta)
        getAllFavourites(receta);
        return receta;
        //console.log(receta.meals[0].idMeal);
        //console.log(receta.meals[0].strMeal);

    } catch(error){
        console.log("Error fetching data ", error);
    }
}


/************************** OBTENCIÓ DE FLAGS JSON **************************/
async function getFlag(gentilicio) {
    const response = await fetch("./module/countries.json");
    const flags = await response.json();
    for(const flag of flags.flags) {
        if(flag.code === gentilicio) {
            return flag.flag;
        }
    }
}



/************************** MOSTRAR LES DADES **************************/
async function mostrarReceta(infosReceta) {
    
    const template = document.querySelector('#informacion').content;
    
    for (const informacion of infosReceta.meals) {
        //console.log(informacion)
        const fr = template.cloneNode(true);
        //const bandera = await getFlag(informacion.strArea);
        fr.querySelector("#flag").src = 'images/flags/'+bandera;
        fr.querySelector("#name").textContent = informacion.strMeal; //+"/preview";
        fr.querySelector("#catAreaTag").textContent= informacion.strCategory + ' > ' + informacion.strArea + ' > ' + informacion.strTags;  
        fr.querySelector("#image").src = informacion.strMealThumb;
        fr.querySelector("#image").alt = informacion.strMeal;
        fr.querySelector("#instruction").textContent = informacion.strInstructions;
        const youtube = informacion.strYoutube.replaceAll("watch?v=","embed/");
        fr.querySelector("iframe").src = youtube;

        for (let i = 1; i <= 20; i++) {
            const ingrediente = 'strIngredient'+i;
            const medida = 'strMeasure'+i;
            
            if ((informacion[ingrediente] !== null && informacion[ingrediente] !== '') && (informacion[medida] !== null && informacion[medida] !== '')) {
                //console.log(informacion[medida] + '-' +informacion[ingrediente]);
                fr.querySelector("#"+CSS.escape(i)).textContent = informacion[medida] + ' - ' +informacion[ingrediente];     
            } else {
                fr.querySelector("#"+CSS.escape(i)).style.display = 'none';
            }
        }

        div.appendChild(fr); // Mostrar en el DOM*/
    }
}
