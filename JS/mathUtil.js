export function getVariation(actuel,precedent) {
    // combien de % est precedent de actuel
    let diff = actuel-precedent;
    //return 100 - ((precedent*100)/actuel);
    return parseFloat(((diff*100)/actuel).toFixed(2));
}

export function formatPrice(price)
{
    let formatedPrice;
    if(price>1000000000)
    {
        return formatedPrice=`${Math.floor(price/1000000000)},${Math.floor(price%1000000)},${Math.floor(price%1000)},${(price%1000).toFixed(2)}`;
    }
    if(price>1000000)
    {
        return formatedPrice=`${Math.floor(price/1000000)},${Math.floor(price%1000)},${(price%1000).toFixed(2)}`;
    }
    if(price>1000)
    {
        return formatedPrice=`${Math.floor(price/1000)},${(price%1000).toFixed(2)}`;
    }
    if(price<1)
    {
        return price;
    }
    return price.toFixed(2);
    
}

let months = {
    1:"Jan",
    2:"Feb",
    3:"Mar",
    4:"Apr",
    5:"May",
    6:"Jun",
    7:"Jul",
    8:"Aug",
    9:"Sep",
    10:"Oct",
    11:"Nov",
    12:"Dec",
}

export function FormatTimeTochart(time,period) {
    //2022-03-30T13:29:00.0000000Z pour 24h
    //2022-03-01T11:59:00.0000000Z pour 1mois
    if(period=="1D") return time.split("T")[1].slice(0,5)
    let mois = months[parseInt(time.slice(5,7))];
    let jour = time.slice(8,10);
    return `${mois} ${jour}`;

}