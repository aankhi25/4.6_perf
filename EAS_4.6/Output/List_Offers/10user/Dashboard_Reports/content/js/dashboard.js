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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "72 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "99 /escm/images/favicon.ico"]}, {"isController": false, "data": [1.0, 500, 1500, "60 /escm/productOffer/offerList"]}, {"isController": false, "data": [1.0, 500, 1500, "59 /escm/productOffer/offerList"]}, {"isController": false, "data": [1.0, 500, 1500, "62 /escm/messages"]}, {"isController": true, "data": [0.1, 500, 1500, "List_offers"]}, {"isController": false, "data": [0.4, 500, 1500, "49 /escm/productOffer/index"]}, {"isController": false, "data": [0.0, 500, 1500, "65 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "66 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "65 /escm/recentItem"]}, {"isController": false, "data": [0.95, 500, 1500, "33 /escm/login/auth"]}, {"isController": false, "data": [1.0, 500, 1500, "61 /escm/productOffer/getAllService"]}, {"isController": true, "data": [0.0, 500, 1500, "Hit_the_portal"]}, {"isController": false, "data": [1.0, 500, 1500, "43 /escm/images/favicon.ico"]}, {"isController": true, "data": [0.0, 500, 1500, "sp_userlogin_46"]}, {"isController": false, "data": [1.0, 500, 1500, "63 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "67 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.7323529411764705, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["72 /escm/recentItem", 10, 0, 0.0, 14.899999999999999, 36.7, 38.0, 38.0, 0.1666444474070124, 0.05549390289628049, 0.0, 6, 38]}, {"isController": false, "data": ["99 /escm/images/favicon.ico", 10, 0, 0.0, 8.5, 20.200000000000003, 21.0, 21.0, 476.19047619047615, 58.128720238095234, 0.0, 3, 21]}, {"isController": false, "data": ["60 /escm/productOffer/offerList", 10, 0, 0.0, 251.90000000000003, 351.5, 357.0, 357.0, 0.16609364359625955, 1.2226698099888718, 0.0, 185, 357]}, {"isController": false, "data": ["59 /escm/productOffer/offerList", 10, 0, 0.0, 65.8, 190.90000000000003, 204.0, 204.0, 0.1665639522294585, 0.9138244957276347, 0.0, 37, 204]}, {"isController": false, "data": ["62 /escm/messages", 10, 0, 0.0, 13.200000000000001, 20.5, 21.0, 21.0, 0.16662223407091442, 0.07501254873700347, 0.0, 7, 21]}, {"isController": true, "data": ["List_offers", 10, 0, 0.0, 2016.0000000000002, 2701.4, 2712.0, 2712.0, 3.687315634218289, 385.9495990044247, 0.0, 1259, 2712]}, {"isController": false, "data": ["49 /escm/productOffer/index", 10, 0, 0.0, 1336.3, 2041.9, 2076.0, 2076.0, 4.816955684007707, 56.827846519749514, 0.0, 868, 2076]}, {"isController": false, "data": ["65 /escm/login/doAuth?id=loginform", 10, 0, 0.0, 1842.3000000000002, 2137.2, 2144.0, 2144.0, 4.664179104477611, 40.93272650419776, 0.0, 1569, 2144]}, {"isController": false, "data": ["66 /escm/recentItem", 10, 0, 0.0, 17.6, 45.10000000000001, 47.0, 47.0, 0.16662778684973506, 0.055488354800546535, 0.0, 8, 47]}, {"isController": false, "data": ["65 /escm/recentItem", 10, 0, 0.0, 17.6, 49.10000000000001, 52.0, 52.0, 0.16660280225913401, 0.05548003473668427, 0.0, 8, 52]}, {"isController": false, "data": ["33 /escm/login/auth", 10, 0, 0.0, 197.20000000000002, 733.4000000000001, 766.0, 766.0, 13.054830287206265, 66.62553035248041, 0.0, 44, 766]}, {"isController": false, "data": ["61 /escm/productOffer/getAllService", 10, 0, 0.0, 99.60000000000001, 349.30000000000007, 363.0, 363.0, 0.16662778684973506, 0.0795712771186723, 0.0, 14, 363]}, {"isController": true, "data": ["Hit_the_portal", 10, 10, 100.0, 654.8, 1304.4, 1319.0, 1319.0, 7.58150113722517, 5123.806505875664, 0.0, 350, 1319]}, {"isController": false, "data": ["43 /escm/images/favicon.ico", 10, 0, 0.0, 10.4, 16.8, 17.0, 17.0, 588.2352941176471, 109925.89613970587, 0.0, 5, 17]}, {"isController": true, "data": ["sp_userlogin_46", 10, 0, 0.0, 2825.5, 3285.2000000000003, 3310.0, 3310.0, 3.0211480362537766, 1355.553129720544, 0.0, 2506, 3310]}, {"isController": false, "data": ["63 /escm/messages", 10, 0, 0.0, 14.4, 28.800000000000004, 30.0, 30.0, 0.16661668166216803, 0.07501004906861275, 0.0, 8, 30]}, {"isController": false, "data": ["67 /escm/messages", 10, 0, 0.0, 21.7, 63.000000000000014, 67.0, 67.0, 0.16663333999866692, 0.07501754857361861, 0.0, 9, 67]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 140, 0, 0.0, 279.38571428571413, 1318.4, 1775.2999999999997, 2116.1200000000003, 2.325311010347634, 37.92712667339346, 0.0, 3, 2144]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 140, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
