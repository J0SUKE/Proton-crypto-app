export function getVariation(actuel,precedent) {
    // combien de % est precedent de actuel
    let diff = actuel-precedent;
    //return 100 - ((precedent*100)/actuel);
    return ((diff*100)/actuel).toFixed(2)+"%";
}

export function formatPrice(price)
{
    let formatedPrice;
    if(price>1000000000)
    {
        return formatedPrice=`${Math.floor(price/1000000000)},${Math.floor(price/1000000)},${Math.floor(price/1000)},${(price%1000).toFixed(2)}`;
    }
    if(price>1000000)
    {
        return formatedPrice=`${Math.floor(price/1000000)},${Math.floor(price/1000)},${(price%1000).toFixed(2)}`;
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

export function FormatTimeTochart(time) {
    //2022-03-30T13:29:00.0000000Z
    return time.split("T")[1].slice(0,5)
}