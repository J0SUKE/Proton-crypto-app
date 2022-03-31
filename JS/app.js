import {getVariation,formatPrice,FormatTimeTochart} from "./mathUtil.js";
import {draw} from "./graphics.js";


let domain = "https://rest.coinapi.io/v1";
//let mykey =  "ADA14CA8-B2A6-4594-A598-2D0B1DCB467B";
let mykey2 =  "FF285EA9-E9A5-40AA-B797-0F2B7661B44D";
let currency="USD";

var myheaders = new Headers();
myheaders.append("Accept","application/json");
myheaders.append("Accept-Encoding","deflate, gzip");
myheaders.append("X-CoinAPI-Key",mykey2);

let fetchInit = {
    method:"GET",
    headers:myheaders,
}

function FETCH(addr) {
    return fetch(addr,fetchInit)
    .then(response=>response.json())
}

let OHCLVperiods = ["1SEC","2SEC","3SEC","4SEC","5SEC","6SEC","10SEC","15SEC","20SEC","30SEC","1MIN","2MIN","3MIN","4MIN","5MIN","6MIN","10MIN","15MIN","20MIN","30MIN","1HRS","2HRS","3HRS","4HRS","6HRS","8HRS","12HRS","1DAY","2DAY","3DAY","5DAY","7DAY","10DAY","1MTH","2MTH","3MTH","4MTH","6MTH","1YRS","2YRS","3YRS","4YRS","5YRS"];

let icons;

function getExchange(id) {
    let call;
    let apiCall = `${domain}/exchanges`;
    call = ( id==undefined ? apiCall : `${apiCall}/${id}`);
    
    return FETCH(call);
}

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

function getRate(idBase,idQuote,time) {
    //GET /v1/exchangerate/{asset_id_base}/{asset_id_quote}?time={time}

    //ISO 8601 represents date and time by starting with the year, followed by the month, the day, the hour, the minutes, seconds and milliseconds. For example, 2020-07-10 15:00:00.000, represents the 10th of July 2020 at 3 p.m.

    let call;
    let apiCall = `${domain}/exchangerate/${idBase}/${idQuote}`;
    call = ( time==undefined ? apiCall : `${apiCall}?time=${time}`);
    
    return FETCH(call); 
}

function getRateInPeriod(idBase,idQuote,start,end,interval) {
    let apiCall = `${domain}/exchangerate/${idBase}/${idQuote}/history?time_start=${start}&time_end=${end}&period_id=${interval}`;
    return FETCH(apiCall);
}


function getOHCLV(idBase,idQuote,start,interval) {
    let apiCall = `${domain}/ohlcv/BITSTAMP_SPOT_${idBase}_${idQuote}/history?time_start=${start}&period_id=${interval}`;
    
    FETCH(apiCall);
}

function getCryptoIcon(assetId) {
    return icons.filter(element=>element.asset_id==assetId)[0].url;
}

// getIcon(40)
// .then(a=>icons=[...a])
// .then(()=>{
//     console.log(getCryptoIcon("USD"));
// })

let now = new Date;

let yesterday = new Date();
yesterday.setHours(yesterday.getHours()-24);

let week1 = new Date();
week1.setHours(week1.getHours()-24*7);

function Draw24HChart(asseet_id) {
    getRateInPeriod(asseet_id,currency,yesterday.toISOString(),now.toISOString(),"10MIN")
    .then(a=>{
        let prices = a.map(element=>element.rate_close);
        let times = a.map(element=>FormatTimeTochart(element.time_close));
        draw(prices,times)
    })
}

//Draw24HChart("BTC")
