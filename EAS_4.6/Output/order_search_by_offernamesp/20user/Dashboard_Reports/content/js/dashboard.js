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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "812 /escm/messages"]}, {"isController": false, "data": [0.75, 500, 1500, "807 /escm/order/searchOrder"]}, {"isController": true, "data": [0.0, 500, 1500, "List_orders_without_cache_4.6"]}, {"isController": false, "data": [1.0, 500, 1500, "796 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "809 /escm/messages"]}, {"isController": true, "data": [0.95, 500, 1500, "Hit_the_portal_new"]}, {"isController": false, "data": [0.1, 500, 1500, "543 /escm/"]}, {"isController": false, "data": [0.1, 500, 1500, "808 /escm/order/showOrderDetail"]}, {"isController": false, "data": [0.975, 500, 1500, "524 /escm/login/auth"]}, {"isController": false, "data": [0.075, 500, 1500, "545 /escm/dashboard/index"]}, {"isController": true, "data": [0.0, 500, 1500, "order_search_by_offer_name_without_cache_4.6"]}, {"isController": false, "data": [1.0, 500, 1500, "813 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "783 /escm/images/sidebar-bg.jpg"]}, {"isController": true, "data": [0.0, 500, 1500, "SP_user_login_46_new"]}, {"isController": false, "data": [0.0, 500, 1500, "777 /escm/order/index"]}, {"isController": false, "data": [0.0, 500, 1500, "785 /escm/order/showOrderDetail"]}, {"isController": false, "data": [1.0, 500, 1500, "797 /escm/recentItem"]}, {"isController": false, "data": [0.1, 500, 1500, "541 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "810 /escm/recentItem"]}, {"isController": false, "data": [0.0, 500, 1500, "546 /escm/dashboard/myAccountInfo"]}, {"isController": false, "data": [0.0, 500, 1500, "540 /success.txt"]}, {"isController": false, "data": [0.0, 500, 1500, "779 /escm/order/list"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.45681818181818185, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["812 /escm/messages", 20, 0, 0.0, 16.849999999999998, 41.7, 47.699999999999996, 48.0, 416.6666666666667, 187.58138020833334, 0.0, 9, 48]}, {"isController": false, "data": ["807 /escm/order/searchOrder", 20, 0, 0.0, 570.6000000000001, 1726.9, 1740.75, 1741.0, 11.487650775416428, 47.88016944284893, 0.0, 183, 1741]}, {"isController": true, "data": ["List_orders_without_cache_4.6", 20, 0, 0.0, 21164.350000000006, 26509.000000000004, 28221.6, 28307.0, 0.22648261179747925, 50.075261233537546, 0.0, 13559, 28307]}, {"isController": false, "data": ["796 /escm/messages", 20, 0, 0.0, 32.45, 112.60000000000018, 234.0499999999999, 240.0, 83.33333333333333, 37.51627604166667, 0.0, 10, 240]}, {"isController": false, "data": ["809 /escm/messages", 20, 0, 0.0, 22.75, 56.00000000000004, 73.19999999999999, 74.0, 270.27027027027026, 121.67440878378379, 0.0, 10, 74]}, {"isController": true, "data": ["Hit_the_portal_new", 20, 0, 0.0, 480.95, 541.7000000000002, 1047.6999999999996, 1074.0, 0.33031644315254016, 190.91000115610754, 0.0, 414, 1074]}, {"isController": false, "data": ["543 /escm/", 20, 0, 0.0, 4163.8, 6665.6, 6792.45, 6798.0, 0.2999085278989908, 2.570441601249119, 0.0, 1022, 6798]}, {"isController": false, "data": ["808 /escm/order/showOrderDetail", 20, 0, 0.0, 3780.2, 9995.0, 10374.15, 10394.0, 1.9241870309794114, 42.0540095247258, 0.0, 1308, 10394]}, {"isController": false, "data": ["524 /escm/login/auth", 20, 0, 0.0, 80.64999999999999, 104.4, 579.9999999999997, 605.0, 0.3327510190499958, 1.9419141502370851, 0.0, 36, 605]}, {"isController": false, "data": ["545 /escm/dashboard/index", 20, 0, 0.0, 5246.100000000001, 8290.700000000003, 11308.499999999998, 11460.0, 0.279876854184159, 2.3549423409949624, 0.0, 1123, 11460]}, {"isController": true, "data": ["order_search_by_offer_name_without_cache_4.6", 20, 0, 0.0, 4469.700000000001, 11846.0, 12133.0, 12148.0, 1.6463615409944024, 75.73906198551202, 0.0, 1542, 12148]}, {"isController": false, "data": ["813 /escm/recentItem", 20, 0, 0.0, 28.150000000000002, 60.60000000000001, 115.14999999999996, 118.0, 169.4915254237288, 56.44200211864407, 0.0, 9, 118]}, {"isController": false, "data": ["783 /escm/images/sidebar-bg.jpg", 20, 0, 0.0, 10.7, 25.0, 49.69999999999998, 51.0, 392.156862745098, 652.1905637254903, 0.0, 3, 51]}, {"isController": true, "data": ["SP_user_login_46_new", 20, 20, 100.0, 63660.35, 73484.0, 73715.2, 73722.0, 0.27128943870215133, 91.89307147968043, 0.0, 48508, 73722]}, {"isController": false, "data": ["777 /escm/order/index", 20, 0, 0.0, 10100.05, 13613.6, 15496.8, 15593.0, 0.26457476221343246, 5.68999806116307, 0.0, 5474, 15593]}, {"isController": false, "data": ["785 /escm/order/showOrderDetail", 20, 0, 0.0, 3108.0, 5694.600000000002, 6879.599999999999, 6936.0, 2.883506343713956, 63.01981960063437, 0.0, 1654, 6936]}, {"isController": false, "data": ["797 /escm/recentItem", 20, 0, 0.0, 41.15, 110.80000000000001, 111.95, 112.0, 178.57142857142858, 59.46568080357143, 0.0, 9, 112]}, {"isController": false, "data": ["541 /escm/login/doAuth?id=loginform", 20, 0, 0.0, 4189.85, 6568.8, 6994.9, 7016.0, 0.30886122864996757, 2.875410568266053, 0.0, 1373, 7016]}, {"isController": false, "data": ["810 /escm/recentItem", 20, 0, 0.0, 18.799999999999997, 43.30000000000001, 46.849999999999994, 47.0, 425.531914893617, 141.70545212765958, 0.0, 9, 47]}, {"isController": false, "data": ["546 /escm/dashboard/myAccountInfo", 20, 0, 0.0, 7048.9, 12351.2, 12761.25, 12782.0, 0.2747932181033772, 2.251144148793658, 0.0, 1577, 12782]}, {"isController": false, "data": ["540 /success.txt", 20, 20, 100.0, 42043.5, 42231.7, 42473.5, 42485.0, 0.4707543839002001, 1.0141446981287514, 0.0, 41995, 42485]}, {"isController": false, "data": ["779 /escm/order/list", 20, 0, 0.0, 7554.549999999999, 13918.7, 15354.55, 15428.0, 0.2651535238903325, 5.662231801353609, 0.0, 3874, 15428]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 360, 20, 5.555555555555555, 4892.058333333334, 11586.000000000005, 42000.0, 42021.39, 2.6550043143820106, 20.241339776942763, 0.0, 3, 42485]}}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "items": [{"isController": false, "data": ["Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 20, 100.0, 5.555555555555555]}], "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);
    
        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": ["540 /success.txt", 20, 20, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 20, null, null, null, null, null, null, null, null]}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 360, 20, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 20, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
