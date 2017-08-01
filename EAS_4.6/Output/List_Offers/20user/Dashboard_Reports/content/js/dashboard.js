/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();
    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter)
        regexp = new RegExp(seriesFilter, 'i');

    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"KoPercent": 0.0, "OkPercent": 100.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
			"color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "72 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "99 /escm/images/favicon.ico"]}, {"isController": false, "data": [1.0, 500, 1500, "60 /escm/productOffer/offerList"]}, {"isController": false, "data": [1.0, 500, 1500, "59 /escm/productOffer/offerList"]}, {"isController": false, "data": [1.0, 500, 1500, "62 /escm/messages"]}, {"isController": true, "data": [0.15, 500, 1500, "List_offers"]}, {"isController": false, "data": [0.5, 500, 1500, "49 /escm/productOffer/index"]}, {"isController": false, "data": [0.125, 500, 1500, "65 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "66 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "65 /escm/recentItem"]}, {"isController": false, "data": [0.975, 500, 1500, "33 /escm/login/auth"]}, {"isController": false, "data": [1.0, 500, 1500, "61 /escm/productOffer/getAllService"]}, {"isController": true, "data": [0.0, 500, 1500, "Hit_the_portal"]}, {"isController": false, "data": [1.0, 500, 1500, "43 /escm/images/favicon.ico"]}, {"isController": true, "data": [0.0, 500, 1500, "sp_userlogin_46"]}, {"isController": false, "data": [1.0, 500, 1500, "63 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "67 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.75, 500, 1500, "Total"]}}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["72 /escm/recentItem", 20, 0, 0.0, 14.099999999999998, 39.60000000000005, 45.8, 46.0, 434.7826086956522, 144.78600543478262, 0.0, 6, 46]}, {"isController": false, "data": ["99 /escm/images/favicon.ico", 20, 0, 0.0, 10.15, 16.800000000000004, 34.09999999999999, 35.0, 571.4285714285714, 69.75446428571428, 0.0, 3, 35]}, {"isController": false, "data": ["60 /escm/productOffer/offerList", 20, 0, 0.0, 247.89999999999998, 369.70000000000005, 374.85, 375.0, 53.333333333333336, 392.6041666666667, 0.0, 141, 375]}, {"isController": false, "data": ["59 /escm/productOffer/offerList", 20, 0, 0.0, 56.9, 112.00000000000004, 132.04999999999998, 133.0, 150.37593984962405, 825.0117481203007, 0.0, 29, 133]}, {"isController": false, "data": ["62 /escm/messages", 20, 0, 0.0, 22.2, 67.70000000000009, 142.29999999999995, 146.0, 136.986301369863, 61.67059075342466, 0.0, 7, 146]}, {"isController": true, "data": ["List_offers", 20, 0, 0.0, 1654.85, 1986.7, 2205.75, 2217.0, 9.021199819576003, 944.2465183806946, 0.0, 1142, 2217]}, {"isController": false, "data": ["49 /escm/productOffer/index", 20, 0, 0.0, 1060.4, 1352.3000000000002, 1368.55, 1369.0, 14.609203798392988, 172.35436449963478, 0.0, 823, 1369]}, {"isController": false, "data": ["65 /escm/login/doAuth?id=loginform", 20, 0, 0.0, 1639.15, 1900.3, 1990.3, 1995.0, 10.025062656641603, 91.55946506892231, 0.0, 1203, 1995]}, {"isController": false, "data": ["66 /escm/recentItem", 20, 0, 0.0, 14.100000000000005, 23.0, 29.649999999999995, 30.0, 666.6666666666666, 222.00520833333334, 0.0, 6, 30]}, {"isController": false, "data": ["65 /escm/recentItem", 20, 0, 0.0, 12.649999999999999, 19.0, 32.29999999999999, 33.0, 606.0606060606061, 201.82291666666666, 0.0, 7, 33]}, {"isController": false, "data": ["33 /escm/login/auth", 20, 0, 0.0, 140.29999999999998, 429.1000000000004, 649.4499999999998, 660.0, 30.303030303030305, 154.65198863636363, 0.0, 35, 660]}, {"isController": false, "data": ["61 /escm/productOffer/getAllService", 20, 0, 0.0, 64.25000000000001, 193.80000000000004, 217.85, 219.0, 91.32420091324201, 43.61087328767123, 0.0, 13, 219]}, {"isController": true, "data": ["Hit_the_portal", 20, 20, 100.0, 537.5, 745.7, 959.7499999999998, 971.0, 20.59732234809475, 13920.289971678681, 0.0, 320, 971]}, {"isController": false, "data": ["43 /escm/images/favicon.ico", 20, 0, 0.0, 10.25, 19.800000000000004, 20.0, 20.0, 1000.0, 186874.0234375, 0.0, 4, 20]}, {"isController": true, "data": ["sp_userlogin_46", 20, 0, 0.0, 2549.0000000000005, 2913.2, 3030.9, 3037.0, 6.585446163977609, 2957.1627659902865, 0.0, 1964, 3037]}, {"isController": false, "data": ["63 /escm/messages", 20, 0, 0.0, 19.549999999999997, 60.50000000000007, 107.69999999999996, 110.0, 181.8181818181818, 81.85369318181819, 0.0, 7, 110]}, {"isController": false, "data": ["67 /escm/messages", 20, 0, 0.0, 28.65, 84.20000000000005, 135.39999999999998, 138.0, 144.92753623188406, 65.24569746376811, 0.0, 8, 138]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 280, 0, 0.0, 238.61071428571418, 1065.9, 1531.1999999999998, 1895.33, 140.35087719298244, 2292.7832276002505, 0.0, 3, 1995]}}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Percentile 1
            case 5:
            // Percentile 2
            case 6:
            // Percentile 3
            case 7:
            // Throughput
            case 8:
            // Kbytes/s
            case 9:
            // Sent Kbytes/s
            case 10:
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0);
    
    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "items": [], "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);
    
        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 280, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
