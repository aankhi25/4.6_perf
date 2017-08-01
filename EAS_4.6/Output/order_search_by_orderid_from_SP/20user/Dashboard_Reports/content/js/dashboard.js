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

    var data = {"KoPercent": 7.142857142857143, "OkPercent": 92.85714285714286};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "13 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "99 /escm/images/favicon.ico"]}, {"isController": true, "data": [0.0, 500, 1500, "order_search_by_id"]}, {"isController": false, "data": [0.0, 500, 1500, "5 /escm/order/showOrderDetail"]}, {"isController": false, "data": [1.0, 500, 1500, "7 /escm/recentItem"]}, {"isController": false, "data": [0.0, 500, 1500, "65 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "6 /escm/messages"]}, {"isController": false, "data": [0.975, 500, 1500, "33 /escm/login/auth"]}, {"isController": true, "data": [0.0, 500, 1500, "Hit_the_portal"]}, {"isController": false, "data": [1.0, 500, 1500, "43 /escm/images/favicon.ico"]}, {"isController": false, "data": [0.0, 500, 1500, "12 /escm/order/showOrderDetail"]}, {"isController": true, "data": [0.0, 500, 1500, "sp_userlogin_46"]}, {"isController": false, "data": [1.0, 500, 1500, "23 /escm/recentItem"]}, {"isController": true, "data": [0.0, 500, 1500, "List_Orders"]}, {"isController": false, "data": [0.0, 500, 1500, "1 /escm/order/index"]}, {"isController": false, "data": [1.0, 500, 1500, "10 /escm/messages"]}, {"isController": false, "data": [0.325, 500, 1500, "4 /escm/order/searchOrder"]}, {"isController": false, "data": [1.0, 500, 1500, "22 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.5166666666666667, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["13 /escm/recentItem", 20, 0, 0.0, 15.100000000000001, 25.10000000000002, 105.79999999999994, 110.0, 181.8181818181818, 60.546875, 0.0, 6, 110]}, {"isController": false, "data": ["99 /escm/images/favicon.ico", 20, 0, 0.0, 4.8999999999999995, 8.900000000000002, 12.799999999999997, 13.0, 1538.4615384615386, 187.80048076923077, 0.0, 3, 13]}, {"isController": true, "data": ["order_search_by_id", 20, 0, 0.0, 11698.7, 23285.9, 23304.25, 23305.0, 0.8581849388543231, 62.87034367624973, 0.0, 3489, 23305]}, {"isController": false, "data": ["5 /escm/order/showOrderDetail", 20, 0, 0.0, 7596.849999999999, 14496.7, 14611.75, 14616.0, 1.3683634373289546, 31.298507414819376, 0.0, 2887, 14616]}, {"isController": false, "data": ["7 /escm/recentItem", 20, 0, 0.0, 10.250000000000002, 22.50000000000001, 25.849999999999998, 26.0, 769.2307692307693, 256.1598557692308, 0.0, 6, 26]}, {"isController": false, "data": ["65 /escm/login/doAuth?id=loginform", 20, 0, 0.0, 10454.45, 15723.300000000003, 16590.85, 16630.0, 1.2026458208057726, 10.624448004359591, 0.0, 3366, 16630]}, {"isController": false, "data": ["6 /escm/messages", 20, 0, 0.0, 13.099999999999998, 28.10000000000002, 31.849999999999998, 32.0, 625.0, 281.3720703125, 0.0, 7, 32]}, {"isController": false, "data": ["33 /escm/login/auth", 20, 0, 0.0, 106.79999999999998, 193.9, 575.8999999999996, 596.0, 33.557046979865774, 171.25891359060404, 0.0, 27, 596]}, {"isController": true, "data": ["Hit_the_portal", 20, 20, 100.0, 379.24999999999994, 533.5000000000001, 859.0999999999997, 876.0, 22.831050228310502, 15429.910459474886, 0.0, 244, 876]}, {"isController": false, "data": ["43 /escm/images/favicon.ico", 20, 0, 0.0, 6.999999999999999, 8.900000000000002, 23.24999999999999, 24.0, 833.3333333333334, 155728.35286458334, 0.0, 4, 24]}, {"isController": false, "data": ["12 /escm/order/showOrderDetail", 20, 20, 100.0, 457.45000000000005, 2026.8000000000002, 3595.749999999999, 3678.0, 5.437737901033171, 6.78124150353453, 0.0, 24, 3678]}, {"isController": true, "data": ["sp_userlogin_46", 20, 0, 0.0, 11062.9, 16217.300000000003, 17145.649999999998, 17188.0, 1.163602513381429, 522.1623666402432, 0.0, 3912, 17188]}, {"isController": false, "data": ["23 /escm/recentItem", 20, 0, 0.0, 9.3, 12.0, 25.29999999999999, 26.0, 769.2307692307693, 256.1598557692308, 0.0, 6, 26]}, {"isController": true, "data": ["List_Orders", 20, 20, 100.0, 7768.55, 15093.7, 15230.25, 15234.0, 1.312852829197847, 191.3554154153538, 0.0, 2100, 15234]}, {"isController": false, "data": ["1 /escm/order/index", 20, 0, 0.0, 7143.249999999999, 14200.600000000002, 14746.75, 14768.0, 1.3542795232936078, 25.449015079056068, 0.0, 1816, 14768]}, {"isController": false, "data": ["10 /escm/messages", 20, 0, 0.0, 13.25, 27.300000000000015, 32.75, 33.0, 606.0606060606061, 272.84564393939394, 0.0, 7, 33]}, {"isController": false, "data": ["4 /escm/order/searchOrder", 20, 0, 0.0, 3971.6999999999994, 8990.0, 9052.4, 9055.0, 2.2087244616234125, 8.060550110436223, 0.0, 398, 9055]}, {"isController": false, "data": ["22 /escm/messages", 20, 0, 0.0, 11.05, 24.700000000000028, 37.39999999999999, 38.0, 526.3157894736842, 236.94490131578948, 0.0, 6, 38]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 280, 20, 7.142857142857143, 2129.6035714285713, 10106.7, 13590.099999999993, 14973.009999999998, 16.837041491280818, 300.47436391310885, 0.0, 3, 16630]}}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "items": [{"isController": false, "data": ["404/Not Found", 20, 100.0, 7.142857142857143]}], "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);
    
        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": ["12 /escm/order/showOrderDetail", 20, 20, "404/Not Found", 20, null, null, null, null, null, null, null, null]}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 280, 20, "404/Not Found", 20, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
