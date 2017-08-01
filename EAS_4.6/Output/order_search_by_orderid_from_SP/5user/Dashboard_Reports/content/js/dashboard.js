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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "13 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "99 /escm/images/favicon.ico"]}, {"isController": true, "data": [0.0, 500, 1500, "order_search_by_id"]}, {"isController": false, "data": [0.3, 500, 1500, "5 /escm/order/showOrderDetail"]}, {"isController": false, "data": [1.0, 500, 1500, "7 /escm/recentItem"]}, {"isController": false, "data": [0.0, 500, 1500, "65 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "6 /escm/messages"]}, {"isController": false, "data": [0.9, 500, 1500, "33 /escm/login/auth"]}, {"isController": true, "data": [0.0, 500, 1500, "Hit_the_portal"]}, {"isController": false, "data": [1.0, 500, 1500, "43 /escm/images/favicon.ico"]}, {"isController": false, "data": [0.0, 500, 1500, "12 /escm/order/showOrderDetail"]}, {"isController": true, "data": [0.0, 500, 1500, "sp_userlogin_46"]}, {"isController": false, "data": [1.0, 500, 1500, "23 /escm/recentItem"]}, {"isController": true, "data": [0.0, 500, 1500, "List_Orders"]}, {"isController": false, "data": [0.0, 500, 1500, "1 /escm/order/index"]}, {"isController": false, "data": [1.0, 500, 1500, "10 /escm/messages"]}, {"isController": false, "data": [0.2, 500, 1500, "4 /escm/order/searchOrder"]}, {"isController": false, "data": [1.0, 500, 1500, "22 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.5222222222222223, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["13 /escm/recentItem", 5, 0, 0.0, 13.8, 26.0, 26.0, 26.0, 192.30769230769232, 64.0399639423077, 0.0, 9, 26]}, {"isController": false, "data": ["99 /escm/images/favicon.ico", 5, 0, 0.0, 5.4, 6.0, 6.0, 6.0, 833.3333333333334, 101.72526041666667, 0.0, 5, 6]}, {"isController": true, "data": ["order_search_by_id", 5, 0, 0.0, 4570.2, 6188.0, 6188.0, 6188.0, 0.8080155138978667, 59.19455372293148, 0.0, 2842, 6188]}, {"isController": false, "data": ["5 /escm/order/showOrderDetail", 5, 0, 0.0, 1558.8, 1806.0, 1806.0, 1806.0, 2.7685492801771874, 63.323535264396455, 0.0, 1430, 1806]}, {"isController": false, "data": ["7 /escm/recentItem", 5, 0, 0.0, 10.8, 14.0, 14.0, 14.0, 357.14285714285717, 118.93136160714286, 0.0, 9, 14]}, {"isController": false, "data": ["65 /escm/login/doAuth?id=loginform", 5, 0, 0.0, 3489.0, 5562.0, 5562.0, 5562.0, 0.8989572096368212, 8.103256472491909, 0.0, 1958, 5562]}, {"isController": false, "data": ["6 /escm/messages", 5, 0, 0.0, 14.0, 20.0, 20.0, 20.0, 250.0, 112.548828125, 0.0, 11, 20]}, {"isController": false, "data": ["33 /escm/login/auth", 5, 0, 0.0, 166.6, 545.0, 545.0, 545.0, 9.174311926605505, 46.82124426605504, 0.0, 57, 545]}, {"isController": true, "data": ["Hit_the_portal", 5, 5, 100.0, 489.0, 910.0, 910.0, 910.0, 5.4945054945054945, 3713.35207760989, 0.0, 358, 910]}, {"isController": false, "data": ["43 /escm/images/favicon.ico", 5, 0, 0.0, 10.4, 20.0, 20.0, 20.0, 250.0, 46718.505859375, 0.0, 6, 20]}, {"isController": false, "data": ["12 /escm/order/showOrderDetail", 5, 5, 100.0, 49.6, 105.0, 105.0, 105.0, 47.61904761904761, 59.384300595238095, 0.0, 28, 105]}, {"isController": true, "data": ["sp_userlogin_46", 5, 0, 0.0, 4157.0, 6231.0, 6231.0, 6231.0, 0.8024394158241053, 360.2360551075269, 0.0, 2661, 6231]}, {"isController": false, "data": ["23 /escm/recentItem", 5, 0, 0.0, 12.8, 22.0, 22.0, 22.0, 227.27272727272725, 75.68359375, 0.0, 9, 22]}, {"isController": true, "data": ["List_Orders", 5, 5, 100.0, 3373.8, 4364.0, 4364.0, 4364.0, 1.1457378551787352, 166.9966630384968, 0.0, 1894, 4364]}, {"isController": false, "data": ["1 /escm/order/index", 5, 0, 0.0, 3139.8, 4204.0, 4204.0, 4204.0, 1.1893434823977165, 22.3487396675785, 0.0, 1694, 4204]}, {"isController": false, "data": ["10 /escm/messages", 5, 0, 0.0, 11.4, 12.0, 12.0, 12.0, 416.6666666666667, 187.58138020833334, 0.0, 11, 12]}, {"isController": false, "data": ["4 /escm/order/searchOrder", 5, 0, 0.0, 2909.4, 4621.0, 4621.0, 4621.0, 1.0820168794633196, 3.9487276157758058, 0.0, 1085, 4621]}, {"isController": false, "data": ["22 /escm/messages", 5, 0, 0.0, 13.0, 14.0, 14.0, 14.0, 357.14285714285717, 160.78404017857142, 0.0, 12, 14]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 70, 5, 7.142857142857143, 814.6285714285711, 3287.8999999999996, 4386.250000000001, 5562.0, 12.585400934915498, 224.76002056364615, 0.0, 5, 5562]}}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "items": [{"isController": false, "data": ["404/Not Found", 5, 100.0, 7.142857142857143]}], "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);
    
        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": ["12 /escm/order/showOrderDetail", 5, 5, "404/Not Found", 5, null, null, null, null, null, null, null, null]}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 70, 5, "404/Not Found", 5, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
