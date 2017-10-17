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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [0.9, 500, 1500, "675 /escm/login/auth"]}, {"isController": true, "data": [0.0, 500, 1500, "List_offers_46_SP_with_cache"]}, {"isController": false, "data": [0.35, 500, 1500, "680 /escm/dashboard/myAccountInfo"]}, {"isController": false, "data": [0.3, 500, 1500, "143 /escm/productOffer/index"]}, {"isController": false, "data": [0.2, 500, 1500, "676 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [0.35, 500, 1500, "144 /escm/productOffer/list"]}, {"isController": true, "data": [0.0, 500, 1500, "SP_user_login_46_with_cache"]}, {"isController": false, "data": [1.0, 500, 1500, "147 /escm/productOffer/getAllService"]}, {"isController": false, "data": [1.0, 500, 1500, "146 /escm/productOffer/offerList"]}, {"isController": false, "data": [1.0, 500, 1500, "149 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "150 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "151 /escm/recentItem"]}, {"isController": true, "data": [0.9, 500, 1500, "Hit_the_portal_with-cache"]}, {"isController": false, "data": [1.0, 500, 1500, "148 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.6428571428571429, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["675 /escm/login/auth", 10, 0, 0.0, 179.10000000000002, 590.5, 600.0, 600.0, 16.666666666666668, 97.265625, 0.0, 50, 600]}, {"isController": true, "data": ["List_offers_46_SP_with_cache", 10, 0, 0.0, 3262.1000000000004, 4426.4, 4459.0, 4459.0, 2.242655303879794, 80.25705560383494, 0.0, 2208, 4459]}, {"isController": false, "data": ["680 /escm/dashboard/myAccountInfo", 10, 0, 0.0, 1472.9, 2292.2000000000003, 2314.0, 2314.0, 4.32152117545376, 35.65550386235955, 0.0, 935, 2314]}, {"isController": false, "data": ["143 /escm/productOffer/index", 10, 0, 0.0, 1417.8, 2039.7000000000003, 2080.0, 2080.0, 4.807692307692308, 58.940241887019226, 0.0, 1017, 2080]}, {"isController": false, "data": ["676 /escm/login/doAuth?id=loginform", 10, 0, 0.0, 1760.1, 2621.1000000000004, 2682.0, 2682.0, 3.7285607755406414, 34.93195376584639, 0.0, 1326, 2682]}, {"isController": false, "data": ["144 /escm/productOffer/list", 10, 0, 0.0, 1409.7, 2400.4, 2455.0, 2455.0, 4.0733197556008145, 49.29631810081466, 0.0, 932, 2455]}, {"isController": true, "data": ["SP_user_login_46_with_cache", 10, 0, 0.0, 3233.0, 4393.200000000001, 4456.0, 4456.0, 2.244165170556553, 39.54091919602782, 0.0, 2277, 4456]}, {"isController": false, "data": ["147 /escm/productOffer/getAllService", 10, 0, 0.0, 106.20000000000002, 274.1, 276.0, 276.0, 36.231884057971016, 17.302139945652172, 0.0, 20, 276]}, {"isController": false, "data": ["146 /escm/productOffer/offerList", 10, 0, 0.0, 261.8, 487.90000000000003, 492.0, 492.0, 20.32520325203252, 190.66787347560975, 0.0, 134, 492]}, {"isController": false, "data": ["149 /escm/recentItem", 10, 0, 0.0, 17.1, 37.7, 39.0, 39.0, 256.4102564102564, 85.38661858974359, 0.0, 9, 39]}, {"isController": false, "data": ["150 /escm/messages", 10, 0, 0.0, 13.3, 24.900000000000006, 26.0, 26.0, 384.61538461538464, 173.15204326923077, 0.0, 10, 26]}, {"isController": false, "data": ["151 /escm/recentItem", 10, 0, 0.0, 13.299999999999999, 28.600000000000005, 30.0, 30.0, 333.3333333333333, 111.00260416666667, 0.0, 8, 30]}, {"isController": true, "data": ["Hit_the_portal_with-cache", 10, 0, 0.0, 179.2, 591.4000000000001, 601.0, 601.0, 16.638935108153078, 97.10378535773711, 0.0, 50, 601]}, {"isController": false, "data": ["148 /escm/messages", 10, 0, 0.0, 22.9, 66.80000000000001, 71.0, 71.0, 140.84507042253523, 63.40779049295775, 0.0, 11, 71]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 110, 0, 0.0, 606.7454545454544, 1726.5000000000002, 2076.15, 2657.03, 41.01416853094705, 220.8873683351976, 0.0, 8, 2682]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 110, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
