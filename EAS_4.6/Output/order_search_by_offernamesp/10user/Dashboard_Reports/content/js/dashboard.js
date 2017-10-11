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

    var data = {"KoPercent": 5.555555555555555, "OkPercent": 94.44444444444444};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "812 /escm/messages"]}, {"isController": false, "data": [0.45, 500, 1500, "807 /escm/order/searchOrder"]}, {"isController": true, "data": [0.0, 500, 1500, "List_orders_without_cache_4.6"]}, {"isController": false, "data": [1.0, 500, 1500, "796 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "809 /escm/messages"]}, {"isController": true, "data": [0.5, 500, 1500, "Hit_the_portal_new"]}, {"isController": false, "data": [0.0, 500, 1500, "543 /escm/"]}, {"isController": false, "data": [0.0, 500, 1500, "808 /escm/order/showOrderDetail"]}, {"isController": false, "data": [0.95, 500, 1500, "524 /escm/login/auth"]}, {"isController": false, "data": [0.0, 500, 1500, "545 /escm/dashboard/index"]}, {"isController": true, "data": [0.0, 500, 1500, "order_search_by_offer_name_without_cache_4.6"]}, {"isController": false, "data": [1.0, 500, 1500, "813 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "783 /escm/images/sidebar-bg.jpg"]}, {"isController": true, "data": [0.0, 500, 1500, "SP_user_login_46_new"]}, {"isController": false, "data": [0.0, 500, 1500, "777 /escm/order/index"]}, {"isController": false, "data": [0.0, 500, 1500, "785 /escm/order/showOrderDetail"]}, {"isController": false, "data": [1.0, 500, 1500, "797 /escm/recentItem"]}, {"isController": false, "data": [0.0, 500, 1500, "541 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "810 /escm/recentItem"]}, {"isController": false, "data": [0.0, 500, 1500, "546 /escm/dashboard/myAccountInfo"]}, {"isController": false, "data": [0.0, 500, 1500, "540 /success.txt"]}, {"isController": false, "data": [0.0, 500, 1500, "779 /escm/order/list"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.40454545454545454, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["812 /escm/messages", 10, 0, 0.0, 20.299999999999997, 35.5, 36.0, 36.0, 277.77777777777777, 125.05425347222223, 0.0, 11, 36]}, {"isController": false, "data": ["807 /escm/order/searchOrder", 10, 0, 0.0, 1126.5, 1619.1000000000001, 1640.0, 1640.0, 6.097560975609756, 25.41444359756098, 0.0, 814, 1640]}, {"isController": true, "data": ["List_orders_without_cache_4.6", 10, 0, 0.0, 27249.6, 31720.8, 31722.0, 31722.0, 0.11525916022175862, 25.527709112533284, 0.0, 24377, 31722]}, {"isController": false, "data": ["796 /escm/messages", 10, 0, 0.0, 113.3, 138.0, 139.0, 139.0, 71.94244604316546, 32.38815197841726, 0.0, 96, 139]}, {"isController": false, "data": ["809 /escm/messages", 10, 0, 0.0, 74.7, 202.40000000000003, 212.0, 212.0, 47.16981132075472, 21.23562794811321, 0.0, 20, 212]}, {"isController": true, "data": ["Hit_the_portal_new", 10, 0, 0.0, 704.6999999999999, 1319.5000000000002, 1380.0, 1380.0, 7.246376811594203, 4188.122735507247, 0.0, 534, 1380]}, {"isController": false, "data": ["543 /escm/", 10, 0, 0.0, 3960.8000000000006, 4973.9, 4978.0, 4978.0, 2.008838891120932, 17.23638697770189, 0.0, 1826, 4978]}, {"isController": false, "data": ["808 /escm/order/showOrderDetail", 10, 0, 0.0, 4426.0, 5089.2, 5109.0, 5109.0, 1.9573302016050107, 42.78448571148953, 0.0, 3791, 5109]}, {"isController": false, "data": ["524 /escm/login/auth", 10, 0, 0.0, 208.4, 617.1000000000001, 651.0, 651.0, 15.360983102918587, 89.64573732718894, 0.0, 121, 651]}, {"isController": false, "data": ["545 /escm/dashboard/index", 10, 0, 0.0, 4331.3, 6025.8, 6035.0, 6035.0, 1.657000828500414, 13.958613815244407, 0.0, 2599, 6035]}, {"isController": true, "data": ["order_search_by_offer_name_without_cache_4.6", 10, 0, 0.0, 5801.5, 6577.8, 6592.0, 6592.0, 1.5169902912621358, 69.79221973604369, 0.0, 4981, 6592]}, {"isController": false, "data": ["813 /escm/recentItem", 10, 0, 0.0, 17.999999999999996, 52.60000000000001, 56.0, 56.0, 178.57142857142858, 59.46568080357143, 0.0, 9, 56]}, {"isController": false, "data": ["783 /escm/images/sidebar-bg.jpg", 10, 0, 0.0, 24.0, 59.6, 60.0, 60.0, 0.1665001665001665, 0.27690408549783546, 0.0, 5, 60]}, {"isController": true, "data": ["SP_user_login_46_new", 10, 10, 100.0, 64972.7, 67985.7, 68109.0, 68109.0, 0.14682347413704502, 49.66833093368718, 0.0, 62754, 68109]}, {"isController": false, "data": ["777 /escm/order/index", 10, 0, 0.0, 6834.3, 11693.1, 11801.0, 11801.0, 0.8473858147614609, 18.38380354419117, 0.0, 4039, 11801]}, {"isController": false, "data": ["785 /escm/order/showOrderDetail", 10, 0, 0.0, 13859.0, 15707.0, 15724.0, 15724.0, 0.1390723871775259, 3.0399947195952994, 0.0, 11729, 15724]}, {"isController": false, "data": ["797 /escm/recentItem", 10, 0, 0.0, 77.60000000000001, 107.8, 108.0, 108.0, 92.59259259259258, 30.834056712962962, 0.0, 45, 108]}, {"isController": false, "data": ["541 /escm/login/doAuth?id=loginform", 10, 0, 0.0, 8604.2, 11743.0, 11768.0, 11768.0, 0.849762066621346, 7.565454914811353, 0.0, 4543, 11768]}, {"isController": false, "data": ["810 /escm/recentItem", 10, 0, 0.0, 50.300000000000004, 176.50000000000003, 183.0, 183.0, 54.6448087431694, 18.197148224043715, 0.0, 13, 183]}, {"isController": false, "data": ["546 /escm/dashboard/myAccountInfo", 10, 0, 0.0, 3618.1000000000004, 4227.5, 4233.0, 4233.0, 2.3623907394283012, 19.22626166430428, 0.0, 3041, 4233]}, {"isController": false, "data": ["540 /success.txt", 10, 10, 100.0, 42020.8, 42163.5, 42181.0, 42181.0, 0.23707356392688653, 0.5107268379128044, 0.0, 41997, 42181]}, {"isController": false, "data": ["779 /escm/order/list", 10, 0, 0.0, 5398.0, 7665.1, 7683.0, 7683.0, 1.3015749056358195, 28.04029594559417, 0.0, 3730, 7683]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 180, 10, 5.555555555555555, 5264.755555555557, 11896.5, 41998.9, 42039.25, 1.3646184754179145, 10.399337472991926, 0.0, 5, 42181]}}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "items": [{"isController": false, "data": ["Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 10, 100.0, 5.555555555555555]}], "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);
    
        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": ["540 /success.txt", 10, 10, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 10, null, null, null, null, null, null, null, null]}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 180, 10, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 10, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
