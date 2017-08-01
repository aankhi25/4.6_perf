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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "99 /escm/images/favicon.ico"]}, {"isController": true, "data": [0.0, 500, 1500, "order_search_by_offername"]}, {"isController": false, "data": [1.0, 500, 1500, "115 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "116 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "113 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "111 /escm/recentItem"]}, {"isController": false, "data": [0.5, 500, 1500, "65 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "109 /escm/messages"]}, {"isController": false, "data": [0.5, 500, 1500, "108 /escm/order/showOrderDetail"]}, {"isController": false, "data": [0.5, 500, 1500, "106 /escm/order/showOrderDetail"]}, {"isController": false, "data": [0.5, 500, 1500, "33 /escm/login/auth"]}, {"isController": true, "data": [0.0, 500, 1500, "Hit_the_portal"]}, {"isController": false, "data": [1.0, 500, 1500, "43 /escm/images/favicon.ico"]}, {"isController": false, "data": [0.0, 500, 1500, "12 /escm/order/showOrderDetail"]}, {"isController": false, "data": [1.0, 500, 1500, "104 /escm/order/searchOrder"]}, {"isController": false, "data": [1.0, 500, 1500, "105 /escm/order/searchOrder"]}, {"isController": true, "data": [0.0, 500, 1500, "sp_userlogin_46"]}, {"isController": false, "data": [1.0, 500, 1500, "23 /escm/recentItem"]}, {"isController": true, "data": [0.0, 500, 1500, "List_Orders"]}, {"isController": false, "data": [1.0, 500, 1500, "107 /escm/messages"]}, {"isController": false, "data": [0.5, 500, 1500, "1 /escm/order/index"]}, {"isController": false, "data": [1.0, 500, 1500, "110 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "114 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "22 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.6875, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["99 /escm/images/favicon.ico", 1, 0, 0.0, 5.0, 5.0, 5.0, 5.0, 200.0, 24.4140625, 0.0, 5, 5]}, {"isController": true, "data": ["order_search_by_offername", 1, 0, 0.0, 2665.0, 2665.0, 2665.0, 2665.0, 0.37523452157598497, 25.753034122889307, 0.0, 2665, 2665]}, {"isController": false, "data": ["115 /escm/recentItem", 1, 0, 0.0, 8.0, 8.0, 8.0, 8.0, 125.0, 41.6259765625, 0.0, 8, 8]}, {"isController": false, "data": ["116 /escm/recentItem", 1, 0, 0.0, 8.0, 8.0, 8.0, 8.0, 125.0, 41.6259765625, 0.0, 8, 8]}, {"isController": false, "data": ["113 /escm/messages", 1, 0, 0.0, 8.0, 8.0, 8.0, 8.0, 125.0, 56.2744140625, 0.0, 8, 8]}, {"isController": false, "data": ["111 /escm/recentItem", 1, 0, 0.0, 7.0, 7.0, 7.0, 7.0, 142.85714285714286, 47.57254464285714, 0.0, 7, 7]}, {"isController": false, "data": ["65 /escm/login/doAuth?id=loginform", 1, 0, 0.0, 1112.0, 1112.0, 1112.0, 1112.0, 0.8992805755395684, 8.325370953237409, 0.0, 1112, 1112]}, {"isController": false, "data": ["109 /escm/messages", 1, 0, 0.0, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 50.02170138888889, 0.0, 9, 9]}, {"isController": false, "data": ["108 /escm/order/showOrderDetail", 1, 0, 0.0, 1100.0, 1100.0, 1100.0, 1100.0, 0.9090909090909091, 19.465553977272727, 0.0, 1100, 1100]}, {"isController": false, "data": ["106 /escm/order/showOrderDetail", 1, 0, 0.0, 1105.0, 1105.0, 1105.0, 1105.0, 0.9049773755656109, 19.376590780542987, 0.0, 1105, 1105]}, {"isController": false, "data": ["33 /escm/login/auth", 1, 0, 0.0, 564.0, 564.0, 564.0, 564.0, 1.7730496453900708, 9.048786569148938, 0.0, 564, 564]}, {"isController": true, "data": ["Hit_the_portal", 1, 1, 100.0, 894.0, 894.0, 894.0, 894.0, 1.1185682326621924, 755.9620560682326, 0.0, 894, 894]}, {"isController": false, "data": ["43 /escm/images/favicon.ico", 1, 0, 0.0, 10.0, 10.0, 10.0, 10.0, 100.0, 18687.40234375, 0.0, 10, 10]}, {"isController": false, "data": ["12 /escm/order/showOrderDetail", 1, 1, 100.0, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 13.409358198924732, 0.0, 93, 93]}, {"isController": false, "data": ["104 /escm/order/searchOrder", 1, 0, 0.0, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 18.35278217299578, 0.0, 237, 237]}, {"isController": false, "data": ["105 /escm/order/searchOrder", 1, 0, 0.0, 139.0, 139.0, 139.0, 139.0, 7.194244604316547, 31.292153776978413, 0.0, 139, 139]}, {"isController": true, "data": ["sp_userlogin_46", 1, 0, 0.0, 1727.0, 1727.0, 1727.0, 1727.0, 0.5790387955993052, 260.086810581934, 0.0, 1727, 1727]}, {"isController": false, "data": ["23 /escm/recentItem", 1, 0, 0.0, 13.0, 13.0, 13.0, 13.0, 76.92307692307693, 25.615985576923077, 0.0, 13, 13]}, {"isController": true, "data": ["List_Orders", 1, 1, 100.0, 1329.0, 1329.0, 1329.0, 1329.0, 0.7524454477050414, 109.67259805304741, 0.0, 1329, 1329]}, {"isController": false, "data": ["107 /escm/messages", 1, 0, 0.0, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 50.02170138888889, 0.0, 9, 9]}, {"isController": false, "data": ["1 /escm/order/index", 1, 0, 0.0, 1030.0, 1030.0, 1030.0, 1030.0, 0.970873786407767, 18.24370449029126, 0.0, 1030, 1030]}, {"isController": false, "data": ["110 /escm/recentItem", 1, 0, 0.0, 8.0, 8.0, 8.0, 8.0, 125.0, 41.6259765625, 0.0, 8, 8]}, {"isController": false, "data": ["114 /escm/messages", 1, 0, 0.0, 8.0, 8.0, 8.0, 8.0, 125.0, 56.2744140625, 0.0, 8, 8]}, {"isController": false, "data": ["22 /escm/messages", 1, 0, 0.0, 11.0, 11.0, 11.0, 11.0, 90.9090909090909, 40.92684659090909, 0.0, 11, 11]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 20, 1, 5.0, 274.2, 1104.5, 1111.65, 1112.0, 17.985611510791365, 248.95142479766184, 0.0, 5, 1112]}}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "items": [{"isController": false, "data": ["404/Not Found", 1, 100.0, 5.0]}], "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);
    
        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": ["12 /escm/order/showOrderDetail", 1, 1, "404/Not Found", 1, null, null, null, null, null, null, null, null]}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 20, 1, "404/Not Found", 1, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
