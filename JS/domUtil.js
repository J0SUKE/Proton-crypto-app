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