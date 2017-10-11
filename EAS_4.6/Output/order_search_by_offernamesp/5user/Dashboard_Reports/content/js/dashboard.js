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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "812 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "807 /escm/order/searchOrder"]}, {"isController": true, "data": [0.0, 500, 1500, "List_orders_without_cache_4.6"]}, {"isController": false, "data": [1.0, 500, 1500, "796 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "809 /escm/messages"]}, {"isController": true, "data": [0.6, 500, 1500, "Hit_the_portal_new"]}, {"isController": false, "data": [0.2, 500, 1500, "543 /escm/"]}, {"isController": false, "data": [0.2, 500, 1500, "808 /escm/order/showOrderDetail"]}, {"isController": false, "data": [0.9, 500, 1500, "524 /escm/login/auth"]}, {"isController": false, "data": [0.5, 500, 1500, "545 /escm/dashboard/index"]}, {"isController": true, "data": [0.0, 500, 1500, "order_search_by_offer_name_without_cache_4.6"]}, {"isController": false, "data": [1.0, 500, 1500, "813 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "783 /escm/images/sidebar-bg.jpg"]}, {"isController": true, "data": [0.0, 500, 1500, "SP_user_login_46_new"]}, {"isController": false, "data": [0.0, 500, 1500, "777 /escm/order/index"]}, {"isController": false, "data": [0.0, 500, 1500, "785 /escm/order/showOrderDetail"]}, {"isController": false, "data": [1.0, 500, 1500, "797 /escm/recentItem"]}, {"isController": false, "data": [0.1, 500, 1500, "541 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "810 /escm/recentItem"]}, {"isController": false, "data": [0.5, 500, 1500, "546 /escm/dashboard/myAccountInfo"]}, {"isController": false, "data": [0.0, 500, 1500, "540 /success.txt"]}, {"isController": false, "data": [0.0, 500, 1500, "779 /escm/order/list"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.5, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["812 /escm/messages", 5, 0, 0.0, 15.6, 25.0, 25.0, 25.0, 200.0, 90.0390625, 0.0, 12, 25]}, {"isController": false, "data": ["807 /escm/order/searchOrder", 5, 0, 0.0, 246.8, 274.0, 274.0, 274.0, 18.24817518248175, 76.05782390510949, 0.0, 217, 274]}, {"isController": true, "data": ["List_orders_without_cache_4.6", 5, 0, 0.0, 6039.2, 6335.0, 6335.0, 6335.0, 0.7892659826361483, 174.80715395619575, 0.0, 5535, 6335]}, {"isController": false, "data": ["796 /escm/messages", 5, 0, 0.0, 18.4, 24.0, 24.0, 24.0, 208.33333333333334, 93.79069010416667, 0.0, 13, 24]}, {"isController": false, "data": ["809 /escm/messages", 5, 0, 0.0, 15.8, 21.0, 21.0, 21.0, 238.09523809523807, 107.1893601190476, 0.0, 13, 21]}, {"isController": true, "data": ["Hit_the_portal_new", 5, 0, 0.0, 667.0, 1133.0, 1133.0, 1133.0, 4.41306266548985, 2550.5778353927626, 0.0, 486, 1133]}, {"isController": false, "data": ["543 /escm/", 5, 0, 0.0, 1759.0, 2392.0, 2392.0, 2392.0, 2.0903010033444813, 17.9157576034699, 0.0, 1178, 2392]}, {"isController": false, "data": ["808 /escm/order/showOrderDetail", 5, 0, 0.0, 1610.6, 1863.0, 1863.0, 1863.0, 2.683843263553409, 58.664515398550726, 0.0, 1425, 1863]}, {"isController": false, "data": ["524 /escm/login/auth", 5, 0, 0.0, 180.6, 591.0, 591.0, 591.0, 8.460236886632826, 49.37341370558376, 0.0, 69, 591]}, {"isController": false, "data": ["545 /escm/dashboard/index", 5, 0, 0.0, 1292.0, 1394.0, 1394.0, 1394.0, 3.586800573888092, 30.18586912661406, 0.0, 1211, 1394]}, {"isController": true, "data": ["order_search_by_offer_name_without_cache_4.6", 5, 0, 0.0, 1940.4, 2204.0, 2204.0, 2204.0, 2.268602540834846, 104.37122490358438, 0.0, 1716, 2204]}, {"isController": false, "data": ["813 /escm/recentItem", 5, 0, 0.0, 12.6, 14.0, 14.0, 14.0, 357.14285714285717, 118.93136160714286, 0.0, 11, 14]}, {"isController": false, "data": ["783 /escm/images/sidebar-bg.jpg", 5, 0, 0.0, 6.8, 10.0, 10.0, 10.0, 500.0, 831.54296875, 0.0, 5, 10]}, {"isController": true, "data": ["SP_user_login_46_new", 5, 5, 100.0, 49204.4, 49678.0, 49678.0, 49678.0, 0.10064817424211925, 34.104496237016384, 0.0, 48912, 49678]}, {"isController": false, "data": ["777 /escm/order/index", 5, 0, 0.0, 1958.8, 2094.0, 2094.0, 2094.0, 2.3877745940783193, 51.80165054918816, 0.0, 1770, 2094]}, {"isController": false, "data": ["785 /escm/order/showOrderDetail", 5, 0, 0.0, 2004.6, 2357.0, 2357.0, 2357.0, 2.1213406873143827, 46.37076726240984, 0.0, 1723, 2357]}, {"isController": false, "data": ["797 /escm/recentItem", 5, 0, 0.0, 17.0, 24.0, 24.0, 24.0, 208.33333333333334, 69.37662760416667, 0.0, 11, 24]}, {"isController": false, "data": ["541 /escm/login/doAuth?id=loginform", 5, 0, 0.0, 2057.2, 2662.0, 2662.0, 2662.0, 1.8782870022539444, 17.59573394064613, 0.0, 1400, 2662]}, {"isController": false, "data": ["810 /escm/recentItem", 5, 0, 0.0, 14.0, 16.0, 16.0, 16.0, 312.5, 104.06494140625, 0.0, 11, 16]}, {"isController": false, "data": ["546 /escm/dashboard/myAccountInfo", 5, 0, 0.0, 1317.6, 1362.0, 1362.0, 1362.0, 3.671071953010279, 30.299966730910423, 0.0, 1250, 1362]}, {"isController": false, "data": ["540 /success.txt", 5, 5, 100.0, 42034.2, 42127.0, 42127.0, 42127.0, 0.11868872694471479, 0.25569075355472737, 0.0, 42006, 42127]}, {"isController": false, "data": ["779 /escm/order/list", 5, 0, 0.0, 1828.2, 1953.0, 1953.0, 1953.0, 2.5601638504864312, 55.154029857910906, 0.0, 1533, 1953]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 90, 5, 5.555555555555555, 3132.766666666666, 2337.000000000001, 42006.45, 42127.0, 1.4362771695764578, 10.990278822292618, 0.0, 5, 42127]}}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "items": [{"isController": false, "data": ["Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 5, 100.0, 5.555555555555555]}], "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);
    
        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": ["540 /success.txt", 5, 5, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 5, null, null, null, null, null, null, null, null]}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 90, 5, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 5, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
