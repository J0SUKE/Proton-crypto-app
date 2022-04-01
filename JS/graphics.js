import {qs,qsa} from "./domUtil.js";


let graph = qs("#Chart");

// let prices = [47258.2557543526, 47246.926350067544, 47334.15208639476, 47265.60939314267, 47156.80616358172, 47188.78044440165, 46962.31465055276, 46991.91722294607, 47003.15925366442, 46883.463353063795, 47134.147610246975, 47139.58053919226, 47161.480251588815, 47225.76825159236, 47166.98227258943, 47018.267285040725, 47044.59478018195, 46972.62833916422, 47043.25563722687, 47076.58861340267, 47180.06683911091, 47105.32743334121, 47206.515041851664, 47202.07479465035, 47267.99152008836, 47318.785464002845, 47278.15177482811, 47294.80668322881, 47254.159395389586, 47240.63505229014, 47326.93331580037, 47565.82821347975, 47673.74718600825, 47687.040926397174, 47494.27933686978, 47524.200012848625, 47415.222758274955, 47339.50110755322, 47225.78711673397, 47082.58726439039, 47063.20676804074, 47004.84545430049, 47010.92167752531, 46973.48556641197, 47076.478781130805, 47113.5979397559, 47093.63629726007, 47057.31734394041, 47071.45126523486, 47166.09827729781, 47241.358060876395, 47213.5065774787, 47194.48262592185, 47194.9903924825, 47277.461974015794, 47022.748410498774, 46975.62808656028, 46976.16702744866, 46920.131652306314, 46965.14278586658, 47046.4196116272, 47017.773721736485, 47070.5643713052, 47180.718998206015, 47138.04835845609, 47166.28476978446, 47131.69355966137, 47141.591412854, 47034.70347141542, 47024.14847175959, 47149.69570551267, 47167.94310705469, 47226.40348760567, 47264.79034093129, 47174.11847306695, 47230.725269223505, 47295.02362528101, 47305.73986662569, 47271.354348069784, 47340.219866909116, 47421.02197249824, 47345.1736634051, 47363.463626387726, 47324.40576239548, 47243.43277132268, 47218.096409885475, 47240.110329283874, 47162.53426631904, 47238.04152804947, 47243.981614764554, 47164.17441162434, 47159.04926136149, 47097.19206827282, 47131.942548104824, 47094.01802463704, 47069.2504942212, 47044.63713191311, 47022.47516120344, 47029.10755603836, 47008.20808534256];

// let labels = ['14:56', '15:6', '15:16', '15:26', '15:36', '15:46', '15:56', '16:6', '16:16', '16:26', '16:36', '16:46', '16:56', '17:6', '17:16', '17:26', '17:36', '17:46', '17:56', '18:6', '18:16', '18:26', '18:36', '18:46', '18:56', '19:6', '19:16', '19:26', '19:36', '19:46', '19:56', '20:6', '20:16', '20:26', '20:36', '20:46', '20:56', '21:6', '21:16', '21:26', '21:36', '21:46', '21:56', '22:6', '22:16', '22:26', '22:36', '22:46', '22:56', '23:6', '23:16', '23:26', '23:36', '23:46', '23:56', '0:6', '0:16', '0:26', '0:36', '0:46', '0:56', '1:6', '1:16', '1:26', '1:36', '1:46', '1:56', '2:6', '2:16', '2:26', '2:36', '2:46', '2:56', '3:6', '3:16', '3:26', '3:36', '3:46', '3:56', '4:6', '4:16', '4:26', '4:36', '4:46', '4:56', '5:6', '5:16', '5:26', '5:36', '5:46', '5:56', '6:6', '6:16', '6:26', '6:36', '6:46', '6:56', '7:6', '7:16', '7:26'];

export function draw(prices,times) {
    const data = {
        labels: times,
        datasets: [{
            label: 'Price',
            data: prices,
            fill: true,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor:'rgba(75, 192, 192,.1)',
            tension: 0.1,
            // pointRadius:0,
            // pointHitRadius:10
        }]
      };
      
      
    const config = {
        type: 'line',
        data: data,
    };
      
    const myChart = new Chart(graph, config)
}




//draw(prices,labels)