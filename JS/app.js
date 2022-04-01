import {getVariation,formatPrice,FormatTimeTochart} from "./mathUtil.js";
import {draw} from "./graphics.js";
import { qs,qsa,fillDataOnpage } from "./domUtil.js";


let domain = "https://rest.coinapi.io/v1";
let mykey =  "ADA14CA8-B2A6-4594-A598-2D0B1DCB467B";
//let mykey =  "FF285EA9-E9A5-40AA-B797-0F2B7661B44D";
let currency={
    name:"USD",
    symbol : "$"
};

var myheaders = new Headers();
myheaders.append("Accept","application/json");
myheaders.append("Accept-Encoding","deflate, gzip");
myheaders.append("X-CoinAPI-Key",mykey);

let fetchInit = {
    method:"GET",
    headers:myheaders,
}

function FETCH(addr) {
    return fetch(addr,fetchInit)
    .then(response=>response.json())
}

let OHCLVperiods = ["1SEC","2SEC","3SEC","4SEC","5SEC","6SEC","10SEC","15SEC","20SEC","30SEC","1MIN","2MIN","3MIN","4MIN","5MIN","6MIN","10MIN","15MIN","20MIN","30MIN","1HRS","2HRS","3HRS","4HRS","6HRS","8HRS","12HRS","1DAY","2DAY","3DAY","5DAY","7DAY","10DAY","1MTH","2MTH","3MTH","4MTH","6MTH","1YRS","2YRS","3YRS","4YRS","5YRS"];

let icons; // tableau d'objets avec des liens vers les icons dans icons[i].url

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

function getCryptoIcon(assetId) {
    return icons.filter(element=>element.asset_id==assetId)[0].url;
}

let storedCryptos = {}
let currentCrypto;
let currentPeriod="1D";
let now = new Date();


getIcon(40)
.then(a=>icons=[...a])
.then(()=>getAllData("BTC"))


function getAllData(asset_id)
{
    getAssets(asset_id)
    .then(a=>{
        let loadedIcon =getCryptoIcon(a[0].asset_id);
        currentCrypto = a[0].asset_id;
        
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
        getDataAccordingToPeriod(currentCrypto,currentPeriod)
        .then(a=>{
            console.log(a);
            let prices = a.map(element=>element.rate_close);
            let times = a.map(element=>FormatTimeTochart(element.time_close,currentPeriod));

            draw(prices,times);

            storedCryptos[currentCrypto].variation_24h = getVariation(prices[prices.length-1],prices[0]);
            storedCryptos[currentCrypto].price_low = a[a.length-1].rate_low;
            storedCryptos[currentCrypto].price_high = a[a.length-1].rate_high;
        }).then(()=>{

            fillDataOnpage(
                    currency,
                    storedCryptos[currentCrypto].icon,
                    storedCryptos[currentCrypto].name,
                    storedCryptos[currentCrypto].asset_id,
                    formatPrice(storedCryptos[currentCrypto].price_usd),
                    storedCryptos[currentCrypto].variation_24h,
                    currentPeriod,
                    formatPrice(storedCryptos[currentCrypto].price_low),
                    formatPrice(storedCryptos[currentCrypto].price_high),
                    formatPrice(storedCryptos[currentCrypto].volume_1hrs_usd),
                    formatPrice(storedCryptos[currentCrypto].volume_1day_usd),
                    formatPrice(storedCryptos[currentCrypto].volume_1mth_usd)
                    );

        })
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
    
    return getRateInPeriod(asset_id,currency.name,start.toISOString(),now.toISOString(),interval);      
}