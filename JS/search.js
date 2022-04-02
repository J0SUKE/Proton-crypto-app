import {qs,createHTMLelement, qsa} from "./domUtil.js";
import {getCryptoIcon,icons,assets,getAllData} from "./app.js";
import {getSize} from "./mathUtil.js";

let recentSearches ={};


export function search(input) // vas faire des recherches et generer des propositions dans la barre de recherche
{
    input=input.toLowerCase();
    let results = [];// vas contenir les assets proposées 
    
    // si on a deja des propositions on doit tout supprimer (sinon les nouvelles propositions viendront se superposer aux anciennes)
    if(qsa(".search-rec").length!=0)
    {
        qsa(".search-rec").forEach(element=>{
            element.remove();
        })
    }
    
    if (input.length==0 ){
        noResults.classList.add("inactive");
        seeAll.classList.add("inactive");
        pcryptoassets.classList.add("inactive");
        if(getSize(recentSearches)!=0)
        {
            searchHistory.classList.remove("inactive");
        }
        else // dans le cas ou la barre est vide et qu'il n'ya aucune recherche on descative le menu
        {
            searchMenu.classList.add("inactive")
        }
        
        return null;
    } 
    searchMenu.classList.remove("inactive")
    searchHistory.classList.add("inactive");
    

    assets.forEach(element => {
        // on verifie lettre par lettre 
        if(element["id"].slice(0,input.length).toLowerCase()==input || element["name"].slice(0,input.length).toLowerCase()==input )
        {
            //===on vas contabiliser uniquement les cryptos qui possedent une icone 
            let ic = getCryptoIcon(element.id); // pour les cryptos qui n'en ont pas ceci vas renvoyer un tableau vide
            if(ic.length!=0)
            {
                results.push(element);
            }
            
        }
    });    

    
    let i=0; // on vas au depart n'afficher que 6 propositions 
    for (let j = 0; j < results.length; j++) {
        
        if (i<6) {
            createProposition(getCryptoIcon(results[j].id)[0].url , results[j].name,results[j].id,true);   
            i++;     
        }
        else createProposition(getCryptoIcon(results[j].id)[0].url , results[j].name,results[j].id,false);   ;        

        // celles qui ont le dernier argument en false auront la classe inactive (display:none)
    }


    if(i<results.length) // si il y'a des propositions qui n'ont pas été affichées (car plus de 6)
    {
        seeAll.classList.remove("inactive");
        qs(".seeAll p").innerHTML = `see all results (${results.length-i})`;

        qs(".seeAll p").addEventListener("click",(e)=>{
            e.stopImmediatePropagation();
            searchBar.select();
            getMoreResults(); // cette fontion vas afficher toutes les autres propositions
            seeAll.classList.add("inactive");
        })

    }else
    {
        seeAll.classList.add("inactive");
    }

    if(results.length==0) // si pas de propositions on affiche no results
    {
        noResults.classList.remove("inactive");
        return;
    } 
    noResults.classList.add("inactive");
}


function createProposition(icon,name,id,visible) {
    let content = ` <img src="${icon}" data-crypto_id=${id} data-crypto_name=${name} alt="">
                    <p class="search-rec__name" data-crypto_id="${id}" data-crypto_name=${name}>${name}</p>
                    <span class="search-rec__id" data-crypto_id="${id}" data-crypto_name=${name}>${id}</span>`;

    let prop;
    if(visible)
    {
        prop = createHTMLelement("div","search-rec",{"data-crypto_id":id,"data-crypto_name":name},content);
    }
    else prop = createHTMLelement("div","search-rec inactive",{"data-crypto_id":id,"data-crypto_name":name},content)
    
    qs(".search-menu").append(prop);
}

function createSearchHistoryrec(asset_id,name) {
    
    if(qsa(".search-history ul li").length==3)
    {
        qsa(".search-history ul li")[2].remove();
    }
    
    let content = `
                <img data-crypto_id=${asset_id} data-crypto_name=${name} src="${getCryptoIcon(asset_id)[0].url}" alt="">
                <p data-crypto_id=${asset_id} data-crypto_name=${name}>${name}</p>
                <span data-crypto_id=${asset_id} data-crypto_name=${name}>${asset_id}</span>`;
    let elem = createHTMLelement("li","",{"data-crypto_id":asset_id,"data-crypto_name":name},content);
    qs(".search-history ul").prepend(elem);
}

function fillHistorySection() {
    for(let elem in recentSearches)
    {
        if(!recentSearches[elem]["printed"])
        {
            createSearchHistoryrec(recentSearches[elem]["id"],elem);
            recentSearches[elem]["printed"]=true;
        }
    }

}

function emptySearchBar() {
    searchBar.value="";
    searchMenu.classList.add("inactive");
}



let searchBar = qs("header input")
let searchMenu = qs("header menu");
let noResults = qs(".no-results");
let seeAll = qs(".seeAll");
let pcryptoassets = qs(".cryptoassets");
let searchHistory = qs(".search-history");


searchBar.addEventListener("click",(e)=>{
    e.stopImmediatePropagation();
    searchMenu.classList.remove("inactive");
    search(searchBar.value)
})


searchBar.addEventListener("input",()=>{
    //searchMenu.classList.remove("inactive");
    pcryptoassets.classList.remove("inactive");
    search(searchBar.value);
})

document.body.addEventListener("click",()=>{
    searchMenu.classList.add("inactive");
    pcryptoassets.classList.add("inactive");
})

searchMenu.addEventListener("click",(e)=>{
    e.stopImmediatePropagation();
    if(recentSearches[e.target.dataset.crypto_name]==undefined || !recentSearches[e.target.dataset.crypto_name].printed)
    {
        recentSearches[e.target.dataset.crypto_name]={id:(e.target.dataset.crypto_id),printed:false};
        fillHistorySection();
    }
    emptySearchBar();
    getAllData(e.target.dataset.crypto_id)
    
    
})

function getMoreResults() {
    qsa(".search-rec").forEach(element => {
        element.classList.remove("inactive");
    });
}
