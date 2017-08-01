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

    var data = {"KoPercent": 5.0, "OkPercent": 95.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "99 /escm/images/favicon.ico"]}, {"isController": true, "data": [0.0, 500, 1500, "order_search_by_offername"]}, {"isController": false, "data": [1.0, 500, 1500, "115 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "116 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "113 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "111 /escm/recentItem"]}, {"isController": false, "data": [0.025, 500, 1500, "65 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "109 /escm/messages"]}, {"isController": false, "data": [0.05, 500, 1500, "108 /escm/order/showOrderDetail"]}, {"isController": false, "data": [0.075, 500, 1500, "106 /escm/order/showOrderDetail"]}, {"isController": false, "data": [0.975, 500, 1500, "33 /escm/login/auth"]}, {"isController": true, "data": [0.0, 500, 1500, "Hit_the_portal"]}, {"isController": false, "data": [1.0, 500, 1500, "43 /escm/images/favicon.ico"]}, {"isController": false, "data": [0.0, 500, 1500, "12 /escm/order/showOrderDetail"]}, {"isController": false, "data": [0.3, 500, 1500, "104 /escm/order/searchOrder"]}, {"isController": false, "data": [0.675, 500, 1500, "105 /escm/order/searchOrder"]}, {"isController": true, "data": [0.0, 500, 1500, "sp_userlogin_46"]}, {"isController": false, "data": [1.0, 500, 1500, "23 /escm/recentItem"]}, {"isController": true, "data": [0.0, 500, 1500, "List_Orders"]}, {"isController": false, "data": [1.0, 500, 1500, "107 /escm/messages"]}, {"isController": false, "data": [0.025, 500, 1500, "1 /escm/order/index"]}, {"isController": false, "data": [1.0, 500, 1500, "110 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "114 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "22 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.5885416666666666, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["99 /escm/images/favicon.ico", 20, 0, 0.0, 7.3, 17.800000000000004, 27.499999999999993, 28.0, 0.3332611267558696, 0.04068128988719111, 0.0, 2, 28]}, {"isController": true, "data": ["order_search_by_offername", 20, 0, 0.0, 9954.85, 19496.2, 20523.75, 20576.0, 0.27834994154651227, 19.103368512706673, 0.0, 5180, 20576]}, {"isController": false, "data": ["115 /escm/recentItem", 20, 0, 0.0, 8.700000000000001, 13.0, 22.499999999999993, 23.0, 0.3332611267558696, 0.11097855881225735, 0.0, 5, 23]}, {"isController": false, "data": ["116 /escm/recentItem", 20, 0, 0.0, 10.399999999999999, 30.900000000000045, 39.64999999999999, 40.0, 0.3331112591605596, 0.11092865173217854, 0.0, 6, 40]}, {"isController": false, "data": ["113 /escm/messages", 20, 0, 0.0, 15.250000000000002, 60.70000000000009, 73.55, 74.0, 0.33292272863468386, 0.14988025185604423, 0.0, 6, 74]}, {"isController": false, "data": ["111 /escm/recentItem", 20, 0, 0.0, 9.100000000000001, 16.800000000000004, 18.9, 19.0, 0.3332833408322085, 0.11098595627322569, 0.0, 6, 19]}, {"isController": false, "data": ["65 /escm/login/doAuth?id=loginform", 20, 0, 0.0, 5577.4, 10946.300000000003, 11493.75, 11514.0, 1.7370158068438424, 15.868589326037867, 0.0, 1484, 11514]}, {"isController": false, "data": ["109 /escm/messages", 20, 0, 0.0, 9.100000000000001, 12.900000000000002, 13.0, 13.0, 0.3332722334238723, 0.15003759727383312, 0.0, 6, 13]}, {"isController": false, "data": ["108 /escm/order/showOrderDetail", 20, 0, 0.0, 4972.85, 13645.5, 13772.0, 13778.0, 0.2710835208327686, 5.804192031330477, 0.0, 1449, 13778]}, {"isController": false, "data": ["106 /escm/order/showOrderDetail", 20, 0, 0.0, 2522.0, 4059.9, 4106.7, 4109.0, 0.3119686783446942, 6.679587572532718, 0.0, 1425, 4109]}, {"isController": false, "data": ["33 /escm/login/auth", 20, 0, 0.0, 119.79999999999998, 327.3000000000002, 704.6499999999997, 724.0, 27.624309392265193, 140.98109461325967, 0.0, 35, 724]}, {"isController": true, "data": ["Hit_the_portal", 20, 20, 100.0, 501.3999999999999, 1126.5000000000002, 1455.3999999999996, 1472.0, 13.58695652173913, 9182.473887567934, 0.0, 289, 1472]}, {"isController": false, "data": ["43 /escm/images/favicon.ico", 20, 0, 0.0, 9.5, 12.700000000000006, 54.79999999999997, 57.0, 350.8771929824561, 65569.83278508771, 0.0, 4, 57]}, {"isController": false, "data": ["12 /escm/order/showOrderDetail", 20, 20, 100.0, 173.15, 342.2000000000001, 370.7, 372.0, 0.3312794010468429, 0.4131287061882992, 0.0, 23, 372]}, {"isController": false, "data": ["104 /escm/order/searchOrder", 20, 0, 0.0, 1519.3499999999997, 2720.200000000001, 2837.75, 2841.0, 0.3185930929017459, 1.38575550369568, 0.0, 176, 2841]}, {"isController": false, "data": ["105 /escm/order/searchOrder", 20, 0, 0.0, 827.2500000000001, 2187.700000000001, 3241.3499999999995, 3294.0, 0.31598571744557147, 1.3744144389673587, 0.0, 152, 3294]}, {"isController": true, "data": ["sp_userlogin_46", 20, 0, 0.0, 6484.45, 12467.400000000005, 12723.95, 12727.0, 1.571462245619549, 705.6614382808203, 0.0, 2016, 12727]}, {"isController": false, "data": ["23 /escm/recentItem", 20, 0, 0.0, 13.600000000000001, 31.400000000000013, 54.79999999999998, 56.0, 0.3332611267558696, 0.11097855881225735, 0.0, 6, 56]}, {"isController": true, "data": ["List_Orders", 20, 20, 100.0, 4785.65, 7734.500000000002, 8547.4, 8586.0, 0.2916047006677748, 42.50347818341207, 0.0, 1418, 8586]}, {"isController": false, "data": ["107 /escm/messages", 20, 0, 0.0, 14.549999999999999, 15.800000000000004, 91.99999999999994, 96.0, 0.33324446814182884, 0.15002509747400694, 0.0, 7, 96]}, {"isController": false, "data": ["1 /escm/order/index", 20, 0, 0.0, 4396.85, 7107.000000000001, 8224.8, 8281.0, 0.2929072509189965, 5.504696927952138, 0.0, 1016, 8281]}, {"isController": false, "data": ["110 /escm/recentItem", 20, 0, 0.0, 15.600000000000001, 49.80000000000005, 66.24999999999999, 67.0, 0.33321670748571336, 0.11096376684826977, 0.0, 6, 67]}, {"isController": false, "data": ["114 /escm/messages", 20, 0, 0.0, 11.45, 28.900000000000023, 32.849999999999994, 33.0, 0.33315010077790547, 0.14998261372911564, 0.0, 6, 33]}, {"isController": false, "data": ["22 /escm/messages", 20, 0, 0.0, 13.05, 28.50000000000001, 39.44999999999999, 40.0, 0.3331112591605596, 0.14996512741505663, 0.0, 7, 40]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 400, 20, 5.0, 1012.3124999999992, 3263.5000000000014, 6079.099999999992, 13472.86, 5.421670416655371, 75.01231788693784, 0.0, 2, 13778]}}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "items": [{"isController": false, "data": ["404/Not Found", 20, 100.0, 5.0]}], "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);
    
        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": ["12 /escm/order/showOrderDetail", 20, 20, "404/Not Found", 20, null, null, null, null, null, null, null, null]}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 400, 20, "404/Not Found", 20, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
