import { assets } from "./data.js";
import {qs} from "./domUtil.js";

export function search(input) {
    input=input.toLowerCase();
    let results = [];
    assets.forEach(element => {
        if(element["id"].slice(0,input.length).toLowerCase()==input || element["name"].slice(0,input.length).toLowerCase()==input )
        {
            results.push(element);
        }
    });    

    return results;
}

//console.log(search("ru"));

let searchBar = qs(".crypto-section__content__right input")
let searchMenu = qs(".crypto-section__content__right menu");

searchBar.addEventListener("keyup",()=>{
    searchMenu.classList.remove("inactive");
    qs(".search-rec__name").innerHTML = searchBar.value;
})
searchBar.addEventListener("keydown",()=>{
    searchMenu.classList.remove("inactive");
    qs(".search-rec__name").innerHTML = searchBar.value;
})

searchBar.addEventListener("change",()=>{
    searchMenu.classList.add("inactive");
    qs(".search-rec__name").innerHTML = searchBar.value;
})
