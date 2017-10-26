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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "201 /escm/messages"]}, {"isController": false, "data": [0.85, 500, 1500, "675 /escm/login/auth"]}, {"isController": false, "data": [0.0, 500, 1500, "194 /escm/order/list"]}, {"isController": true, "data": [0.0, 500, 1500, "Order_search_by_order_id_with_cache"]}, {"isController": false, "data": [0.125, 500, 1500, "680 /escm/dashboard/myAccountInfo"]}, {"isController": false, "data": [1.0, 500, 1500, "198 /escm/recentItem"]}, {"isController": false, "data": [0.0, 500, 1500, "200 /escm/order/showOrderDetail"]}, {"isController": false, "data": [1.0, 500, 1500, "204 /escm/recentItem"]}, {"isController": false, "data": [0.1, 500, 1500, "676 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [0.0, 500, 1500, "193 /escm/order/index"]}, {"isController": false, "data": [1.0, 500, 1500, "197 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "203 /escm/messages"]}, {"isController": true, "data": [0.0, 500, 1500, "SP_user_login_46_with_cache"]}, {"isController": false, "data": [1.0, 500, 1500, "202 /escm/recentItem"]}, {"isController": false, "data": [0.025, 500, 1500, "196 /escm/order/showOrderDetail"]}, {"isController": true, "data": [0.85, 500, 1500, "Hit_the_portal_with-cache"]}, {"isController": false, "data": [0.75, 500, 1500, "199 /escm/order/searchOrder"]}, {"isController": true, "data": [0.0, 500, 1500, "List_orders_with_cache"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.48333333333333334, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["201 /escm/messages", 20, 0, 0.0, 25.2, 58.40000000000001, 66.6, 67.0, 0.3329615262956365, 0.14989771838114105, 0.0, 10, 67]}, {"isController": false, "data": ["675 /escm/login/auth", 20, 0, 0.0, 286.94999999999993, 659.5000000000001, 733.3, 737.0, 27.137042062415198, 158.3700814111262, 0.0, 46, 737]}, {"isController": false, "data": ["194 /escm/order/list", 20, 0, 0.0, 5754.85, 12580.700000000015, 13986.599999999999, 14024.0, 0.3015545135171811, 6.495348757218462, 0.0, 1680, 14024]}, {"isController": true, "data": ["Order_search_by_order_id_with_cache", 20, 0, 0.0, 3571.899999999999, 4548.7, 4877.9, 4895.0, 0.3130135378355114, 8.874942532670788, 0.0, 2769, 4895]}, {"isController": false, "data": ["680 /escm/dashboard/myAccountInfo", 20, 0, 0.0, 4481.25, 7997.200000000001, 10265.449999999999, 10383.0, 1.9262255610131946, 15.869446300443034, 0.0, 922, 10383]}, {"isController": false, "data": ["198 /escm/recentItem", 20, 0, 0.0, 17.950000000000003, 40.00000000000004, 51.49999999999999, 52.0, 0.33310016321908, 0.11092495669697879, 0.0, 8, 52]}, {"isController": false, "data": ["200 /escm/order/showOrderDetail", 20, 0, 0.0, 2946.7000000000007, 3966.5, 4302.65, 4320.0, 0.3170928923628177, 7.411643799644856, 0.0, 2249, 4320]}, {"isController": false, "data": ["204 /escm/recentItem", 20, 0, 0.0, 16.149999999999995, 29.50000000000001, 36.64999999999999, 37.0, 0.333127904458917, 0.11093419474657294, 0.0, 8, 37]}, {"isController": false, "data": ["676 /escm/login/doAuth?id=loginform", 20, 0, 0.0, 7174.25, 12852.300000000001, 13045.45, 13052.0, 1.5323322096230463, 14.245975832247932, 0.0, 1139, 13052]}, {"isController": false, "data": ["193 /escm/order/index", 20, 0, 0.0, 5677.700000000001, 8955.400000000005, 14812.749999999996, 15110.0, 0.29820036082243656, 6.468123080335177, 0.0, 1507, 15110]}, {"isController": false, "data": ["197 /escm/messages", 20, 0, 0.0, 18.0, 28.900000000000002, 43.249999999999986, 44.0, 0.33308906801678767, 0.1499551370661515, 0.0, 11, 44]}, {"isController": false, "data": ["203 /escm/messages", 20, 0, 0.0, 23.3, 58.000000000000064, 91.39999999999998, 93.0, 0.33281746626062936, 0.14983286322866224, 0.0, 13, 93]}, {"isController": true, "data": ["SP_user_login_46_with_cache", 20, 0, 0.0, 11655.5, 18756.7, 20060.7, 20129.0, 0.9935913358835511, 17.423167444979878, 0.0, 2090, 20129]}, {"isController": false, "data": ["202 /escm/recentItem", 20, 0, 0.0, 20.249999999999996, 54.30000000000001, 58.8, 59.0, 0.3330058775537388, 0.11089355883381342, 0.0, 10, 59]}, {"isController": false, "data": ["196 /escm/order/showOrderDetail", 20, 0, 0.0, 3845.35, 12275.500000000002, 13429.4, 13486.0, 0.3189284005740711, 6.970282974206666, 0.0, 1364, 13486]}, {"isController": true, "data": ["Hit_the_portal_with-cache", 20, 0, 0.0, 286.94999999999993, 659.5000000000001, 733.3, 737.0, 27.137042062415198, 158.3700814111262, 0.0, 46, 737]}, {"isController": false, "data": ["199 /escm/order/searchOrder", 20, 0, 0.0, 540.3, 782.7, 876.1999999999999, 881.0, 0.32902854322612485, 1.1230026939211977, 0.0, 394, 881]}, {"isController": true, "data": ["List_orders_with_cache", 20, 0, 0.0, 15313.850000000002, 21535.900000000005, 22721.8, 22770.0, 0.2692986117656564, 17.738323485700246, 0.0, 12501, 22770]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 280, 0, 0.0, 2202.014285714286, 6419.8, 10677.499999999996, 13588.22, 4.174805051514112, 35.06636763538296, 0.0, 8, 15110]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 280, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
