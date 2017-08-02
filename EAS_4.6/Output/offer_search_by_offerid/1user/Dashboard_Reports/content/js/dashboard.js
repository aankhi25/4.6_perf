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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "186 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "72 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "99 /escm/images/favicon.ico"]}, {"isController": false, "data": [1.0, 500, 1500, "60 /escm/productOffer/offerList"]}, {"isController": false, "data": [1.0, 500, 1500, "178 /escm/images/favicon.ico"]}, {"isController": false, "data": [1.0, 500, 1500, "59 /escm/productOffer/offerList"]}, {"isController": false, "data": [1.0, 500, 1500, "62 /escm/messages"]}, {"isController": false, "data": [0.0, 500, 1500, "133 /escm/productOffer/productModelSearch/productModelSearch"]}, {"isController": true, "data": [0.0, 500, 1500, "List_offers"]}, {"isController": false, "data": [0.0, 500, 1500, "49 /escm/productOffer/index"]}, {"isController": false, "data": [0.0, 500, 1500, "65 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "66 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "65 /escm/recentItem"]}, {"isController": false, "data": [0.5, 500, 1500, "33 /escm/login/auth"]}, {"isController": false, "data": [1.0, 500, 1500, "61 /escm/productOffer/getAllService"]}, {"isController": true, "data": [0.0, 500, 1500, "Hit_the_portal"]}, {"isController": false, "data": [1.0, 500, 1500, "43 /escm/images/favicon.ico"]}, {"isController": true, "data": [0.0, 500, 1500, "sp_userlogin_46"]}, {"isController": false, "data": [0.5, 500, 1500, "184 /escm/productOffer/showOfferDetails"]}, {"isController": false, "data": [1.0, 500, 1500, "63 /escm/messages"]}, {"isController": true, "data": [0.0, 500, 1500, "Offer_search_by_id"]}, {"isController": false, "data": [1.0, 500, 1500, "67 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "185 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.6521739130434783, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["186 /escm/recentItem", 1, 0, 0.0, 14.0, 14.0, 14.0, 14.0, 71.42857142857143, 23.78627232142857, 0.0, 14, 14]}, {"isController": false, "data": ["72 /escm/recentItem", 1, 0, 0.0, 8.0, 8.0, 8.0, 8.0, 125.0, 41.6259765625, 0.0, 8, 8]}, {"isController": false, "data": ["99 /escm/images/favicon.ico", 1, 0, 0.0, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 20.345052083333332, 0.0, 6, 6]}, {"isController": false, "data": ["60 /escm/productOffer/offerList", 1, 0, 0.0, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 32.28652686403509, 0.0, 228, 228]}, {"isController": false, "data": ["178 /escm/images/favicon.ico", 1, 0, 0.0, 5.0, 5.0, 5.0, 5.0, 200.0, 24.4140625, 0.0, 5, 5]}, {"isController": false, "data": ["59 /escm/productOffer/offerList", 1, 0, 0.0, 49.0, 49.0, 49.0, 49.0, 20.408163265306122, 111.96588010204081, 0.0, 49, 49]}, {"isController": false, "data": ["62 /escm/messages", 1, 0, 0.0, 20.0, 20.0, 20.0, 20.0, 50.0, 22.509765625, 0.0, 20, 20]}, {"isController": false, "data": ["133 /escm/productOffer/productModelSearch/productModelSearch", 1, 0, 0.0, 11536.0, 11536.0, 11536.0, 11536.0, 0.08668515950069348, 1.8093833976248266, 0.0, 11536, 11536]}, {"isController": true, "data": ["List_offers", 1, 0, 0.0, 11228.0, 11228.0, 11228.0, 11228.0, 0.08906305664410402, 9.323092937299608, 0.0, 11228, 11228]}, {"isController": false, "data": ["49 /escm/productOffer/index", 1, 0, 0.0, 10572.0, 10572.0, 10572.0, 10572.0, 0.09458948164964057, 1.1168763892830118, 0.0, 10572, 10572]}, {"isController": false, "data": ["65 /escm/login/doAuth?id=loginform", 1, 0, 0.0, 20853.0, 20853.0, 20853.0, 20853.0, 0.04795473073418693, 0.4497629237999328, 0.0, 20853, 20853]}, {"isController": false, "data": ["66 /escm/recentItem", 1, 0, 0.0, 10.0, 10.0, 10.0, 10.0, 100.0, 33.30078125, 0.0, 10, 10]}, {"isController": false, "data": ["65 /escm/recentItem", 1, 0, 0.0, 12.0, 12.0, 12.0, 12.0, 83.33333333333333, 27.750651041666668, 0.0, 12, 12]}, {"isController": false, "data": ["33 /escm/login/auth", 1, 0, 0.0, 610.0, 610.0, 610.0, 610.0, 1.639344262295082, 8.36641905737705, 0.0, 610, 610]}, {"isController": false, "data": ["61 /escm/productOffer/getAllService", 1, 0, 0.0, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 2.436423788265306, 0.0, 196, 196]}, {"isController": true, "data": ["Hit_the_portal", 1, 1, 100.0, 999.0, 999.0, 999.0, 999.0, 1.001001001001001, 676.5065847097097, 0.0, 999, 999]}, {"isController": false, "data": ["43 /escm/images/favicon.ico", 1, 0, 0.0, 12.0, 12.0, 12.0, 12.0, 83.33333333333333, 15572.835286458332, 0.0, 12, 12]}, {"isController": true, "data": ["sp_userlogin_46", 1, 0, 0.0, 21562.0, 21562.0, 21562.0, 21562.0, 0.04637788702346721, 20.83716796331509, 0.0, 21562, 21562]}, {"isController": false, "data": ["184 /escm/productOffer/showOfferDetails", 1, 0, 0.0, 747.0, 747.0, 747.0, 747.0, 1.3386880856760375, 12.241675033467201, 0.0, 747, 747]}, {"isController": false, "data": ["63 /escm/messages", 1, 0, 0.0, 7.0, 7.0, 7.0, 7.0, 142.85714285714286, 64.31361607142857, 0.0, 7, 7]}, {"isController": true, "data": ["Offer_search_by_id", 1, 0, 0.0, 13107.0, 13107.0, 13107.0, 13107.0, 0.07629510948348212, 36.76038447966736, 0.0, 13107, 13107]}, {"isController": false, "data": ["67 /escm/messages", 1, 0, 0.0, 18.0, 18.0, 18.0, 18.0, 55.55555555555555, 25.010850694444446, 0.0, 18, 18]}, {"isController": false, "data": ["185 /escm/messages", 1, 0, 0.0, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 50.02170138888889, 0.0, 9, 9]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 19, 0, 0.0, 2363.789473684211, 11536.0, 20853.0, 20853.0, 0.2656005367926638, 3.6329091515111274, 0.0, 5, 20853]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 19, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
