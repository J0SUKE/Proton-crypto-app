import {getVariation,formatPrice,FormatTimeTochart} from "./mathUtil.js";
import {draw} from "./graphics.js";
import { qs,qsa,fillDataOnpage,createHTMLelement } from "./domUtil.js";


let domain = "https://rest.coinapi.io/v1";
let mykey  = "ADA14CA8-B2A6-4594-A598-2D0B1DCB467B";
let mykey2 = "FF285EA9-E9A5-40AA-B797-0F2B7661B44D";
let mykey3 = "238E7235-207C-403F-9A4F-DCC5405550BB";
let mykey4 = "59BA3C4B-744E-4B96-98D5-0B3D23311087";
let mykey5 = "FA0EDA4C-C135-4ED4-B197-3773DA2480A4";

let mykey7 = "FE3C3481-8A6B-4619-B3CF-911492CA3BB6";
let mykey8 = "ABEE0115-732D-44FF-9D2A-13D0FB9EB371";
let mykey9 = "ACABB7E9-F091-425B-8291-2EBFF364ECF3";
let mykey10 = "77DBD5E3-BF80-406E-B442-FFD961AA03B7";
let mykey11 = "33EA2CA7-62CF-4F42-BE48-E39EF49EFFA9";


var myheaders = new Headers();
myheaders.append("Accept","application/json");
myheaders.append("Accept-Encoding","deflate, gzip");
myheaders.append("X-CoinAPI-Key",mykey11);

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




let OHCLVperiods = ["1SEC","2SEC","3SEC","4SEC","5SEC","6SEC","10SEC","15SEC","20SEC","30SEC","1MIN","2MIN","3MIN","4MIN","5MIN","6MIN","10MIN","15MIN","20MIN","30MIN","1HRS","2HRS","3HRS","4HRS","6HRS","8HRS","12HRS","1DAY","2DAY","3DAY","5DAY","7DAY","10DAY","1MTH","2MTH","3MTH","4MTH","6MTH","1YRS","2YRS","3YRS","4YRS","5YRS"];

export let icons; // tableau d'objets avec des liens vers les icons dans icons[i].url
export let assets; // tableau de toutes les cryptos et monnaies

function getAssets(id) {
    let call;
    let apiCall = `${domain}/assets`;
    call = ( id==undefined ? apiCall : `${apiCall}/${id}`);
    
    return FETCH(call);
}

function getIcon(size) {
    let call = `${domain}/assets/icons/${size}`;
    return FETCH(call);
}

function getRateInPeriod(idBase,idQuote,start,end,interval) {
    let apiCall = `${domain}/exchangerate/${idBase}/${idQuote}/history?time_start=${start}&time_end=${end}&period_id=${interval}`;
    return FETCH(apiCall);
}

export function getCryptoIcon(assetId) {
    return icons.filter(element=>element.asset_id==assetId);
}

export function getAllData(asset_id)
{
    loaders.forEach(element => {
        element.classList.remove("inactive");
    });
    dataContainers.forEach(element => {
        element.classList.add("transparent");
    });
    
    getAssets(asset_id)
    .then(a=>{
        isloading=true;
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
        return a;
    }).then((a)=>{
        getDataAccordingToPeriod(currentCrypto,currentPeriod);
    })
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

        qs("#Chart").remove();
        qs(".graph__section__content").append(createHTMLelement("canvas","",{id:"Chart"},""));
        

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

        if(storedCryptos[currentCrypto].variation>0) draw(prices,times,greenOpac,greentrans);
        else draw(prices,times,redOpac,redtrans);
        
    }).then(()=>{

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
        loaders.forEach(element => {
            element.classList.add("inactive");
        });
        dataContainers.forEach(element => {
            element.classList.remove("transparent");
        });

        isloading=false;
    })      
}

let storedCryptos = {}
let currentCrypto="BTC";
let currentPeriod="1D";
export let currentRate;
let now = new Date();


let loaders = [qs(".crypto-section__loader") , qs(".graph__section__loader")];
let dataContainers = [qs(".crypto-section__content") , qs(".graph__section__content")];

getAssets().then(a=>a.filter(element=>element.type_is_crypto && element.price_usd!=undefined && element.volume_1day_usd!=undefined && element.volume_1hrs_usd!=undefined && element.volume_1mth_usd!=undefined).map(element=>({"id":element.asset_id,"name":element.name})))
.then((a)=>assets=[...a])
.then(()=>getIcon(40))
.then(a=>icons=[...a])
.then(()=>getAllData(currentCrypto))

let periodButtons = qsa(".graph__section__options ul li");
let isloading=true;

periodButtons.forEach(element => {
    element.addEventListener("click",(e)=>{
        e.stopImmediatePropagation();
        if(!element.classList.contains("selected") && !isloading)
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
