import {qs,createHTMLelement, qsa} from "./domUtil.js";
import {getCryptoIcon,icons,assets} from "./app.js";

export function search(input) {
    input=input.toLowerCase();
    let results = [];
    
    // si on a deja des propositions on doit tout supprimer (sinon les nouvelles propositions viendront se superposer aux anciennes)
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
    

    assets.forEach(element => {
        // on verifie lettre par lettre 
        if(element["id"].slice(0,input.length).toLowerCase()==input || element["name"].slice(0,input.length).toLowerCase()==input )
        {
            //===on vas contabiliser uniquement les cryptos qui possedent une icone 
            let ic = getCryptoIcon(element.id)
            if(ic.length!=0)
            {
                results.push(element);
            }
            
        }
    });    

    
    let i=0;
    for (let j = 0; j < results.length; j++) {
        
        if (i<6) {
            createProposition(getCryptoIcon(results[j].id)[0].url,results[j].name,results[j].id);   
            i++;     
        }
        else break;        
    }

    if(i<results.length)
    {
        seeAll.classList.remove("inactive");
        qs(".seeAll p").innerHTML = `see all results (${results.length-i})`;

        qs(".seeAll p").addEventListener("click",(e)=>{
            e.stopImmediatePropagation();
            for (let j = i; j < results.length; j++) 
            {
                createProposition(getCryptoIcon(results[j].id)[0].url,results[j].name,results[j].id);   
            }
        })

    }else
    {
        seeAll.classList.add("inactive");
    }

    // i contient le nombre de cryptos qui possedent une icone dans results
    console.log(results.length);
    if(results.length==0){
        noResults.classList.remove("inactive");
        return;
    } 
    noResults.classList.add("inactive");
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
let seeAll = qs(".seeAll");

searchBar.addEventListener("input",()=>{
    searchMenu.classList.remove("inactive");
    search(searchBar.value);
})

document.body.addEventListener("click",()=>{
    searchMenu.classList.add("inactive");
})

searchMenu.addEventListener("click",(e)=>{
    //console.log(e.target.dataset.crypto);
})