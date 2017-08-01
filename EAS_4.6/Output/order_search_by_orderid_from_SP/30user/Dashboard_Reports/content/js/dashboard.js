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

    var data = {"KoPercent": 7.142857142857143, "OkPercent": 92.85714285714286};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "13 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "99 /escm/images/favicon.ico"]}, {"isController": true, "data": [0.0, 500, 1500, "order_search_by_id"]}, {"isController": false, "data": [0.21666666666666667, 500, 1500, "5 /escm/order/showOrderDetail"]}, {"isController": false, "data": [1.0, 500, 1500, "7 /escm/recentItem"]}, {"isController": false, "data": [0.48333333333333334, 500, 1500, "65 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "6 /escm/messages"]}, {"isController": false, "data": [0.9833333333333333, 500, 1500, "33 /escm/login/auth"]}, {"isController": true, "data": [0.0, 500, 1500, "Hit_the_portal"]}, {"isController": false, "data": [1.0, 500, 1500, "43 /escm/images/favicon.ico"]}, {"isController": false, "data": [0.0, 500, 1500, "12 /escm/order/showOrderDetail"]}, {"isController": true, "data": [0.05, 500, 1500, "sp_userlogin_46"]}, {"isController": false, "data": [1.0, 500, 1500, "23 /escm/recentItem"]}, {"isController": true, "data": [0.0, 500, 1500, "List_Orders"]}, {"isController": false, "data": [0.4666666666666667, 500, 1500, "1 /escm/order/index"]}, {"isController": false, "data": [1.0, 500, 1500, "10 /escm/messages"]}, {"isController": false, "data": [0.9333333333333333, 500, 1500, "4 /escm/order/searchOrder"]}, {"isController": false, "data": [1.0, 500, 1500, "22 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.6185185185185185, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["13 /escm/recentItem", 30, 0, 0.0, 9.7, 18.800000000000004, 21.0, 21.0, 0.4999083501358084, 0.16647338612920964, 0.0, 6, 21]}, {"isController": false, "data": ["99 /escm/images/favicon.ico", 30, 0, 0.0, 3.6, 5.0, 8.799999999999997, 11.0, 0.49996666888874075, 0.06103108751083261, 0.0, 2, 11]}, {"isController": true, "data": ["order_search_by_id", 30, 0, 0.0, 2079.833333333332, 2375.8, 2666.2999999999997, 2751.0, 0.48229185087535975, 35.332430961931095, 0.0, 1544, 2751]}, {"isController": false, "data": ["5 /escm/order/showOrderDetail", 30, 0, 0.0, 1528.4999999999995, 1839.3000000000002, 2050.15, 2142.0, 0.48664168572679933, 11.130819676951027, 0.0, 1136, 2142]}, {"isController": false, "data": ["7 /escm/recentItem", 30, 0, 0.0, 10.166666666666668, 12.900000000000002, 40.74999999999996, 71.0, 0.49993334222103725, 0.1664817086888415, 0.0, 5, 71]}, {"isController": false, "data": ["65 /escm/login/doAuth?id=loginform", 30, 0, 0.0, 1144.2333333333333, 1347.1000000000001, 1458.85, 1554.0, 0.4889577051585038, 4.50659201572814, 0.0, 797, 1554]}, {"isController": false, "data": ["6 /escm/messages", 30, 0, 0.0, 14.033333333333331, 27.10000000000002, 59.04999999999997, 86.0, 0.4999083501358084, 0.2250563959107497, 0.0, 5, 86]}, {"isController": false, "data": ["33 /escm/login/auth", 30, 0, 0.0, 86.9, 241.8, 397.4999999999998, 579.0, 0.49950881633060823, 2.5492510489685145, 0.0, 23, 579]}, {"isController": true, "data": ["Hit_the_portal", 30, 30, 100.0, 382.86666666666673, 562.6, 887.75, 896.0, 0.497471188127021, 336.20599193682114, 0.0, 180, 896]}, {"isController": false, "data": ["43 /escm/images/favicon.ico", 30, 0, 0.0, 6.3999999999999995, 10.800000000000004, 12.899999999999999, 14.0, 0.49992501124831273, 93.42299826900965, 0.0, 4, 14]}, {"isController": false, "data": ["12 /escm/order/showOrderDetail", 30, 30, 100.0, 44.96666666666666, 83.9, 96.35, 98.0, 0.4993175992809827, 0.6226841545720848, 0.0, 21, 98]}, {"isController": true, "data": ["sp_userlogin_46", 30, 0, 0.0, 1685.7000000000003, 1852.9, 2020.6999999999998, 2134.0, 0.4854840275754928, 218.04487869979286, 0.0, 1206, 2134]}, {"isController": false, "data": ["23 /escm/recentItem", 30, 0, 0.0, 8.466666666666669, 11.0, 15.599999999999994, 20.0, 0.49993334222103725, 0.1664817086888415, 0.0, 6, 20]}, {"isController": true, "data": ["List_Orders", 30, 30, 100.0, 1238.5333333333338, 1464.7, 1835.2499999999998, 2047.0, 0.4882494629255908, 71.16552203530857, 0.0, 844, 2047]}, {"isController": false, "data": ["1 /escm/order/index", 30, 0, 0.0, 1075.5, 1339.4, 1637.05, 1730.0, 0.4890134967725109, 9.189840260684946, 0.0, 730, 1730]}, {"isController": false, "data": ["10 /escm/messages", 30, 0, 0.0, 11.3, 16.0, 36.34999999999998, 49.0, 0.49993334222103725, 0.22506764723036926, 0.0, 6, 49]}, {"isController": false, "data": ["4 /escm/order/searchOrder", 30, 0, 0.0, 465.26666666666677, 531.8000000000001, 670.0999999999998, 834.0, 0.49314528059966467, 1.7996913218759245, 0.0, 301, 834]}, {"isController": false, "data": ["22 /escm/messages", 30, 0, 0.0, 9.333333333333336, 13.900000000000002, 16.799999999999997, 19.0, 0.4998750312421895, 0.22504139590102473, 0.0, 5, 19]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 420, 30, 7.142857142857143, 315.59761904761905, 1229.0000000000005, 1484.5999999999997, 1754.4900000000007, 6.8129836001751904, 121.7712623130485, 0.0, 2, 2142]}}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "items": [{"isController": false, "data": ["404/Not Found", 30, 100.0, 7.142857142857143]}], "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);
    
        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": ["12 /escm/order/showOrderDetail", 30, 30, "404/Not Found", 30, null, null, null, null, null, null, null, null]}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 420, 30, "404/Not Found", 30, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
