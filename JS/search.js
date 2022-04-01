import {qs,createHTMLelement, qsa} from "./domUtil.js";
import {getCryptoIcon,icons,assets} from "./app.js";

export function search(input) {
    input=input.toLowerCase();
    let results = [];
    
    if(qsa(".search-rec").length!=0)
    {
        qsa(".search-rec") .forEach(element=>{
            element.remove();
        })
    }
    

    if (input.length==0 ){
        searchMenu.classList.add("inactive");  
        return null;
    } 
    searchMenu.classList.remove("inactive")
    // reset
    
    assets.forEach(element => {
        if(element["id"].slice(0,input.length).toLowerCase()==input || element["name"].slice(0,input.length).toLowerCase()==input )
        {
            results.push(element);
        }
    });    

    if(results.length==0){
        noResults.classList.remove("inactive");
        return;
    } 
    
    noResults.classList.add("inactive")
    
    results.forEach(element=>{
        try {
            createProposition(getCryptoIcon(element.id),element.name,element.id);    
        } catch (error) {
            
        }
        
    })
}


function createProposition(icon,name,id) {
    let content = ` <img src="${icon}" data-crypto=${id} alt="">
                    <p class="search-rec__name" data-crypto="${id}">${name}</p>
                    <span class="search-rec__id" data-crypto="${id}">${id}</span>`;

    let prop = createHTMLelement("div","search-rec",{"data-crypto":id},content);
    qs(".search-menu").append(prop);
}


let searchBar = qs(".crypto-section__content__right input")
let searchMenu = qs(".crypto-section__content__right menu");
let noResults = qs(".no-results");

searchBar.addEventListener("keyup",()=>{
    searchMenu.classList.remove("inactive");
    //qs(".search-rec__name").innerHTML = searchBar.value;
    search(searchBar.value);
    
})
searchBar.addEventListener("keydown",()=>{
    searchMenu.classList.remove("inactive");
    search(searchBar.value);
})

document.body.addEventListener("click",()=>{
    searchMenu.classList.add("inactive");
})

searchMenu.addEventListener("click",(e)=>{
    //console.log(e.target.dataset.crypto);
})