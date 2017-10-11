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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "812 /escm/messages"]}, {"isController": false, "data": [0.75, 500, 1500, "807 /escm/order/searchOrder"]}, {"isController": true, "data": [0.0, 500, 1500, "List_orders_without_cache_4.6"]}, {"isController": false, "data": [1.0, 500, 1500, "796 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "809 /escm/messages"]}, {"isController": true, "data": [0.7166666666666667, 500, 1500, "Hit_the_portal_new"]}, {"isController": false, "data": [0.0, 500, 1500, "543 /escm/"]}, {"isController": false, "data": [0.0, 500, 1500, "808 /escm/order/showOrderDetail"]}, {"isController": false, "data": [0.9833333333333333, 500, 1500, "524 /escm/login/auth"]}, {"isController": false, "data": [0.0, 500, 1500, "545 /escm/dashboard/index"]}, {"isController": true, "data": [0.0, 500, 1500, "order_search_by_offer_name_without_cache_4.6"]}, {"isController": false, "data": [1.0, 500, 1500, "813 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "783 /escm/images/sidebar-bg.jpg"]}, {"isController": true, "data": [0.0, 500, 1500, "SP_user_login_46_new"]}, {"isController": false, "data": [0.0, 500, 1500, "777 /escm/order/index"]}, {"isController": false, "data": [0.0, 500, 1500, "785 /escm/order/showOrderDetail"]}, {"isController": false, "data": [1.0, 500, 1500, "797 /escm/recentItem"]}, {"isController": false, "data": [0.0, 500, 1500, "541 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "810 /escm/recentItem"]}, {"isController": false, "data": [0.0, 500, 1500, "546 /escm/dashboard/myAccountInfo"]}, {"isController": false, "data": [0.0, 500, 1500, "540 /success.txt"]}, {"isController": false, "data": [0.0, 500, 1500, "779 /escm/order/list"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.42954545454545456, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["812 /escm/messages", 30, 0, 0.0, 19.566666666666666, 32.0, 54.09999999999997, 75.0, 400.0, 180.078125, 0.0, 9, 75]}, {"isController": false, "data": ["807 /escm/order/searchOrder", 30, 0, 0.0, 773.3666666666667, 1283.3, 3733.749999999999, 4534.0, 6.6166740185266875, 27.578090538156154, 0.0, 231, 4534]}, {"isController": true, "data": ["List_orders_without_cache_4.6", 30, 0, 0.0, 34858.333333333336, 42898.8, 46875.35, 48054.0, 0.31132604138560843, 68.95061071791785, 0.0, 26213, 48054]}, {"isController": false, "data": ["796 /escm/messages", 30, 0, 0.0, 50.666666666666664, 199.3, 219.49999999999997, 236.0, 127.11864406779661, 57.22821769067797, 0.0, 9, 236]}, {"isController": false, "data": ["809 /escm/messages", 30, 0, 0.0, 37.400000000000006, 84.10000000000002, 141.5, 147.0, 0.24969412469724586, 0.11241112449749056, 0.0, 10, 147]}, {"isController": true, "data": ["Hit_the_portal_new", 30, 0, 0.0, 583.9666666666668, 735.1000000000001, 1252.5999999999995, 1774.0, 16.91093573844419, 9773.86027339346, 0.0, 451, 1774]}, {"isController": false, "data": ["543 /escm/", 30, 0, 0.0, 10389.366666666669, 13057.9, 13188.75, 13329.0, 2.2507314877335136, 19.320317189023932, 0.0, 5405, 13329]}, {"isController": false, "data": ["808 /escm/order/showOrderDetail", 30, 0, 0.0, 3031.933333333333, 6595.300000000007, 9970.699999999997, 12592.0, 2.3824650571791612, 52.07834401306385, 0.0, 1732, 12592]}, {"isController": false, "data": ["524 /escm/login/auth", 30, 0, 0.0, 142.13333333333335, 173.10000000000002, 438.39999999999964, 731.0, 41.03967168262654, 239.5049589603283, 0.0, 84, 731]}, {"isController": false, "data": ["545 /escm/dashboard/index", 30, 0, 0.0, 11679.866666666667, 14517.400000000001, 15350.25, 15903.0, 1.8864365214110546, 15.892920655693894, 0.0, 7547, 15903]}, {"isController": true, "data": ["order_search_by_offer_name_without_cache_4.6", 30, 0, 0.0, 3947.666666666666, 9574.000000000011, 12714.15, 13015.0, 2.3050326546292736, 106.04868481079524, 0.0, 2095, 13015]}, {"isController": false, "data": ["813 /escm/recentItem", 30, 0, 0.0, 16.166666666666668, 24.900000000000002, 41.9, 43.0, 697.6744186046512, 232.3310319767442, 0.0, 9, 43]}, {"isController": false, "data": ["783 /escm/images/sidebar-bg.jpg", 30, 0, 0.0, 11.066666666666666, 30.10000000000002, 45.59999999999998, 61.0, 0.4998167338642498, 0.8312381814168138, 0.0, 4, 61]}, {"isController": true, "data": ["SP_user_login_46_new", 30, 30, 100.0, 89598.09999999999, 100740.1, 101248.85, 101410.0, 0.295828813726457, 100.19456137215265, 0.0, 76511, 101410]}, {"isController": false, "data": ["777 /escm/order/index", 30, 0, 0.0, 16224.933333333336, 23317.9, 23690.149999999998, 24013.0, 0.3967571713858728, 8.606905496574663, 0.0, 11012, 24013]}, {"isController": false, "data": ["785 /escm/order/showOrderDetail", 30, 0, 0.0, 6252.0, 12071.300000000001, 12515.15, 12519.0, 0.4136846895296405, 9.042861827590011, 0.0, 1766, 12519]}, {"isController": false, "data": ["797 /escm/recentItem", 30, 0, 0.0, 30.733333333333324, 93.30000000000001, 105.19999999999999, 114.0, 263.1578947368421, 87.63363486842105, 0.0, 9, 114]}, {"isController": false, "data": ["541 /escm/login/doAuth?id=loginform", 30, 0, 0.0, 11359.833333333336, 14552.200000000003, 15196.699999999999, 15838.0, 0.4072600898687265, 3.7568550145595485, 0.0, 8758, 15838]}, {"isController": false, "data": ["810 /escm/recentItem", 30, 0, 0.0, 30.43333333333333, 72.60000000000002, 143.8999999999999, 222.0, 135.13513513513513, 45.00105574324324, 0.0, 9, 222]}, {"isController": false, "data": ["546 /escm/dashboard/myAccountInfo", 30, 0, 0.0, 13364.4, 20862.4, 21697.2, 22443.0, 0.4174493842621582, 3.4302734510888473, 0.0, 6447, 22443]}, {"isController": false, "data": ["540 /success.txt", 30, 30, 100.0, 42023.600000000006, 42034.0, 42244.25, 42269.0, 0.70973999858052, 1.5289906610045187, 0.0, 41997, 42269]}, {"isController": false, "data": ["779 /escm/order/list", 30, 0, 0.0, 11981.93333333333, 15521.000000000002, 20180.7, 20954.0, 0.39698292973402144, 8.550110307496361, 0.0, 4887, 20954]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 540, 30, 5.555555555555555, 7078.85555555556, 15611.5, 41999.0, 42017.18, 3.9819191375458103, 30.433114646549374, 0.0, 4, 42269]}}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "items": [{"isController": false, "data": ["Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 30, 100.0, 5.555555555555555]}], "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);
    
        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": ["540 /success.txt", 30, 30, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 30, null, null, null, null, null, null, null, null]}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 540, 30, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 30, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
