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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "201 /escm/messages"]}, {"isController": false, "data": [0.5, 500, 1500, "675 /escm/login/auth"]}, {"isController": false, "data": [0.5, 500, 1500, "194 /escm/order/list"]}, {"isController": true, "data": [0.0, 500, 1500, "Order_search_by_order_id_with_cache"]}, {"isController": false, "data": [0.5, 500, 1500, "680 /escm/dashboard/myAccountInfo"]}, {"isController": false, "data": [1.0, 500, 1500, "198 /escm/recentItem"]}, {"isController": false, "data": [0.0, 500, 1500, "200 /escm/order/showOrderDetail"]}, {"isController": false, "data": [1.0, 500, 1500, "204 /escm/recentItem"]}, {"isController": false, "data": [0.0, 500, 1500, "676 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [0.5, 500, 1500, "193 /escm/order/index"]}, {"isController": false, "data": [1.0, 500, 1500, "197 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "203 /escm/messages"]}, {"isController": true, "data": [0.0, 500, 1500, "SP_user_login_46_with_cache"]}, {"isController": false, "data": [1.0, 500, 1500, "202 /escm/recentItem"]}, {"isController": false, "data": [0.0, 500, 1500, "196 /escm/order/showOrderDetail"]}, {"isController": true, "data": [0.5, 500, 1500, "Hit_the_portal_with-cache"]}, {"isController": false, "data": [1.0, 500, 1500, "199 /escm/order/searchOrder"]}, {"isController": true, "data": [0.0, 500, 1500, "List_orders_with_cache"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.5277777777777778, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["201 /escm/messages", 1, 0, 0.0, 26.0, 26.0, 26.0, 26.0, 38.46153846153847, 17.315204326923077, 0.0, 26, 26]}, {"isController": false, "data": ["675 /escm/login/auth", 1, 0, 0.0, 587.0, 587.0, 587.0, 587.0, 1.7035775127768313, 9.94197189097104, 0.0, 587, 587]}, {"isController": false, "data": ["194 /escm/order/list", 1, 0, 0.0, 1283.0, 1283.0, 1283.0, 1283.0, 0.779423226812159, 16.791090218238505, 0.0, 1283, 1283]}, {"isController": true, "data": ["Order_search_by_order_id_with_cache", 1, 0, 0.0, 2652.0, 2652.0, 2652.0, 2652.0, 0.3770739064856712, 10.69210737179487, 0.0, 2652, 2652]}, {"isController": false, "data": ["680 /escm/dashboard/myAccountInfo", 1, 0, 0.0, 737.0, 737.0, 737.0, 737.0, 1.3568521031207597, 11.191379748982362, 0.0, 737, 737]}, {"isController": false, "data": ["198 /escm/recentItem", 1, 0, 0.0, 16.0, 16.0, 16.0, 16.0, 62.5, 20.81298828125, 0.0, 16, 16]}, {"isController": false, "data": ["200 /escm/order/showOrderDetail", 1, 0, 0.0, 2087.0, 2087.0, 2087.0, 2087.0, 0.4791566842357451, 11.20075542045999, 0.0, 2087, 2087]}, {"isController": false, "data": ["204 /escm/recentItem", 1, 0, 0.0, 17.0, 17.0, 17.0, 17.0, 58.8235294117647, 19.588694852941174, 0.0, 17, 17]}, {"isController": false, "data": ["676 /escm/login/doAuth?id=loginform", 1, 0, 0.0, 1683.0, 1683.0, 1683.0, 1683.0, 0.5941770647653001, 5.5651877228163995, 0.0, 1683, 1683]}, {"isController": false, "data": ["193 /escm/order/index", 1, 0, 0.0, 1372.0, 1372.0, 1372.0, 1372.0, 0.7288629737609329, 15.812198205174926, 0.0, 1372, 1372]}, {"isController": false, "data": ["197 /escm/messages", 1, 0, 0.0, 19.0, 19.0, 19.0, 19.0, 52.63157894736842, 23.69449013157895, 0.0, 19, 19]}, {"isController": false, "data": ["203 /escm/messages", 1, 0, 0.0, 71.0, 71.0, 71.0, 71.0, 14.084507042253522, 6.340779049295775, 0.0, 71, 71]}, {"isController": true, "data": ["SP_user_login_46_with_cache", 1, 0, 0.0, 2420.0, 2420.0, 2420.0, 2420.0, 0.4132231404958678, 7.278618930785124, 0.0, 2420, 2420]}, {"isController": false, "data": ["202 /escm/recentItem", 1, 0, 0.0, 14.0, 14.0, 14.0, 14.0, 71.42857142857143, 23.78627232142857, 0.0, 14, 14]}, {"isController": false, "data": ["196 /escm/order/showOrderDetail", 1, 0, 0.0, 1965.0, 1965.0, 1965.0, 1965.0, 0.5089058524173028, 11.121878975826972, 0.0, 1965, 1965]}, {"isController": true, "data": ["Hit_the_portal_with-cache", 1, 0, 0.0, 587.0, 587.0, 587.0, 587.0, 1.7035775127768313, 9.94197189097104, 0.0, 587, 587]}, {"isController": false, "data": ["199 /escm/order/searchOrder", 1, 0, 0.0, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 7.8102653032036615, 0.0, 437, 437]}, {"isController": true, "data": ["List_orders_with_cache", 1, 0, 0.0, 4655.0, 4655.0, 4655.0, 4655.0, 0.21482277121374865, 14.151450053705693, 0.0, 4655, 4655]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 14, 0, 0.0, 736.7142857142858, 2026.0, 2087.0, 2087.0, 6.708193579300431, 56.387476790848105, 0.0, 14, 2087]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 14, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
