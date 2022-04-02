export function qs(selector,parent=document) {
    return parent.querySelector(selector);
}

export function qsa(selector,parent=document) {
    return [...parent.querySelectorAll(selector)];
}

export function createHTMLelement(tag,className,attributes={},content="") {
    let elem = document.createElement(tag);
    elem.className = className;
    for(let prop in attributes)
    {
        elem.setAttribute(prop,attributes[prop]);
    }
    elem.innerHTML = content;
    return elem;
}

export function fillDataOnpage(currency,mainIcon,name,assetID,price,evolution,period,low,high,volume_1h,volume_1d,volume_1mnt) 
{
    let left = qs(".crypto-section__content__left");
    
    qs(".crypto-name img",left).src = mainIcon;
    qs(".crypto-name h1",left).innerHTML = name;
    qs(".crypto-name span",left).innerHTML = assetID;
    qs(".price-header",left).innerHTML=`${name} Price (${assetID})`;
    qs(".crypto-price h1",left).innerHTML = `${currency.symbol}${price}`;
    qs(".crypto-price span",left).dataset.evolution = (evolution<0 ? "negative" : "positive")
    qs(".crypto-price span p",left).innerHTML = `${Math.abs(evolution)}%`;
    
    if(period=="1D") qs(".crypto-price p:nth-child(3)",left).innerHTML = `24h`;
    else qs(".crypto-price p:nth-child(3)",left).innerHTML = `${period}`;


    qs(".ohclv .low span",left).innerHTML=`${currency.symbol}${low}`;
    qs(".ohclv .high span",left).innerHTML=`${currency.symbol}${high}`;

    let right = qsa(".crypto-section__content__right .crypto-info-right ul li");

    qs("p",right[0]).innerHTML = `${currency.symbol}${volume_1h}`;
    qs("p",right[1]).innerHTML = `${currency.symbol}${volume_1d}`;
    qs("p",right[2]).innerHTML = `${currency.symbol}${volume_1mnt}`;

    qs(".converter p:first-child").innerHTML = `${assetID} to ${currency.name} converter`;
    qs(".converter__content input:nth-child(1)").setAttribute("placeholder",assetID);
}
