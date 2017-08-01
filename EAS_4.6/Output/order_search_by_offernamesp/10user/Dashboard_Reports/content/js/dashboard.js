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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "99 /escm/images/favicon.ico"]}, {"isController": true, "data": [0.0, 500, 1500, "order_search_by_offername"]}, {"isController": false, "data": [1.0, 500, 1500, "115 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "116 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "113 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "111 /escm/recentItem"]}, {"isController": false, "data": [0.05, 500, 1500, "65 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "109 /escm/messages"]}, {"isController": false, "data": [0.2, 500, 1500, "108 /escm/order/showOrderDetail"]}, {"isController": false, "data": [0.0, 500, 1500, "106 /escm/order/showOrderDetail"]}, {"isController": false, "data": [0.95, 500, 1500, "33 /escm/login/auth"]}, {"isController": true, "data": [0.0, 500, 1500, "Hit_the_portal"]}, {"isController": false, "data": [1.0, 500, 1500, "43 /escm/images/favicon.ico"]}, {"isController": false, "data": [0.0, 500, 1500, "12 /escm/order/showOrderDetail"]}, {"isController": false, "data": [0.55, 500, 1500, "104 /escm/order/searchOrder"]}, {"isController": false, "data": [0.8, 500, 1500, "105 /escm/order/searchOrder"]}, {"isController": true, "data": [0.0, 500, 1500, "sp_userlogin_46"]}, {"isController": false, "data": [1.0, 500, 1500, "23 /escm/recentItem"]}, {"isController": true, "data": [0.0, 500, 1500, "List_Orders"]}, {"isController": false, "data": [1.0, 500, 1500, "107 /escm/messages"]}, {"isController": false, "data": [0.15, 500, 1500, "1 /escm/order/index"]}, {"isController": false, "data": [1.0, 500, 1500, "110 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "114 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "22 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.6125, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["99 /escm/images/favicon.ico", 10, 0, 0.0, 3.8, 5.0, 5.0, 5.0, 0.16665277893508876, 0.0203433568035997, 0.0, 2, 5]}, {"isController": true, "data": ["order_search_by_offername", 10, 0, 0.0, 9052.1, 15005.5, 15008.0, 15008.0, 0.6663113006396588, 45.72899661847015, 0.0, 5145, 15008]}, {"isController": false, "data": ["115 /escm/recentItem", 10, 0, 0.0, 8.600000000000001, 10.9, 11.0, 11.0, 909.090909090909, 302.734375, 0.0, 7, 11]}, {"isController": false, "data": ["116 /escm/recentItem", 10, 0, 0.0, 7.6, 9.0, 9.0, 9.0, 1111.111111111111, 370.0086805555556, 0.0, 6, 9]}, {"isController": false, "data": ["113 /escm/messages", 10, 0, 0.0, 9.100000000000001, 13.8, 14.0, 14.0, 714.2857142857143, 321.56808035714283, 0.0, 6, 14]}, {"isController": false, "data": ["111 /escm/recentItem", 10, 0, 0.0, 7.5, 9.9, 10.0, 10.0, 1000.0, 333.0078125, 0.0, 7, 10]}, {"isController": false, "data": ["65 /escm/login/doAuth?id=loginform", 10, 0, 0.0, 10601.5, 18632.8, 18643.0, 18643.0, 0.13000013000013, 1.156848813098813, 0.0, 1487, 18643]}, {"isController": false, "data": ["109 /escm/messages", 10, 0, 0.0, 9.8, 14.700000000000001, 15.0, 15.0, 666.6666666666666, 300.13020833333337, 0.0, 8, 15]}, {"isController": false, "data": ["108 /escm/order/showOrderDetail", 10, 0, 0.0, 2267.7, 3612.9, 3618.0, 3618.0, 2.7639579878385847, 59.17920164800995, 0.0, 1124, 3618]}, {"isController": false, "data": ["106 /escm/order/showOrderDetail", 10, 0, 0.0, 2946.3999999999996, 3668.9, 3673.0, 3673.0, 2.722570106180234, 58.2914490028587, 0.0, 1810, 3673]}, {"isController": false, "data": ["33 /escm/login/auth", 10, 0, 0.0, 116.10000000000002, 561.7000000000002, 603.0, 603.0, 0.16655008160954, 0.8499909438393125, 0.0, 40, 603]}, {"isController": true, "data": ["Hit_the_portal", 10, 10, 100.0, 467.5, 994.7, 1006.0, 1006.0, 0.16391830311772612, 110.78091960217027, 0.0, 287, 1006]}, {"isController": false, "data": ["43 /escm/images/favicon.ico", 10, 0, 0.0, 6.9, 8.9, 9.0, 9.0, 0.16665000166650001, 31.14255631728494, 0.0, 5, 9]}, {"isController": false, "data": ["12 /escm/order/showOrderDetail", 10, 10, 100.0, 626.7, 2028.7, 2050.0, 2050.0, 4.878048780487805, 6.083269817073171, 0.0, 23, 2050]}, {"isController": false, "data": ["104 /escm/order/searchOrder", 10, 0, 0.0, 2692.2000000000003, 11166.500000000002, 11800.0, 11800.0, 0.847457627118644, 3.686109639830508, 0.0, 160, 11800]}, {"isController": false, "data": ["105 /escm/order/searchOrder", 10, 0, 0.0, 980.8000000000001, 5794.100000000002, 6310.0, 6310.0, 1.5847860538827259, 6.89320027733756, 0.0, 143, 6310]}, {"isController": true, "data": ["sp_userlogin_46", 10, 0, 0.0, 11156.5, 19174.0, 19176.0, 19176.0, 0.1290838916211646, 57.93426241464328, 0.0, 2017, 19176]}, {"isController": false, "data": ["23 /escm/recentItem", 10, 0, 0.0, 10.8, 16.9, 17.0, 17.0, 588.2352941176471, 195.88694852941174, 0.0, 6, 17]}, {"isController": true, "data": ["List_Orders", 10, 10, 100.0, 5480.5, 9688.4, 9700.0, 9700.0, 0.14347202295552366, 20.912168220946914, 0.0, 1634, 9700]}, {"isController": false, "data": ["107 /escm/messages", 10, 0, 0.0, 13.200000000000001, 25.5, 26.0, 26.0, 384.61538461538464, 173.15204326923077, 0.0, 7, 26]}, {"isController": false, "data": ["1 /escm/order/index", 10, 0, 0.0, 4723.3, 9405.6, 9469.0, 9469.0, 0.14527493281034357, 2.7302891425147093, 0.0, 1080, 9469]}, {"isController": false, "data": ["110 /escm/recentItem", 10, 0, 0.0, 8.400000000000002, 10.8, 11.0, 11.0, 909.090909090909, 302.734375, 0.0, 7, 11]}, {"isController": false, "data": ["114 /escm/messages", 10, 0, 0.0, 8.200000000000001, 10.0, 10.0, 10.0, 1000.0, 450.1953125, 0.0, 7, 10]}, {"isController": false, "data": ["22 /escm/messages", 10, 0, 0.0, 9.6, 15.8, 16.0, 16.0, 625.0, 281.3720703125, 0.0, 7, 16]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 200, 10, 5.0, 1252.9100000000005, 3566.6, 6302.799999999998, 18524.820000000014, 2.6000026000026, 35.94193828568829, 0.0, 2, 18643]}}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "items": [{"isController": false, "data": ["404/Not Found", 10, 100.0, 5.0]}], "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);
    
        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": ["12 /escm/order/showOrderDetail", 10, 10, "404/Not Found", 10, null, null, null, null, null, null, null, null]}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 200, 10, "404/Not Found", 10, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
