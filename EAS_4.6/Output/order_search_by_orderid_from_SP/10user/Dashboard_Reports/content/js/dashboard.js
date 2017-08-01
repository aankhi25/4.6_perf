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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "13 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "99 /escm/images/favicon.ico"]}, {"isController": true, "data": [0.0, 500, 1500, "order_search_by_id"]}, {"isController": false, "data": [0.2, 500, 1500, "5 /escm/order/showOrderDetail"]}, {"isController": false, "data": [1.0, 500, 1500, "7 /escm/recentItem"]}, {"isController": false, "data": [0.4, 500, 1500, "65 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "6 /escm/messages"]}, {"isController": false, "data": [0.9, 500, 1500, "33 /escm/login/auth"]}, {"isController": true, "data": [0.0, 500, 1500, "Hit_the_portal"]}, {"isController": false, "data": [1.0, 500, 1500, "43 /escm/images/favicon.ico"]}, {"isController": false, "data": [0.0, 500, 1500, "12 /escm/order/showOrderDetail"]}, {"isController": true, "data": [0.0, 500, 1500, "sp_userlogin_46"]}, {"isController": false, "data": [1.0, 500, 1500, "23 /escm/recentItem"]}, {"isController": true, "data": [0.0, 500, 1500, "List_Orders"]}, {"isController": false, "data": [0.4, 500, 1500, "1 /escm/order/index"]}, {"isController": false, "data": [1.0, 500, 1500, "10 /escm/messages"]}, {"isController": false, "data": [0.65, 500, 1500, "4 /escm/order/searchOrder"]}, {"isController": false, "data": [1.0, 500, 1500, "22 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.5861111111111111, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["13 /escm/recentItem", 10, 0, 0.0, 10.0, 14.9, 15.0, 15.0, 666.6666666666666, 222.00520833333334, 0.0, 7, 15]}, {"isController": false, "data": ["99 /escm/images/favicon.ico", 10, 0, 0.0, 6.699999999999999, 22.300000000000004, 24.0, 24.0, 416.6666666666667, 50.862630208333336, 0.0, 3, 24]}, {"isController": true, "data": ["order_search_by_id", 10, 0, 0.0, 2379.8999999999996, 3458.5, 3460.0, 3460.0, 2.890173410404624, 211.73370890534682, 0.0, 1667, 3460]}, {"isController": false, "data": ["5 /escm/order/showOrderDetail", 10, 0, 0.0, 1532.5, 1933.6000000000001, 1949.0, 1949.0, 5.13083632632119, 117.35836085813237, 0.0, 1240, 1949]}, {"isController": false, "data": ["7 /escm/recentItem", 10, 0, 0.0, 16.700000000000003, 63.100000000000016, 68.0, 68.0, 147.05882352941177, 48.971737132352935, 0.0, 8, 68]}, {"isController": false, "data": ["65 /escm/login/doAuth?id=loginform", 10, 0, 0.0, 1395.0000000000002, 2323.0, 2379.0, 2379.0, 4.203446826397646, 38.423362626103405, 0.0, 988, 2379]}, {"isController": false, "data": ["6 /escm/messages", 10, 0, 0.0, 11.400000000000002, 15.8, 16.0, 16.0, 625.0, 281.3720703125, 0.0, 10, 16]}, {"isController": false, "data": ["33 /escm/login/auth", 10, 0, 0.0, 215.70000000000002, 997.3000000000002, 1034.0, 1034.0, 9.671179883945841, 49.357017649903284, 0.0, 38, 1034]}, {"isController": true, "data": ["Hit_the_portal", 10, 10, 100.0, 531.3, 1375.6000000000001, 1422.0, 1422.0, 7.032348804500703, 4752.6728419479605, 0.0, 319, 1422]}, {"isController": false, "data": ["43 /escm/images/favicon.ico", 10, 0, 0.0, 9.7, 19.1, 20.0, 20.0, 500.0, 93437.01171875, 0.0, 5, 20]}, {"isController": false, "data": ["12 /escm/order/showOrderDetail", 10, 10, 100.0, 51.2, 144.8, 149.0, 149.0, 67.11409395973155, 83.69599412751678, 0.0, 26, 149]}, {"isController": true, "data": ["sp_userlogin_46", 10, 0, 0.0, 2138.4, 2983.3, 2998.0, 2998.0, 3.33555703802535, 1497.8419858030352, 0.0, 1552, 2998]}, {"isController": false, "data": ["23 /escm/recentItem", 10, 0, 0.0, 11.1, 20.5, 21.0, 21.0, 476.19047619047615, 158.5751488095238, 0.0, 8, 21]}, {"isController": true, "data": ["List_Orders", 10, 10, 100.0, 1527.8, 2395.2000000000003, 2443.0, 2443.0, 4.093327875562832, 596.6297201187065, 0.0, 1146, 2443]}, {"isController": false, "data": ["1 /escm/order/index", 10, 0, 0.0, 1284.7, 2161.1000000000004, 2218.0, 2218.0, 4.508566275924256, 84.72846455139765, 0.0, 999, 2218]}, {"isController": false, "data": ["10 /escm/messages", 10, 0, 0.0, 11.799999999999999, 18.5, 19.0, 19.0, 526.3157894736842, 236.94490131578948, 0.0, 9, 19]}, {"isController": false, "data": ["4 /escm/order/searchOrder", 10, 0, 0.0, 744.0000000000001, 1571.7, 1584.0, 1584.0, 6.313131313131313, 23.039230192550505, 0.0, 361, 1584]}, {"isController": false, "data": ["22 /escm/messages", 10, 0, 0.0, 18.6, 47.9, 48.0, 48.0, 208.33333333333334, 93.79069010416667, 0.0, 8, 48]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 140, 10, 7.142857142857143, 379.93571428571425, 1371.4, 1645.7499999999993, 2312.9900000000007, 58.84825556956705, 1051.5028964375788, 0.0, 3, 2379]}}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "items": [{"isController": false, "data": ["404/Not Found", 10, 100.0, 7.142857142857143]}], "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);
    
        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": ["12 /escm/order/showOrderDetail", 10, 10, "404/Not Found", 10, null, null, null, null, null, null, null, null]}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 140, 10, "404/Not Found", 10, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
