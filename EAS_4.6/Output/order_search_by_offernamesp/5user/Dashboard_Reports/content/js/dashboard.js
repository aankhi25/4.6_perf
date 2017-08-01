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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "99 /escm/images/favicon.ico"]}, {"isController": true, "data": [0.0, 500, 1500, "order_search_by_offername"]}, {"isController": false, "data": [1.0, 500, 1500, "115 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "116 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "113 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "111 /escm/recentItem"]}, {"isController": false, "data": [0.0, 500, 1500, "65 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "109 /escm/messages"]}, {"isController": false, "data": [0.1, 500, 1500, "108 /escm/order/showOrderDetail"]}, {"isController": false, "data": [0.0, 500, 1500, "106 /escm/order/showOrderDetail"]}, {"isController": false, "data": [0.9, 500, 1500, "33 /escm/login/auth"]}, {"isController": true, "data": [0.0, 500, 1500, "Hit_the_portal"]}, {"isController": false, "data": [1.0, 500, 1500, "43 /escm/images/favicon.ico"]}, {"isController": false, "data": [0.0, 500, 1500, "12 /escm/order/showOrderDetail"]}, {"isController": false, "data": [0.2, 500, 1500, "104 /escm/order/searchOrder"]}, {"isController": false, "data": [0.9, 500, 1500, "105 /escm/order/searchOrder"]}, {"isController": true, "data": [0.0, 500, 1500, "sp_userlogin_46"]}, {"isController": false, "data": [1.0, 500, 1500, "23 /escm/recentItem"]}, {"isController": true, "data": [0.0, 500, 1500, "List_Orders"]}, {"isController": false, "data": [1.0, 500, 1500, "107 /escm/messages"]}, {"isController": false, "data": [0.1, 500, 1500, "1 /escm/order/index"]}, {"isController": false, "data": [1.0, 500, 1500, "110 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "114 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "22 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.5916666666666667, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["99 /escm/images/favicon.ico", 5, 0, 0.0, 4.0, 5.0, 5.0, 5.0, 1000.0, 122.0703125, 0.0, 3, 5]}, {"isController": true, "data": ["order_search_by_offername", 5, 0, 0.0, 6227.8, 6817.0, 6817.0, 6817.0, 0.7334604664808567, 50.337735624174854, 0.0, 5412, 6817]}, {"isController": false, "data": ["115 /escm/recentItem", 5, 0, 0.0, 8.8, 14.0, 14.0, 14.0, 357.14285714285717, 118.93136160714286, 0.0, 6, 14]}, {"isController": false, "data": ["116 /escm/recentItem", 5, 0, 0.0, 8.2, 13.0, 13.0, 13.0, 384.61538461538464, 128.0799278846154, 0.0, 6, 13]}, {"isController": false, "data": ["113 /escm/messages", 5, 0, 0.0, 18.0, 45.0, 45.0, 45.0, 111.1111111111111, 50.02170138888889, 0.0, 9, 45]}, {"isController": false, "data": ["111 /escm/recentItem", 5, 0, 0.0, 9.6, 14.0, 14.0, 14.0, 357.14285714285717, 118.93136160714286, 0.0, 8, 14]}, {"isController": false, "data": ["65 /escm/login/doAuth?id=loginform", 5, 0, 0.0, 1979.2, 2345.0, 2345.0, 2345.0, 2.1321961620469083, 19.728644722814497, 0.0, 1535, 2345]}, {"isController": false, "data": ["109 /escm/messages", 5, 0, 0.0, 9.2, 12.0, 12.0, 12.0, 416.6666666666667, 187.58138020833334, 0.0, 8, 12]}, {"isController": false, "data": ["108 /escm/order/showOrderDetail", 5, 0, 0.0, 2297.4, 2668.0, 2668.0, 2668.0, 1.8740629685157422, 40.125811117878555, 0.0, 1136, 2668]}, {"isController": false, "data": ["106 /escm/order/showOrderDetail", 5, 0, 0.0, 2215.6, 2864.0, 2864.0, 2864.0, 1.7458100558659218, 37.379089014490226, 0.0, 1747, 2864]}, {"isController": false, "data": ["33 /escm/login/auth", 5, 0, 0.0, 177.8, 668.0, 668.0, 668.0, 7.485029940119761, 38.19996725299401, 0.0, 38, 668]}, {"isController": true, "data": ["Hit_the_portal", 5, 5, 100.0, 485.6, 985.0, 985.0, 985.0, 5.076142131979695, 3430.6095336294416, 0.0, 295, 985]}, {"isController": false, "data": ["43 /escm/images/favicon.ico", 5, 0, 0.0, 7.8, 10.0, 10.0, 10.0, 500.0, 93437.01171875, 0.0, 6, 10]}, {"isController": false, "data": ["12 /escm/order/showOrderDetail", 5, 5, 100.0, 176.4, 274.0, 274.0, 274.0, 18.24817518248175, 22.75675752737226, 0.0, 39, 274]}, {"isController": false, "data": ["104 /escm/order/searchOrder", 5, 0, 0.0, 1347.0, 1556.0, 1556.0, 1556.0, 3.2133676092544987, 13.976893878534703, 0.0, 949, 1556]}, {"isController": false, "data": ["105 /escm/order/searchOrder", 5, 0, 0.0, 254.6, 592.0, 592.0, 592.0, 8.445945945945946, 36.73656566722973, 0.0, 137, 592]}, {"isController": true, "data": ["sp_userlogin_46", 5, 0, 0.0, 2598.0, 2983.0, 2983.0, 2983.0, 1.6761649346295675, 752.8743609621187, 0.0, 2127, 2983]}, {"isController": false, "data": ["23 /escm/recentItem", 5, 0, 0.0, 10.2, 14.0, 14.0, 14.0, 357.14285714285717, 118.93136160714286, 0.0, 8, 14]}, {"isController": true, "data": ["List_Orders", 5, 5, 100.0, 2399.2, 3271.0, 3271.0, 3271.0, 1.5285845307245491, 222.79447942143076, 0.0, 1269, 3271]}, {"isController": false, "data": ["107 /escm/messages", 5, 0, 0.0, 10.4, 15.0, 15.0, 15.0, 333.3333333333333, 150.06510416666669, 0.0, 8, 15]}, {"isController": false, "data": ["1 /escm/order/index", 5, 0, 0.0, 2025.8, 3095.0, 3095.0, 3095.0, 1.6155088852988693, 30.352635298869142, 0.0, 1048, 3095]}, {"isController": false, "data": ["110 /escm/recentItem", 5, 0, 0.0, 8.8, 12.0, 12.0, 12.0, 416.6666666666667, 138.75325520833334, 0.0, 7, 12]}, {"isController": false, "data": ["114 /escm/messages", 5, 0, 0.0, 12.4, 21.0, 21.0, 21.0, 238.09523809523807, 107.1893601190476, 0.0, 7, 21]}, {"isController": false, "data": ["22 /escm/messages", 5, 0, 0.0, 16.8, 45.0, 45.0, 45.0, 111.1111111111111, 50.02170138888889, 0.0, 8, 45]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 100, 5, 5.0, 529.9, 2263.7000000000007, 2521.95, 3092.6899999999987, 32.31017770597738, 447.2129316437803, 0.0, 3, 3095]}}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "items": [{"isController": false, "data": ["404/Not Found", 5, 100.0, 5.0]}], "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);
    
        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": ["12 /escm/order/showOrderDetail", 5, 5, "404/Not Found", 5, null, null, null, null, null, null, null, null]}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 100, 5, "404/Not Found", 5, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
