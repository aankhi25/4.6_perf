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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "201 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "675 /escm/login/auth"]}, {"isController": false, "data": [0.1, 500, 1500, "194 /escm/order/list"]}, {"isController": true, "data": [0.0, 500, 1500, "Order_search_by_order_id_with_cache"]}, {"isController": false, "data": [0.2, 500, 1500, "680 /escm/dashboard/myAccountInfo"]}, {"isController": false, "data": [1.0, 500, 1500, "198 /escm/recentItem"]}, {"isController": false, "data": [0.2, 500, 1500, "200 /escm/order/showOrderDetail"]}, {"isController": false, "data": [1.0, 500, 1500, "204 /escm/recentItem"]}, {"isController": false, "data": [0.2, 500, 1500, "676 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [0.0, 500, 1500, "193 /escm/order/index"]}, {"isController": false, "data": [1.0, 500, 1500, "197 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "203 /escm/messages"]}, {"isController": true, "data": [0.0, 500, 1500, "SP_user_login_46_with_cache"]}, {"isController": false, "data": [1.0, 500, 1500, "202 /escm/recentItem"]}, {"isController": false, "data": [0.0, 500, 1500, "196 /escm/order/showOrderDetail"]}, {"isController": true, "data": [1.0, 500, 1500, "Hit_the_portal_with-cache"]}, {"isController": false, "data": [1.0, 500, 1500, "199 /escm/order/searchOrder"]}, {"isController": true, "data": [0.0, 500, 1500, "List_orders_with_cache"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.5388888888888889, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["201 /escm/messages", 5, 0, 0.0, 19.8, 34.0, 34.0, 34.0, 147.05882352941177, 66.20519301470588, 0.0, 12, 34]}, {"isController": false, "data": ["675 /escm/login/auth", 5, 0, 0.0, 165.4, 351.0, 351.0, 351.0, 14.245014245014245, 83.13301282051283, 0.0, 51, 351]}, {"isController": false, "data": ["194 /escm/order/list", 5, 0, 0.0, 1829.4, 2176.0, 2176.0, 2176.0, 2.297794117647059, 49.49188232421874, 0.0, 1470, 2176]}, {"isController": true, "data": ["Order_search_by_order_id_with_cache", 5, 0, 0.0, 2169.4, 2576.0, 2576.0, 2576.0, 1.9409937888198758, 55.0339977193323, 0.0, 1783, 2576]}, {"isController": false, "data": ["680 /escm/dashboard/myAccountInfo", 5, 0, 0.0, 1517.8, 1833.0, 1833.0, 1833.0, 2.727768685215494, 22.491838004637206, 0.0, 1205, 1833]}, {"isController": false, "data": ["198 /escm/recentItem", 5, 0, 0.0, 15.6, 22.0, 22.0, 22.0, 227.27272727272725, 75.68359375, 0.0, 12, 22]}, {"isController": false, "data": ["200 /escm/order/showOrderDetail", 5, 0, 0.0, 1699.0, 2023.0, 2023.0, 2023.0, 2.471576866040534, 57.770695594414235, 0.0, 1394, 2023]}, {"isController": false, "data": ["204 /escm/recentItem", 5, 0, 0.0, 16.4, 27.0, 27.0, 27.0, 185.18518518518516, 61.668113425925924, 0.0, 11, 27]}, {"isController": false, "data": ["676 /escm/login/doAuth?id=loginform", 5, 0, 0.0, 1756.0, 2554.0, 2554.0, 2554.0, 1.957713390759593, 18.33903313429914, 0.0, 1286, 2554]}, {"isController": false, "data": ["193 /escm/order/index", 5, 0, 0.0, 2029.0, 2520.0, 2520.0, 2520.0, 1.984126984126984, 43.03656684027778, 0.0, 1568, 2520]}, {"isController": false, "data": ["197 /escm/messages", 5, 0, 0.0, 17.0, 23.0, 23.0, 23.0, 217.3913043478261, 97.86854619565217, 0.0, 14, 23]}, {"isController": false, "data": ["203 /escm/messages", 5, 0, 0.0, 17.0, 26.0, 26.0, 26.0, 192.30769230769232, 86.57602163461539, 0.0, 11, 26]}, {"isController": true, "data": ["SP_user_login_46_with_cache", 5, 0, 0.0, 3273.8, 4229.0, 4229.0, 4229.0, 1.1823126034523528, 20.824173489595648, 0.0, 2600, 4229]}, {"isController": false, "data": ["202 /escm/recentItem", 5, 0, 0.0, 16.2, 24.0, 24.0, 24.0, 208.33333333333334, 69.37662760416667, 0.0, 13, 24]}, {"isController": false, "data": ["196 /escm/order/showOrderDetail", 5, 0, 0.0, 1650.2, 1841.0, 1841.0, 1841.0, 2.7159152634437804, 59.35813162004346, 0.0, 1546, 1841]}, {"isController": true, "data": ["Hit_the_portal_with-cache", 5, 0, 0.0, 165.4, 351.0, 351.0, 351.0, 14.245014245014245, 83.13301282051283, 0.0, 51, 351]}, {"isController": false, "data": ["199 /escm/order/searchOrder", 5, 0, 0.0, 401.0, 459.0, 459.0, 459.0, 10.893246187363834, 37.17958537581699, 0.0, 332, 459]}, {"isController": true, "data": ["List_orders_with_cache", 5, 0, 0.0, 5541.2, 6210.0, 6210.0, 6210.0, 0.8051529790660226, 53.0339485205314, 0.0, 4875, 6210]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 70, 0, 0.0, 796.4142857142856, 2021.7, 2160.05, 2554.0, 27.4079874706343, 230.36551120790918, 0.0, 11, 2554]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 70, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
