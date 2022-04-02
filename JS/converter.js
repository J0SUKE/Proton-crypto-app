import {currentRate } from "./app.js";
import {qs} from "./domUtil.js";
import {formatPrice} from "./mathUtil.js";

let cryptoInput = qs(".converter__content input:first-child");
let currencyInput = qs(".converter__content input:last-child");

let inputs = [currencyInput,cryptoInput];
inputs.forEach(element => {
    element.addEventListener("input",(e)=>{
        //console.log(e.target.getAttribute("data-inputCurrency"));
        if(e.target.getAttribute("data-inputCurrency")=="crypto")
        {
            currencyInput.value=parseFloat(e.target.value)*currentRate
            
        }else
        {
            cryptoInput.value=parseFloat(e.target.value)/currentRate;
        }

    })
});

