const div = document.querySelector('#main-content');
const stars = document.querySelectorAll("div.star-container div.star");

let params = new URLSearchParams(document.location.search);
let nombreReceta = params.get("s");
//console.log(typeof(nombreReceta))
nombreReceta = nombreReceta.replaceAll(' ', '%20');

let rating = 0;

// entries() proporciona pares  indice:valor
for (const [index, star] of stars.entries()) {
  //console.log(index, star)
  star.addEventListener("click", () => {
    console.log("Rating seleccionat =" , index+1);
    for (const [index2, star] of stars.entries()) {
      index >= index2 ? star.classList.add("star-pink") : star.classList.remove("star-pink");
    }
  });
}


const infosReceta = await getReceta(nombreReceta);


/************************** OBTENCIÓ DE RECEPTA SELECCIONADA API **************************/
async function getReceta(nombreReceta) {
    try {
        // Accedeix a la API i recupera dades
        const apiUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s="+nombreReceta;
        const response = await fetch(apiUrl); 
        const receta = await response.json();
    
        //return receta;
        mostrarReceta(receta)

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
        const bandera = await getFlag(informacion.strArea);
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
