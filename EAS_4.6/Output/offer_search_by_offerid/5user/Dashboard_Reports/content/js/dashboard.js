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

    var data = {"KoPercent": 13.333333333333334, "OkPercent": 86.66666666666667};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [0.5, 500, 1500, "168 /escm/productOffer/showOfferDetails"]}, {"isController": true, "data": [0.0, 500, 1500, "Offer_search_by_offerid_46_with_cache"]}, {"isController": false, "data": [0.18, 500, 1500, "675 /escm/login/auth"]}, {"isController": false, "data": [1.0, 500, 1500, "170 /escm/recentItem"]}, {"isController": false, "data": [0.0, 500, 1500, "167 /escm/productOffer/productModelSearch/productModelSearch"]}, {"isController": false, "data": [0.5, 500, 1500, "680 /escm/dashboard/myAccountInfo"]}, {"isController": false, "data": [0.54, 500, 1500, "143 /escm/productOffer/index"]}, {"isController": true, "data": [0.0, 500, 1500, "List_offers_46_SP_with_cache"]}, {"isController": false, "data": [0.6, 500, 1500, "144 /escm/productOffer/list"]}, {"isController": false, "data": [0.3, 500, 1500, "676 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "169 /escm/messages"]}, {"isController": true, "data": [0.04, 500, 1500, "SP_user_login_46_with_cache"]}, {"isController": false, "data": [0.8, 500, 1500, "147 /escm/productOffer/getAllService"]}, {"isController": false, "data": [0.8, 500, 1500, "146 /escm/productOffer/offerList"]}, {"isController": false, "data": [0.8, 500, 1500, "149 /escm/recentItem"]}, {"isController": false, "data": [0.8, 500, 1500, "150 /escm/messages"]}, {"isController": false, "data": [0.8, 500, 1500, "151 /escm/recentItem"]}, {"isController": true, "data": [0.18, 500, 1500, "Hit_the_portal_with-cache"]}, {"isController": false, "data": [0.8, 500, 1500, "148 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.5073684210526316, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["168 /escm/productOffer/showOfferDetails", 25, 0, 0.0, 843.7600000000001, 1079.8000000000002, 1115.9, 1118.0, 0.4090447985863412, 4.001752373482444, 0.0, 597, 1118]}, {"isController": true, "data": ["Offer_search_by_offerid_46_with_cache", 25, 0, 0.0, 2918.88, 3356.8, 3715.3999999999996, 3848.0, 0.39428445257546607, 13.220665729583951, 0.0, 2241, 3848]}, {"isController": false, "data": ["675 /escm/login/auth", 25, 20, 80.0, 762.16, 1019.6000000000001, 1055.1, 1059.0, 0.4101588134925843, 2.761634539268605, 0.0, 50, 1059]}, {"isController": false, "data": ["170 /escm/recentItem", 25, 0, 0.0, 14.520000000000001, 29.400000000000013, 35.099999999999994, 36.0, 0.41647925100371497, 0.13869084432838555, 0.0, 7, 36]}, {"isController": false, "data": ["167 /escm/productOffer/productModelSearch/productModelSearch", 25, 0, 0.0, 2046.48, 2456.8, 2871.0999999999995, 3025.0, 0.4014838844368787, 9.219842161629382, 0.0, 1568, 3025]}, {"isController": false, "data": ["680 /escm/dashboard/myAccountInfo", 25, 0, 0.0, 1015.4399999999999, 1283.6000000000001, 1585.8999999999996, 1708.0, 0.4078236896624851, 3.365469415262394, 0.0, 307, 1708]}, {"isController": false, "data": ["143 /escm/productOffer/index", 25, 0, 0.0, 985.3200000000002, 1764.8000000000002, 2076.9999999999995, 2191.0, 0.40445875329633885, 4.121829675340959, 0.0, 46, 2191]}, {"isController": true, "data": ["List_offers_46_SP_with_cache", 25, 5, 20.0, 2170.0800000000004, 3374.8, 3595.2999999999997, 3661.0, 0.3947576188220433, 12.496838855005526, 0.0, 323, 3661]}, {"isController": false, "data": ["144 /escm/productOffer/list", 25, 0, 0.0, 855.24, 1216.4, 1259.3, 1271.0, 0.40802337157872404, 4.1069305574823325, 0.0, 54, 1271]}, {"isController": false, "data": ["676 /escm/login/doAuth?id=loginform", 25, 0, 0.0, 1476.4800000000002, 2213.0, 2711.9999999999995, 2913.0, 0.40277755401247, 3.7380589042033865, 0.0, 510, 2913]}, {"isController": false, "data": ["169 /escm/messages", 25, 0, 0.0, 14.120000000000001, 19.800000000000004, 34.999999999999986, 41.0, 0.4165208843571417, 0.18751574969593976, 0.0, 8, 41]}, {"isController": true, "data": ["SP_user_login_46_with_cache", 25, 0, 0.0, 2491.92, 3335.0, 3860.8999999999996, 4067.0, 0.3960019641697423, 6.943090062726711, 0.0, 887, 4067]}, {"isController": false, "data": ["147 /escm/productOffer/getAllService", 25, 5, 20.0, 109.75999999999999, 307.8, 329.9, 335.0, 0.41435319466313086, 0.31895484586061157, 0.0, 16, 335]}, {"isController": false, "data": ["146 /escm/productOffer/offerList", 25, 5, 20.0, 145.72, 223.80000000000007, 258.59999999999997, 264.0, 0.41484136466215316, 3.2739248089655515, 0.0, 38, 264]}, {"isController": false, "data": ["149 /escm/recentItem", 25, 5, 20.0, 20.52, 39.60000000000001, 42.7, 43.0, 0.41650006664001066, 0.27451584470378515, 0.0, 8, 43]}, {"isController": false, "data": ["150 /escm/messages", 25, 5, 20.0, 16.919999999999998, 30.200000000000006, 38.99999999999999, 42.0, 0.41637520402385, 0.29582157073381965, 0.0, 9, 42]}, {"isController": false, "data": ["151 /escm/recentItem", 25, 5, 20.0, 17.000000000000004, 38.80000000000001, 45.099999999999994, 46.0, 0.4165555851772861, 0.27434090492535324, 0.0, 8, 46]}, {"isController": true, "data": ["Hit_the_portal_with-cache", 25, 20, 80.0, 762.1999999999999, 1019.6000000000001, 1055.1, 1059.0, 0.4101588134925843, 2.761634539268605, 0.0, 50, 1059]}, {"isController": false, "data": ["148 /escm/messages", 25, 5, 20.0, 19.600000000000005, 40.400000000000006, 41.7, 42.0, 0.4165139448868748, 0.2960014921612076, 0.0, 9, 42]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 375, 50, 13.333333333333334, 556.2026666666665, 1553.000000000001, 2001.6, 2442.080000000001, 6.02225826655318, 35.91427039337391, 0.0, 7, 3025]}}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "items": [{"isController": false, "data": ["500/Internal Server Error", 50, 100.0, 13.333333333333334]}], "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);
    
        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": ["675 /escm/login/auth", 25, 20, "500/Internal Server Error", 20, null, null, null, null, null, null, null, null]}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": ["147 /escm/productOffer/getAllService", 25, 5, "500/Internal Server Error", 5, null, null, null, null, null, null, null, null]}, {"isController": false, "data": ["146 /escm/productOffer/offerList", 25, 5, "500/Internal Server Error", 5, null, null, null, null, null, null, null, null]}, {"isController": false, "data": ["149 /escm/recentItem", 25, 5, "500/Internal Server Error", 5, null, null, null, null, null, null, null, null]}, {"isController": false, "data": ["150 /escm/messages", 25, 5, "500/Internal Server Error", 5, null, null, null, null, null, null, null, null]}, {"isController": false, "data": ["151 /escm/recentItem", 25, 5, "500/Internal Server Error", 5, null, null, null, null, null, null, null, null]}, {"isController": true, "data": []}, {"isController": false, "data": ["148 /escm/messages", 25, 5, "500/Internal Server Error", 5, null, null, null, null, null, null, null, null]}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 375, 50, "500/Internal Server Error", 50, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
