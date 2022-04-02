import {qs,qsa} from "./domUtil.js";

export function draw(prices,times,name,bordercolor,bgcolor) {
    let graph = qs("#Chart");

    const data = {
        labels: times,
        datasets: [{
            label: `${name} Price in USD`,
            data: prices,
            fill: true,
            borderColor: bordercolor,
            backgroundColor:bgcolor,
            tension: 0.1,
        }]
      };
      
      
    const config = {
        type: 'line',
        data: data,
    };
      
    const myChart = new Chart(graph, config)
}