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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "201 /escm/messages"]}, {"isController": false, "data": [0.95, 500, 1500, "675 /escm/login/auth"]}, {"isController": false, "data": [0.25, 500, 1500, "194 /escm/order/list"]}, {"isController": true, "data": [0.0, 500, 1500, "Order_search_by_order_id_with_cache"]}, {"isController": false, "data": [0.3, 500, 1500, "680 /escm/dashboard/myAccountInfo"]}, {"isController": false, "data": [1.0, 500, 1500, "198 /escm/recentItem"]}, {"isController": false, "data": [0.15, 500, 1500, "200 /escm/order/showOrderDetail"]}, {"isController": false, "data": [1.0, 500, 1500, "204 /escm/recentItem"]}, {"isController": false, "data": [0.25, 500, 1500, "676 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [0.15, 500, 1500, "193 /escm/order/index"]}, {"isController": false, "data": [1.0, 500, 1500, "197 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "203 /escm/messages"]}, {"isController": true, "data": [0.0, 500, 1500, "SP_user_login_46_with_cache"]}, {"isController": false, "data": [1.0, 500, 1500, "202 /escm/recentItem"]}, {"isController": false, "data": [0.05, 500, 1500, "196 /escm/order/showOrderDetail"]}, {"isController": true, "data": [0.95, 500, 1500, "Hit_the_portal_with-cache"]}, {"isController": false, "data": [0.85, 500, 1500, "199 /escm/order/searchOrder"]}, {"isController": true, "data": [0.0, 500, 1500, "List_orders_with_cache"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.55, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["201 /escm/messages", 10, 0, 0.0, 17.8, 27.9, 28.0, 28.0, 357.14285714285717, 160.78404017857142, 0.0, 10, 28]}, {"isController": false, "data": ["675 /escm/login/auth", 10, 0, 0.0, 123.90000000000002, 514.7, 545.0, 545.0, 0.1659971448491086, 0.9687489625178447, 0.0, 42, 545]}, {"isController": false, "data": ["194 /escm/order/list", 10, 0, 0.0, 2559.0999999999995, 5931.6, 6014.0, 6014.0, 1.6627868307283007, 35.82120235076488, 0.0, 1295, 6014]}, {"isController": true, "data": ["Order_search_by_order_id_with_cache", 10, 0, 0.0, 2924.0, 7441.200000000002, 7889.0, 7889.0, 1.2675877804537963, 35.940569939155786, 0.0, 1910, 7889]}, {"isController": false, "data": ["680 /escm/dashboard/myAccountInfo", 10, 0, 0.0, 1551.6, 2987.7000000000003, 3010.0, 3010.0, 0.15870496746548166, 1.3085720520552293, 0.0, 758, 3010]}, {"isController": false, "data": ["198 /escm/recentItem", 10, 0, 0.0, 14.799999999999999, 26.200000000000003, 27.0, 27.0, 370.3703703703703, 123.33622685185185, 0.0, 10, 27]}, {"isController": false, "data": ["200 /escm/order/showOrderDetail", 10, 0, 0.0, 2391.7, 6833.300000000001, 7268.0, 7268.0, 1.375894331315355, 32.1601863476885, 0.0, 1436, 7268]}, {"isController": false, "data": ["204 /escm/recentItem", 10, 0, 0.0, 11.100000000000001, 14.9, 15.0, 15.0, 666.6666666666666, 222.00520833333334, 0.0, 9, 15]}, {"isController": false, "data": ["676 /escm/login/doAuth?id=loginform", 10, 0, 0.0, 1830.6000000000001, 3516.1, 3530.0, 3530.0, 0.15740594994490792, 1.473544117936408, 0.0, 1025, 3530]}, {"isController": false, "data": ["193 /escm/order/index", 10, 0, 0.0, 2872.8, 6284.200000000001, 6418.0, 6418.0, 0.15056159474841158, 3.266422035442199, 0.0, 1198, 6418]}, {"isController": false, "data": ["197 /escm/messages", 10, 0, 0.0, 23.999999999999996, 51.900000000000006, 53.0, 53.0, 188.67924528301887, 84.94251179245283, 0.0, 12, 53]}, {"isController": false, "data": ["203 /escm/messages", 10, 0, 0.0, 20.9, 70.40000000000002, 76.0, 76.0, 131.57894736842104, 59.23622532894737, 0.0, 10, 76]}, {"isController": true, "data": ["SP_user_login_46_with_cache", 10, 0, 0.0, 3382.2000000000003, 5826.3, 5912.0, 5912.0, 0.1517174414370676, 2.671249284083323, 0.0, 1819, 5912]}, {"isController": false, "data": ["202 /escm/recentItem", 10, 0, 0.0, 15.100000000000001, 33.400000000000006, 35.0, 35.0, 285.7142857142857, 95.14508928571428, 0.0, 10, 35]}, {"isController": false, "data": ["196 /escm/order/showOrderDetail", 10, 0, 0.0, 2318.1, 6480.800000000002, 6963.0, 6963.0, 1.4361625736033319, 31.388707498563836, 0.0, 1420, 6963]}, {"isController": true, "data": ["Hit_the_portal_with-cache", 10, 0, 0.0, 123.90000000000002, 514.7, 545.0, 545.0, 0.1659971448491086, 0.9687489625178447, 0.0, 42, 545]}, {"isController": false, "data": ["199 /escm/order/searchOrder", 10, 0, 0.0, 467.40000000000003, 654.0, 656.0, 656.0, 15.24390243902439, 52.02874904725609, 0.0, 379, 656]}, {"isController": true, "data": ["List_orders_with_cache", 10, 0, 0.0, 7788.8, 12161.4, 12177.0, 12177.0, 0.13854829100683042, 9.127139272205827, 0.0, 4612, 12177]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 140, 0, 0.0, 1015.6357142857144, 2774.4000000000005, 3820.6999999999966, 7142.950000000001, 2.0812273294880184, 17.493183167516502, 0.0, 9, 7268]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 140, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
