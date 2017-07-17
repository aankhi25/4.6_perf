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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": true, "data": [0.0, 500, 1500, "Login Page Request"]}, {"isController": true, "data": [0.0, 500, 1500, "Order Selection"]}, {"isController": false, "data": [1.0, 500, 1500, "117 /escm/messages"]}, {"isController": false, "data": [0.0, 500, 1500, "88 /escm/order/showOrderDetail"]}, {"isController": false, "data": [0.85, 500, 1500, "109 /escm/order/searchOrder"]}, {"isController": true, "data": [0.0, 500, 1500, "Login Page Credentials and Dashboard Display"]}, {"isController": false, "data": [1.0, 500, 1500, "98 /escm/messages"]}, {"isController": false, "data": [0.0, 500, 1500, "77 /escm/order/index"]}, {"isController": true, "data": [0.05, 500, 1500, "Order_Search"]}, {"isController": false, "data": [1.0, 500, 1500, "112 /escm/recentItem"]}, {"isController": false, "data": [0.0, 500, 1500, "5 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "111 /escm/messages"]}, {"isController": false, "data": [0.95, 500, 1500, "62 /escm/login/auth"]}, {"isController": false, "data": [1.0, 500, 1500, "118 /escm/recentItem"]}, {"isController": false, "data": [0.35, 500, 1500, "110 /escm/order/showOrderDetail"]}, {"isController": false, "data": [1.0, 500, 1500, "99 /escm/recentItem"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.5125, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": true, "data": ["Login Page Request", 10, 10, 100.0, 400.69999999999993, 869.5000000000002, 912.0, 912.0, 10.964912280701753, 5361.3602487664475, 0.0, 305, 912]}, {"isController": true, "data": ["Order Selection", 10, 0, 0.0, 5438.0, 6471.1, 6503.0, 6503.0, 1.537751806858373, 255.30824715515917, 0.0, 4344, 6503]}, {"isController": false, "data": ["117 /escm/messages", 10, 0, 0.0, 9.100000000000001, 10.9, 11.0, 11.0, 909.090909090909, 409.26846590909093, 0.0, 7, 11]}, {"isController": false, "data": ["88 /escm/order/showOrderDetail", 10, 0, 0.0, 2414.1000000000004, 2808.0, 2835.0, 2835.0, 3.527336860670194, 76.47087191358025, 0.0, 1952, 2835]}, {"isController": false, "data": ["109 /escm/order/searchOrder", 10, 0, 0.0, 493.4, 634.4, 636.0, 636.0, 15.723270440251572, 57.277847386006286, 0.0, 396, 636]}, {"isController": true, "data": ["Login Page Credentials and Dashboard Display", 10, 0, 0.0, 4387.700000000001, 4989.2, 4991.0, 4991.0, 2.003606491685033, 640.8654719119415, 0.0, 3062, 4991]}, {"isController": false, "data": ["98 /escm/messages", 10, 0, 0.0, 32.3, 95.60000000000001, 97.0, 97.0, 103.09278350515463, 46.41188788659794, 0.0, 9, 97]}, {"isController": false, "data": ["77 /escm/order/index", 10, 0, 0.0, 2642.2000000000003, 3395.5, 3411.0, 3411.0, 2.931691586045148, 54.61936107446497, 0.0, 1977, 3411]}, {"isController": true, "data": ["Order_Search", 10, 0, 0.0, 2017.5, 2777.7000000000003, 2796.0, 2796.0, 3.57653791130186, 257.60782702968527, 0.0, 1427, 2796]}, {"isController": false, "data": ["112 /escm/recentItem", 10, 0, 0.0, 16.8, 39.70000000000001, 42.0, 42.0, 238.09523809523807, 79.2875744047619, 0.0, 8, 42]}, {"isController": false, "data": ["5 /escm/login/doAuth?id=loginform", 10, 0, 0.0, 3379.1000000000004, 3767.6, 3782.0, 3782.0, 2.6441036488630356, 24.862062483474354, 0.0, 2497, 3782]}, {"isController": false, "data": ["111 /escm/messages", 10, 0, 0.0, 24.7, 45.9, 46.0, 46.0, 217.3913043478261, 97.86854619565217, 0.0, 9, 46]}, {"isController": false, "data": ["62 /escm/login/auth", 10, 0, 0.0, 117.2, 556.3000000000002, 595.0, 595.0, 16.80672268907563, 85.7733718487395, 0.0, 40, 595]}, {"isController": false, "data": ["118 /escm/recentItem", 10, 0, 0.0, 10.2, 22.1, 23.0, 23.0, 434.7826086956522, 144.78600543478262, 0.0, 7, 23]}, {"isController": false, "data": ["110 /escm/order/showOrderDetail", 10, 0, 0.0, 1408.7, 2133.0, 2149.0, 2149.0, 4.653327128897161, 101.28938968706375, 0.0, 926, 2149]}, {"isController": false, "data": ["99 /escm/recentItem", 10, 0, 0.0, 16.0, 27.5, 28.0, 28.0, 357.14285714285717, 118.93136160714286, 0.0, 8, 28]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 120, 0, 0.0, 880.3166666666666, 2920.6, 3500.299999999999, 3751.759999999999, 31.729243786356427, 218.3396991505817, 0.0, 7, 3782]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": true, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 120, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
