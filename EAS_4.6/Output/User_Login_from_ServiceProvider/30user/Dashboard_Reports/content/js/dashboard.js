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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": true, "data": [0.0, 500, 1500, "Login Page Request"]}, {"isController": true, "data": [0.0, 500, 1500, "Order Selection"]}, {"isController": false, "data": [1.0, 500, 1500, "117 /escm/messages"]}, {"isController": false, "data": [0.0, 500, 1500, "88 /escm/order/showOrderDetail"]}, {"isController": false, "data": [0.7833333333333333, 500, 1500, "109 /escm/order/searchOrder"]}, {"isController": true, "data": [0.0, 500, 1500, "Login Page Credentials and Dashboard Display"]}, {"isController": false, "data": [1.0, 500, 1500, "98 /escm/messages"]}, {"isController": false, "data": [0.0, 500, 1500, "77 /escm/order/index"]}, {"isController": true, "data": [0.016666666666666666, 500, 1500, "Order_Search"]}, {"isController": false, "data": [1.0, 500, 1500, "112 /escm/recentItem"]}, {"isController": false, "data": [0.0, 500, 1500, "5 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "111 /escm/messages"]}, {"isController": false, "data": [0.9833333333333333, 500, 1500, "62 /escm/login/auth"]}, {"isController": false, "data": [1.0, 500, 1500, "118 /escm/recentItem"]}, {"isController": false, "data": [0.016666666666666666, 500, 1500, "110 /escm/order/showOrderDetail"]}, {"isController": false, "data": [1.0, 500, 1500, "99 /escm/recentItem"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.4875, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": true, "data": ["Login Page Request", 30, 30, 100.0, 335.1333333333333, 407.1000000000001, 679.1999999999997, 908.0, 0.49660652209899026, 242.81876577760306, 0.0, 279, 908]}, {"isController": true, "data": ["Order Selection", 30, 0, 0.0, 21367.5, 22966.6, 23901.6, 24049.0, 1.2474531165537028, 207.11412929071895, 0.0, 19603, 24049]}, {"isController": false, "data": ["117 /escm/messages", 30, 0, 0.0, 16.200000000000003, 23.900000000000002, 67.74999999999999, 76.0, 0.4993674678740262, 0.22481289325188095, 0.0, 7, 76]}, {"isController": false, "data": ["88 /escm/order/showOrderDetail", 30, 0, 0.0, 9711.733333333337, 11661.1, 12190.6, 12239.0, 2.4511806520140533, 53.139474094084484, 0.0, 7760, 12239]}, {"isController": false, "data": ["109 /escm/order/searchOrder", 30, 0, 0.0, 523.4000000000001, 716.7, 731.35, 744.0, 40.32258064516129, 146.9293409778226, 0.0, 357, 744]}, {"isController": true, "data": ["Login Page Credentials and Dashboard Display", 30, 0, 0.0, 18131.033333333333, 20523.6, 21007.65, 21105.0, 0.37583152725404956, 120.37933977753906, 0.0, 15103, 21105]}, {"isController": false, "data": ["98 /escm/messages", 30, 0, 0.0, 19.200000000000003, 52.500000000000014, 71.94999999999997, 89.0, 337.07865168539325, 151.75122893258427, 0.0, 7, 89]}, {"isController": false, "data": ["77 /escm/order/index", 30, 0, 0.0, 11401.500000000002, 12057.6, 12405.699999999999, 12596.0, 2.3817084788821847, 44.379943285566846, 0.0, 10012, 12596]}, {"isController": true, "data": ["Order_Search", 30, 0, 0.0, 5967.833333333333, 7687.400000000001, 8495.949999999999, 8799.0, 3.4094783498124785, 247.8378890712013, 0.0, 1483, 8799]}, {"isController": false, "data": ["112 /escm/recentItem", 30, 0, 0.0, 19.533333333333335, 47.7, 55.9, 57.0, 0.4999166805532411, 0.16647616022329612, 0.0, 7, 57]}, {"isController": false, "data": ["5 /escm/login/doAuth?id=loginform", 30, 0, 0.0, 17417.600000000002, 19600.600000000002, 20044.9, 20167.0, 1.4875787177071453, 14.649987061164277, 0.0, 14565, 20167]}, {"isController": false, "data": ["111 /escm/messages", 30, 0, 0.0, 21.500000000000007, 65.90000000000006, 89.8, 92.0, 0.4999416734714283, 0.22507139792024264, 0.0, 7, 92]}, {"isController": false, "data": ["62 /escm/login/auth", 30, 0, 0.0, 66.00000000000001, 87.00000000000003, 332.8499999999996, 615.0, 0.49915144254766897, 2.5474271862833184, 0.0, 32, 615]}, {"isController": false, "data": ["118 /escm/recentItem", 30, 0, 0.0, 29.8, 26.700000000000006, 268.7499999999999, 354.0, 0.4970673029128144, 0.1655272952082712, 0.0, 6, 354]}, {"isController": false, "data": ["110 /escm/order/showOrderDetail", 30, 0, 0.0, 5265.366666666666, 6815.2, 7707.5, 8076.0, 0.4831462483693814, 10.836882277390366, 0.0, 707, 8076]}, {"isController": false, "data": ["99 /escm/recentItem", 30, 0, 0.0, 17.6, 34.20000000000002, 81.34999999999997, 105.0, 285.7142857142857, 95.14508928571429, 0.0, 6, 105]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 360, 0, 0.0, 3709.119444444446, 11945.200000000003, 17379.599999999988, 19435.359999999997, 2.9485719902041887, 20.563290189138606, 0.0, 6, 20167]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": true, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 360, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
