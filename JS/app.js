import {getVariation,formatPrice,FormatTimeTochart} from "./mathUtil.js";
import {draw} from "./graphics.js";
import { qs,qsa,fillDataOnpage,createHTMLelement } from "./domUtil.js";


let domain = "https://rest.coinapi.io/v1";

let keys = ["ADA14CA8-B2A6-4594-A598-2D0B1DCB467B","FF285EA9-E9A5-40AA-B797-0F2B7661B44D","238E7235-207C-403F-9A4F-DCC5405550BB","59BA3C4B-744E-4B96-98D5-0B3D23311087","FA0EDA4C-C135-4ED4-B197-3773DA2480A4","FE3C3481-8A6B-4619-B3CF-911492CA3BB6","ABEE0115-732D-44FF-9D2A-13D0FB9EB371","ACABB7E9-F091-425B-8291-2EBFF364ECF3","77DBD5E3-BF80-406E-B442-FFD961AA03B7","33EA2CA7-62CF-4F42-BE48-E39EF49EFFA9","F52255F2-C524-4A9D-93CB-D83009F7E1DA"];


//let mykey3 = "939FACA6-3FF8-49CA-8672-3CA18A02FA82";
let mykey4 = "766DB079-A281-4E66-8335-22AA8E2B4550";
let mykey5 = "B1184719-DA3C-4A05-BD23-722D0CB0A1ED";


var myheaders = new Headers();
myheaders.append("Accept","application/json");
myheaders.append("Accept-Encoding","deflate, gzip");
myheaders.append("X-CoinAPI-Key","63666D7A-CDF6-43F2-BEA9-5977A50BFDB6");

let fetchInit = {
    method:"GET",
    headers:myheaders,
}

function FETCH(addr) {
    return fetch(addr,fetchInit)
    .then(response=>{
        if(response.ok)
        {
            return response.json();
        }
        else if(response.status==429)
        {
            document.querySelector(".modal-overlay").classList.add("active")
        }
        
    })
}

let currency={
    name:"USD",
    symbol : "$"
};

let greenOpac="rgb(22, 183, 123)";
let greentrans="rgba(22, 183, 123,.1)";

let redOpac="rgb(234, 57, 67)";
let redtrans="rgba(234, 57, 67,.1)";

// les exports servirons dans la partie barre de recherche (dans search.js)

export let icons; // tableau d'objets avec des liens vers les icons dans icons[i].url
export let assets; // tableau de toutes les cryptos , de la forme [{"id":asset_id,"name":name},...]
export let currentRate; // le prix de la crypto actuelle en dollar  

export function getCryptoIcon(assetId) {
    return icons.filter(element=>element.asset_id==assetId);
}

export function getAllData(asset_id) // la fonction qui vas remplir la page avec les donneées de la crypto asset_id
{
    //----on active les loaders
    loaders.forEach(element => {
        element.classList.remove("inactive");
    });
    dataContainers.forEach(element => {
        element.classList.add("transparent");
    });
    
    getAssets(asset_id)
    .then(a=>{
        // a est un tableau avec un seul element ,celui de la crypto dont l'id est asset_id
        
        isloading=true; // pendant que isloading est true on ne peut pas cliquer sur les boutons 1d 7d 1m 6m  1y
        let loadedIcon =getCryptoIcon(a[0].asset_id)[0].url;
        currentCrypto = a[0].asset_id; 
        
        currentRate=a[0].price_usd;

        storedCryptos[currentCrypto] = {
            asset_id: a[0].asset_id,
            name: a[0].name,
            icon : loadedIcon,
            price_usd: a[0].price_usd,
            volume_1day_usd: a[0].volume_1day_usd,
            volume_1hrs_usd: a[0].volume_1hrs_usd,
            volume_1mth_usd: a[0].volume_1mth_usd
        };
    }).then(()=>{
        getDataAccordingToPeriod(currentCrypto,currentPeriod);
    })
}



function getAssets(id) // retourne une promesse avec pour reponse tout les assets (ou bien celui de l'id)
{
    let call;
    let apiCall = `${domain}/assets`;
    call = ( id==undefined ? apiCall : `${apiCall}/${id}`);
    
    return FETCH(call);
}

function getIcon(size) //retourne une promesse avec toutes les icones de tout les assets avec la taille spécifiée 
{
    let call = `${domain}/assets/icons/${size}`;
    return FETCH(call);
}

function getRateInPeriod(idBase,idQuote,start,end,interval) {
    let apiCall = `${domain}/exchangerate/${idBase}/${idQuote}/history?time_start=${start}&time_end=${end}&period_id=${interval}`;
    return FETCH(apiCall);
}



function getDataAccordingToPeriod(asset_id,period) {
    let interval,start = new Date()
    
    if(period=="1D")
    {
        interval="10MIN";
        start.setHours(start.getHours()-24);
    }
    if(period=="7D")
    {
        interval="3HRS";
        start.setHours(start.getHours()-(24*7));
    }
    if(period=="1M")
    {
        interval="12HRS";
        start.setMonth(start.getMonth()-1);
    }
    if(period=="6M")
    {
        interval="3DAY";
        start.setMonth(start.getMonth()-6);
    }
    if(period=="1Y"){
        interval="5DAY";
        start.setFullYear(start.getFullYear()-1);
    }
    
    return getRateInPeriod(asset_id,currency.name,start.toISOString(),now.toISOString(),interval)
    .then(a=>{
        let prices = a.map(element=>element.rate_close);
        let times = a.map(element=>FormatTimeTochart(element.time_close,currentPeriod));

        // pour pouvoir ecraser l'ancien graph il faut supprimer le canvas dans lequel il est contenu et en recreer un nouveau
        qs("#Chart").remove();
        qs(".graph__section__content").append(createHTMLelement("canvas","",{id:"Chart"},""));
        
        // dans de rares cas il se peut que l'API retourne un tableau vide (bug ? ou juste données indispo)
        if(a.length!=0)
        {
            storedCryptos[currentCrypto].variation = getVariation(prices[prices.length-1],prices[0]);
            storedCryptos[currentCrypto].price_low = a[a.length-1].rate_low;
            storedCryptos[currentCrypto].price_high = a[a.length-1].rate_high;
        }
        else
        {
            storedCryptos[currentCrypto].variation = 0;
            storedCryptos[currentCrypto].price_low = 0;
            storedCryptos[currentCrypto].price_high = 0;
        }

        // la couleur du graph vas dependre de la variation du prix
        if(storedCryptos[currentCrypto].variation>0) draw(prices,times,storedCryptos[currentCrypto].name,greenOpac,greentrans);
        else draw(prices,times,storedCryptos[currentCrypto].name,redOpac,redtrans);
        
    }).then(()=>{

        // remplit les elements du DOM avec les données renvoyées par l'API
        fillDataOnpage(
                currency,
                storedCryptos[currentCrypto].icon,
                storedCryptos[currentCrypto].name,
                storedCryptos[currentCrypto].asset_id,
                formatPrice(storedCryptos[currentCrypto].price_usd),
                storedCryptos[currentCrypto].variation,
                currentPeriod,
                formatPrice(storedCryptos[currentCrypto].price_low),
                formatPrice(storedCryptos[currentCrypto].price_high),
                formatPrice(storedCryptos[currentCrypto].volume_1hrs_usd),
                formatPrice(storedCryptos[currentCrypto].volume_1day_usd),
                formatPrice(storedCryptos[currentCrypto].volume_1mth_usd)
                );

    }).then(()=>{
        // retire les loaders
        loaders.forEach(element => {
            element.classList.add("inactive");
        });
        dataContainers.forEach(element => {
            element.classList.remove("transparent");
        });

        isloading=false; // le chargemnt et terminé , l'utilisateur peux de nouveau cliquer
    })      
}

let storedCryptos = {}; // vas stocker toutes les donnée sur la crypto actuelle 
let currentCrypto="BTC";// vas contenir l'id de la crypto actuelle 
let currentPeriod="1D";
let now = new Date();


let loaders = [qs(".crypto-section__loader") , qs(".graph__section__loader")];
let dataContainers = [qs(".crypto-section__content") , qs(".graph__section__content")];

function filterAssets(cryptoassets) {
    // !!!!!!! TRÈS IMPORTANT !!!!!!!!!
    // il faut filter tout les assets avec des données manquantes 
    return cryptoassets.filter(element=>
                                        element.type_is_crypto && 
                                        element.price_usd!=undefined && 
                                        element.volume_1day_usd!=undefined && 
                                        element.volume_1hrs_usd!=undefined && 
                                        element.volume_1mth_usd!=undefined)
                                        .map(element=>({"id":element.asset_id,"name":element.name})
                                )
}


getAssets().then(a=>filterAssets(a))
.then((a)=>assets=[...a])
.then(()=>getIcon(40))
.then(a=>icons=[...a])
.then(()=>getAllData(currentCrypto))

let periodButtons = qsa(".graph__section__options ul li"); // les boutons ou on selectionne la periode sur le graph
let isloading=true;

periodButtons.forEach(element => {
    element.addEventListener("click",(e)=>{
        e.stopImmediatePropagation();
        if(!element.classList.contains("selected") && !isloading)//on peut cliquer que si ça ne charge pas + pas sur la periode qui est deja selectionnée
        {
            periodButtons.filter(e=>e!=element).forEach(e => {
               e.classList.remove("selected"); 
            });
            element.classList.add("selected");

            loaders[1].classList.remove("inactive");
            dataContainers[1].classList.add("transparent");


            currentPeriod=element.dataset.period;
            getDataAccordingToPeriod(currentCrypto,currentPeriod);
        }
    })
});
