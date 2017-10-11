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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [0.25, 500, 1500, "158 /escm/login/doAuth?id=loginform"]}, {"isController": true, "data": [0.6, 500, 1500, "New_hit_the_portal_4.6"]}, {"isController": false, "data": [1.0, 500, 1500, "70 /escm/recentItem"]}, {"isController": true, "data": [0.0, 500, 1500, "new_List_Orders"]}, {"isController": false, "data": [0.05, 500, 1500, "59 /escm/order/showOrderDetail"]}, {"isController": true, "data": [0.0, 500, 1500, "new_SP_user_login_4.6"]}, {"isController": false, "data": [1.0, 500, 1500, "56 /escm/images/sidebar-bg.jpg"]}, {"isController": false, "data": [1.0, 500, 1500, "51 /escm/images/favicon.ico"]}, {"isController": false, "data": [0.95, 500, 1500, "88 /escm/login/auth"]}, {"isController": false, "data": [1.0, 500, 1500, "184 /escm/images/favicon.ico"]}, {"isController": false, "data": [0.05, 500, 1500, "1 /escm/order/index"]}, {"isController": false, "data": [1.0, 500, 1500, "69 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "93 /escm/images/favicon.ico"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.6076923076923076, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["158 /escm/login/doAuth?id=loginform", 10, 0, 0.0, 2265.4, 4920.4, 4925.0, 4925.0, 2.0304568527918785, 19.071621192893403, 6.427268401015229, 1111, 4925]}, {"isController": true, "data": ["New_hit_the_portal_4.6", 10, 0, 0.0, 723.5, 1129.0, 1140.0, 1140.0, 8.771929824561402, 6704.212924890351, 60.13569078947369, 491, 1140]}, {"isController": false, "data": ["70 /escm/recentItem", 10, 0, 0.0, 12.5, 28.900000000000006, 30.0, 30.0, 333.3333333333333, 111.00260416666667, 187.82552083333334, 7, 30]}, {"isController": true, "data": ["new_List_Orders", 10, 0, 0.0, 9604.4, 13126.3, 13169.0, 13169.0, 0.7593591009188245, 552.2163942070392, 32.99281812400334, 4183, 13169]}, {"isController": false, "data": ["59 /escm/order/showOrderDetail", 10, 0, 0.0, 4791.7, 9718.2, 9736.0, 9736.0, 1.027115858668858, 22.45491924301561, 0.6248956835456039, 1148, 9736]}, {"isController": true, "data": ["new_SP_user_login_4.6", 10, 0, 0.0, 3630.6, 6547.0, 6555.0, 6555.0, 1.5255530129672006, 904.8066838291381, 57.622997711670486, 2128, 6555]}, {"isController": false, "data": ["56 /escm/images/sidebar-bg.jpg", 10, 0, 0.0, 7.0, 15.700000000000001, 16.0, 16.0, 625.0, 1039.4287109375, 341.796875, 3, 16]}, {"isController": false, "data": ["51 /escm/images/favicon.ico", 10, 0, 0.0, 12.6, 47.300000000000004, 48.0, 48.0, 208.33333333333334, 25.431315104166668, 122.6806640625, 3, 48]}, {"isController": false, "data": ["88 /escm/login/auth", 10, 0, 0.0, 151.29999999999998, 523.0000000000001, 552.0, 552.0, 18.115942028985508, 105.7235054347826, 6.528108016304348, 46, 552]}, {"isController": false, "data": ["184 /escm/images/favicon.ico", 10, 0, 0.0, 5.8, 11.8, 12.0, 12.0, 833.3333333333334, 101.72526041666667, 531.4127604166666, 3, 12]}, {"isController": false, "data": ["1 /escm/order/index", 10, 0, 0.0, 3196.6, 6193.8, 6244.0, 6244.0, 1.6015374759769379, 34.67876035994555, 1.9284137772261372, 1438, 6244]}, {"isController": false, "data": ["69 /escm/messages", 10, 0, 0.0, 14.299999999999999, 27.6, 28.0, 28.0, 357.14285714285717, 160.78404017857142, 200.54408482142856, 8, 28]}, {"isController": false, "data": ["93 /escm/images/favicon.ico", 10, 0, 0.0, 27.9, 136.10000000000002, 143.0, 143.0, 69.93006993006993, 13068.113527097903, 29.365166083916087, 5, 143]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 100, 0, 0.0, 1048.51, 4152.100000000004, 6218.899999999994, 9734.22, 10.271158586688578, 255.0417947886709, 8.891372868734592, 3, 9736]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 100, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
