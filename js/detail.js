const div = document.querySelector('#contenidodetalle');
const stars = document.querySelectorAll("div.star-container div.star");
const fav = document.querySelector("div.fav-container div.fav");

let params = new URLSearchParams(document.location.search);
let idReceta = params.get("s");

let bandera = '';

// Favoritos
let arrayFavoritos = [];
let favoritoEncontrado = false;

// Ratings
let arrayRating = [];
let ratingEncontrado = false;
let rating = 0;

// Comentarios
let arrayComentarios = [];

//console.log(typeof(idReceta))
//idReceta = idReceta.replaceAll(' ', '%20');

addEventsToStars();
const infosReceta = await getReceta(idReceta);


/*************** RATING **********************************/

function actualizaRating(event) {
    for (const [index, star] of stars.entries()) {
        if (event.target === star) {
            rating = index + 1;
        }
    }

    resetStars();
    addCssStars();
}

function resetStars() {
     // RESET DEL CSS EN TODAS LAS ESTRELLAS
     for (const star of stars){
        star.classList.remove("star-pink");
    }
    
    localStorage.removeItem("ratingMeals");
    arrayRating = arrayRating.filter( el => el.name !== infosReceta.meals[0].strMeal &&  el.id !== infosReceta.meals[0].idMeal)
    localStorage.setItem('ratingMeals', JSON.stringify(arrayRating));
}

function addCssStars() {
    // AÑADE EL CSS A LAS ESTRELLAS QUE TOCA
    paintStars();
    ratingEncontrado = true;
    arrayRating.push({'id': infosReceta.meals[0].idMeal, 'name': infosReceta.meals[0].strMeal, 'rating': rating});
    localStorage.setItem('ratingMeals', JSON.stringify(arrayRating));
}

function addEventsToStars() {
    for (const star of stars){
        star.addEventListener('click', actualizaRating)
    }
}

function paintStars() {
   for (const [index, star] of stars.entries()){
        if (index < rating) {
            star.classList.add("star-pink");
        }
    }
}

function getRating(receta){
    const storedUserData = localStorage.getItem('ratingMeals');
   
    if (storedUserData) {
        arrayRating = JSON.parse(storedUserData);
        for (const rate of arrayRating){
            if(rate.id === receta.meals[0].idMeal && rate.name === receta.meals[0].strMeal) {
                ratingEncontrado = true;
                rating = rate.rating;
            }
        }
        
        if (ratingEncontrado){
           paintStars(rating);
        }
    }     
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
    //localStorage.clear();
    localStorage.removeItem("favouriteMeals");
    arrayFavoritos = arrayFavoritos.filter( el => el.name !== name &&  el.id !== id)
    localStorage.setItem('favouriteMeals', JSON.stringify(arrayFavoritos))
}


/************************** OBTENCIÓ DE RECEPTA SELECCIONADA API **************************/
async function getReceta(idReceta) {
    try {
        // Accedeix a la API i recupera dades
        const apiUrl = "https://www.themealdb.com/api/json/v1/1/lookup.php?i="+idReceta;
        const response = await fetch(apiUrl); 
        const receta = await response.json();
    
        //return receta;
        bandera = await getFlag(receta.meals[0].strArea)
        mostrarReceta(receta)
        getAllFavourites(receta);
        getRating(receta);
        getComments(receta);
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
                fr.querySelector("#"+CSS.escape(i)).textContent = informacion[medida] + ' ' +informacion[ingrediente];     
            } else {
                fr.querySelector("#"+CSS.escape(i)).style.display = 'none';
            }
        }

        div.appendChild(fr); // Mostrar en el DOM*/
    }
}


/************ COMMENTS ****************************/

function mostrarComentarios(comentario) {

    const div = document.querySelector('#comentariosTemplates').content;
    const listaComentarios = document.querySelector('#listaComentarios');

    const fr = div.cloneNode(true);
     
    fr.querySelector("#userImage").alt = comentario.username;
    fr.querySelector("#usernameListaComentario").textContent = comentario.username;
    fr.querySelector("#dateListaComentario").textContent = comentario.date;
    fr.querySelector("#textoListaComentario").textContent = comentario.comment;
       
    listaComentarios.appendChild(fr);    
}

function getComments(receta) {
    const storedUserData = localStorage.getItem('commentMeals');
   
    if (storedUserData) {
        arrayComentarios = JSON.parse(storedUserData);

        for (const comentario of arrayComentarios){
            if(comentario.id === receta.meals[0].idMeal && comentario.mealName === receta.meals[0].strMeal) {
                mostrarComentarios(comentario);
            }
        }
    }
}

function guardarComentariosLocalStorage (idReceta, username, comment, date) {
    arrayComentarios.push({'id': idReceta, 'mealName':  infosReceta.meals[0].strMeal, 'username': username, 'comment' : comment, 'date' : date});
    localStorage.setItem('commentMeals', JSON.stringify(arrayComentarios))
}

function limpiarFormulario(usuario, texto) {
    inputUsername.value = "";
    textareaComentario.value = "";
}

function validarFormulario() {
        
    const inputUsername = document.querySelector('#inputUsername').value;
    const textareaComentario = document.querySelector('#textareaComentario').value;
    const date = new Date();
    const day = (date.getDate() < 10 ? '0' : '') + date.getDate();
    const month = (date.getMonth() < 10 ? '0' : '') + date.getMonth();
    const year = date.getFullYear();
    const hours = (date.getHours() < 10 ? '0' : '') + date.getHours();
    const minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    const fecha = `${day}/${month}/${year} - ${hours}:${minutes}`;
    
    if (inputUsername.length > 0 && textareaComentario.length > 0) {

        const div = document.querySelector('#comentariosTemplates').content;
        const listaComentarios = document.querySelector('#listaComentarios');

        const fr = div.cloneNode(true);
        
        fr.querySelector("#usernameListaComentario").textContent = inputUsername;
        fr.querySelector("#dateListaComentario").textContent = fecha;
        fr.querySelector("#textoListaComentario").textContent = textareaComentario;
        
        listaComentarios.appendChild(fr); // Mostrar en el DOM*/
        guardarComentariosLocalStorage(idReceta, inputUsername, textareaComentario, fecha);
        
        const modalComentario = new bootstrap.Modal(document.getElementById('modalComentario'));
        modalComentario.show();
        setTimeout(function(){
            modalComentario.hide()
        }, 2000);

        limpiarFormulario(inputUsername, textareaComentario);
    }
}

const botonComentario = document.querySelector('#botonComentario');
botonComentario.addEventListener('click', validarFormulario);