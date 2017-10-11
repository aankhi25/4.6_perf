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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "812 /escm/messages"]}, {"isController": false, "data": [0.725, 500, 1500, "807 /escm/order/searchOrder"]}, {"isController": true, "data": [0.0, 500, 1500, "List_orders_without_cache_4.6"]}, {"isController": false, "data": [1.0, 500, 1500, "796 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "809 /escm/messages"]}, {"isController": true, "data": [0.575, 500, 1500, "Hit_the_portal_new"]}, {"isController": false, "data": [0.0, 500, 1500, "543 /escm/"]}, {"isController": false, "data": [0.0, 500, 1500, "808 /escm/order/showOrderDetail"]}, {"isController": false, "data": [0.975, 500, 1500, "524 /escm/login/auth"]}, {"isController": false, "data": [0.0, 500, 1500, "545 /escm/dashboard/index"]}, {"isController": true, "data": [0.0, 500, 1500, "order_search_by_offer_name_without_cache_4.6"]}, {"isController": false, "data": [1.0, 500, 1500, "813 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "783 /escm/images/sidebar-bg.jpg"]}, {"isController": true, "data": [0.0, 500, 1500, "SP_user_login_46_new"]}, {"isController": false, "data": [0.0, 500, 1500, "777 /escm/order/index"]}, {"isController": false, "data": [0.0, 500, 1500, "785 /escm/order/showOrderDetail"]}, {"isController": false, "data": [1.0, 500, 1500, "797 /escm/recentItem"]}, {"isController": false, "data": [0.0, 500, 1500, "541 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "810 /escm/recentItem"]}, {"isController": false, "data": [0.0, 500, 1500, "546 /escm/dashboard/myAccountInfo"]}, {"isController": false, "data": [0.0, 500, 1500, "540 /success.txt"]}, {"isController": false, "data": [0.0, 500, 1500, "779 /escm/order/list"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.42159090909090907, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["812 /escm/messages", 20, 0, 0.0, 19.65, 42.20000000000002, 82.89999999999998, 85.0, 235.2941176470588, 105.9283088235294, 0.0, 9, 85]}, {"isController": false, "data": ["807 /escm/order/searchOrder", 20, 0, 0.0, 740.3, 2328.000000000003, 2785.85, 2802.0, 0.3184611955033279, 1.3273363109455112, 0.0, 221, 2802]}, {"isController": true, "data": ["List_orders_without_cache_4.6", 20, 0, 0.0, 31334.7, 38819.8, 39393.6, 39419.0, 0.5073695426063574, 112.37606111583247, 0.0, 22242, 39419]}, {"isController": false, "data": ["796 /escm/messages", 20, 0, 0.0, 45.150000000000006, 141.5000000000001, 168.85, 170.0, 0.3331168074085178, 0.14996762521027998, 0.0, 12, 170]}, {"isController": false, "data": ["809 /escm/messages", 20, 0, 0.0, 24.749999999999996, 44.20000000000002, 89.64999999999996, 92.0, 0.33316120004664257, 0.14998761056787327, 0.0, 10, 92]}, {"isController": true, "data": ["Hit_the_portal_new", 20, 0, 0.0, 641.3999999999999, 932.6000000000006, 1543.1999999999996, 1574.0, 12.706480304955527, 7343.849269377382, 0.0, 486, 1574]}, {"isController": false, "data": ["543 /escm/", 20, 0, 0.0, 8139.0, 10469.6, 11343.199999999999, 11389.0, 1.7560804284836247, 15.092002151198527, 0.0, 4816, 11389]}, {"isController": false, "data": ["808 /escm/order/showOrderDetail", 20, 0, 0.0, 3478.2499999999995, 7741.1, 10562.549999999997, 10709.0, 0.2828494251085435, 6.182828785939555, 0.0, 1622, 10709]}, {"isController": false, "data": ["524 /escm/login/auth", 20, 0, 0.0, 159.54999999999998, 263.1000000000002, 636.8499999999997, 656.0, 30.48780487804878, 177.9249237804878, 0.0, 91, 656]}, {"isController": false, "data": ["545 /escm/dashboard/index", 20, 0, 0.0, 8437.3, 11434.6, 11695.55, 11709.0, 1.7080877957126996, 14.30757056537706, 0.0, 4567, 11709]}, {"isController": true, "data": ["order_search_by_offer_name_without_cache_4.6", 20, 0, 0.0, 4334.799999999999, 10351.7, 11112.949999999999, 11153.0, 0.28108442370666026, 12.931997113614322, 0.0, 1920, 11153]}, {"isController": false, "data": ["813 /escm/recentItem", 20, 0, 0.0, 19.0, 37.500000000000014, 87.39999999999996, 90.0, 222.2222222222222, 74.00173611111111, 0.0, 9, 90]}, {"isController": false, "data": ["783 /escm/images/sidebar-bg.jpg", 20, 0, 0.0, 9.55, 20.50000000000001, 28.599999999999994, 29.0, 0.33321670748571336, 0.5541680203595408, 0.0, 4, 29]}, {"isController": true, "data": ["SP_user_login_46_new", 20, 20, 100.0, 77810.6, 83929.6, 84808.1, 84849.0, 0.23571285460052563, 79.80486842803097, 0.0, 68193, 84849]}, {"isController": false, "data": ["777 /escm/order/index", 20, 0, 0.0, 15384.85, 20064.5, 20382.3, 20396.0, 0.9805844283192783, 21.27710205126005, 0.0, 10841, 20396]}, {"isController": false, "data": ["785 /escm/order/showOrderDetail", 20, 0, 0.0, 6306.65, 10685.5, 10691.95, 10692.0, 0.28291744468963953, 6.1843570745275285, 0.0, 1804, 10692]}, {"isController": false, "data": ["797 /escm/recentItem", 20, 0, 0.0, 37.45000000000001, 102.00000000000003, 125.79999999999998, 127.0, 0.33313900224868825, 0.11093789039726827, 0.0, 12, 127]}, {"isController": false, "data": ["541 /escm/login/doAuth?id=loginform", 20, 0, 0.0, 10656.45, 13035.7, 13998.25, 14048.0, 0.2765639692460866, 2.514571464129653, 0.0, 8852, 14048]}, {"isController": false, "data": ["810 /escm/recentItem", 20, 0, 0.0, 19.45, 33.60000000000001, 81.49999999999997, 84.0, 0.33316674995835416, 0.11094713060136598, 0.0, 9, 84]}, {"isController": false, "data": ["546 /escm/dashboard/myAccountInfo", 20, 0, 0.0, 7596.500000000001, 10426.2, 10472.4, 10473.0, 1.9096724911677647, 15.783890718991692, 0.0, 4713, 10473]}, {"isController": false, "data": ["540 /success.txt", 20, 20, 100.0, 42028.549999999996, 42206.1, 42227.0, 42227.0, 0.47363061548298485, 1.020340954839321, 0.0, 42000, 42227]}, {"isController": false, "data": ["779 /escm/order/list", 20, 0, 0.0, 9172.0, 12348.7, 13211.5, 13254.0, 0.2871541587101035, 6.187078466668581, 0.0, 5545, 13254]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 360, 20, 5.555555555555555, 6237.466666666663, 13221.2, 42000.95, 42015.56, 2.7542097330711734, 21.033244650330122, 0.0, 4, 42227]}}, function(index, item){
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
