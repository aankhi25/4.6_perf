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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "201 /escm/messages"]}, {"isController": false, "data": [0.9666666666666667, 500, 1500, "675 /escm/login/auth"]}, {"isController": false, "data": [0.016666666666666666, 500, 1500, "194 /escm/order/list"]}, {"isController": true, "data": [0.0, 500, 1500, "Order_search_by_order_id_with_cache"]}, {"isController": false, "data": [0.06666666666666667, 500, 1500, "680 /escm/dashboard/myAccountInfo"]}, {"isController": false, "data": [1.0, 500, 1500, "198 /escm/recentItem"]}, {"isController": false, "data": [0.0, 500, 1500, "200 /escm/order/showOrderDetail"]}, {"isController": false, "data": [1.0, 500, 1500, "204 /escm/recentItem"]}, {"isController": false, "data": [0.06666666666666667, 500, 1500, "676 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [0.03333333333333333, 500, 1500, "193 /escm/order/index"]}, {"isController": false, "data": [1.0, 500, 1500, "197 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "203 /escm/messages"]}, {"isController": true, "data": [0.0, 500, 1500, "SP_user_login_46_with_cache"]}, {"isController": false, "data": [1.0, 500, 1500, "202 /escm/recentItem"]}, {"isController": false, "data": [0.18333333333333332, 500, 1500, "196 /escm/order/showOrderDetail"]}, {"isController": true, "data": [0.9666666666666667, 500, 1500, "Hit_the_portal_with-cache"]}, {"isController": false, "data": [0.9166666666666666, 500, 1500, "199 /escm/order/searchOrder"]}, {"isController": true, "data": [0.0, 500, 1500, "List_orders_with_cache"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.5120370370370371, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["201 /escm/messages", 30, 0, 0.0, 14.333333333333332, 23.800000000000004, 29.45, 30.0, 0.49975012493753124, 0.2249851636681659, 0.0, 8, 30]}, {"isController": false, "data": ["675 /escm/login/auth", 30, 0, 0.0, 155.5333333333334, 485.20000000000016, 733.25, 769.0, 0.4936727607826359, 2.881043377379914, 0.0, 36, 769]}, {"isController": false, "data": ["194 /escm/order/list", 30, 0, 0.0, 5917.200000000001, 12079.000000000002, 12790.3, 13095.0, 0.4104247896572953, 8.840873285621452, 0.0, 1375, 13095]}, {"isController": true, "data": ["Order_search_by_order_id_with_cache", 30, 0, 0.0, 3128.733333333333, 3608.2000000000003, 6339.749999999996, 9263.0, 0.4331316864704099, 12.281059828118908, 0.0, 2154, 9263]}, {"isController": false, "data": ["680 /escm/dashboard/myAccountInfo", 30, 0, 0.0, 4818.0666666666675, 10377.500000000002, 11253.8, 11630.0, 0.41881893061566383, 3.4373827525129137, 0.0, 654, 11630]}, {"isController": false, "data": ["198 /escm/recentItem", 30, 0, 0.0, 13.799999999999999, 17.900000000000002, 29.099999999999987, 39.0, 0.4996752111127767, 0.16639574901314144, 0.0, 8, 39]}, {"isController": false, "data": ["200 /escm/order/showOrderDetail", 30, 0, 0.0, 2642.099999999999, 3162.7000000000003, 5884.899999999996, 8867.0, 0.43562228643617407, 10.18250078048993, 0.0, 1733, 8867]}, {"isController": false, "data": ["204 /escm/recentItem", 30, 0, 0.0, 14.266666666666666, 41.80000000000005, 48.25, 51.0, 0.4995753609431983, 0.1663624981265924, 0.0, 8, 51]}, {"isController": false, "data": ["676 /escm/login/doAuth?id=loginform", 30, 0, 0.0, 5009.700000000002, 10643.2, 11166.9, 11564.0, 0.4234775980350639, 3.9663529403461224, 0.0, 922, 11564]}, {"isController": false, "data": ["193 /escm/order/index", 30, 0, 0.0, 5944.400000000002, 11647.80000000001, 12395.0, 12637.0, 0.4161118508655126, 9.026972283483133, 0.0, 1351, 12637]}, {"isController": false, "data": ["197 /escm/messages", 30, 0, 0.0, 18.566666666666666, 49.900000000000006, 50.0, 50.0, 0.49958368026644456, 0.22491023105745214, 0.0, 9, 50]}, {"isController": false, "data": ["203 /escm/messages", 30, 0, 0.0, 15.000000000000002, 21.800000000000004, 32.899999999999984, 45.0, 0.4996252810392206, 0.22492895953035222, 0.0, 9, 45]}, {"isController": true, "data": ["SP_user_login_46_with_cache", 30, 0, 0.0, 9827.766666666668, 16364.5, 17043.85, 17293.0, 0.39270099746053355, 6.901119218295939, 0.0, 1599, 17293]}, {"isController": false, "data": ["202 /escm/recentItem", 30, 0, 0.0, 16.8, 17.900000000000002, 92.39999999999996, 121.0, 0.4989936960463066, 0.16616879917167046, 0.0, 8, 121]}, {"isController": false, "data": ["196 /escm/order/showOrderDetail", 30, 0, 0.0, 1965.9333333333336, 2170.2000000000003, 7690.85, 7742.0, 0.44285672108883706, 9.678812396666764, 0.0, 1180, 7742]}, {"isController": true, "data": ["Hit_the_portal_with-cache", 30, 0, 0.0, 155.5333333333334, 485.20000000000016, 733.25, 769.0, 0.4936727607826359, 2.881043377379914, 0.0, 36, 769]}, {"isController": false, "data": ["199 /escm/order/searchOrder", 30, 0, 0.0, 426.23333333333323, 644.6000000000004, 689.05, 694.0, 0.4942827956634923, 1.6870296590272513, 0.0, 323, 694]}, {"isController": true, "data": ["List_orders_with_cache", 30, 0, 0.0, 13859.899999999998, 20744.7, 21311.75, 21881.0, 0.3710758726467605, 24.443886273748856, 0.0, 4585, 21881]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 420, 0, 0.0, 1926.5666666666673, 6160.900000000007, 8055.499999999996, 12194.27, 5.745947055202134, 48.280945387851425, 0.0, 8, 13095]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 420, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
