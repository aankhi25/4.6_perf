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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [0.5, 500, 1500, "158 /escm/login/doAuth?id=loginform"]}, {"isController": true, "data": [0.5, 500, 1500, "New_hit_the_portal_4.6"]}, {"isController": false, "data": [1.0, 500, 1500, "70 /escm/recentItem"]}, {"isController": true, "data": [0.0, 500, 1500, "new_List_Orders"]}, {"isController": false, "data": [0.0, 500, 1500, "59 /escm/order/showOrderDetail"]}, {"isController": true, "data": [0.0, 500, 1500, "new_SP_user_login_4.6"]}, {"isController": false, "data": [1.0, 500, 1500, "56 /escm/images/sidebar-bg.jpg"]}, {"isController": false, "data": [1.0, 500, 1500, "51 /escm/images/favicon.ico"]}, {"isController": false, "data": [0.5, 500, 1500, "88 /escm/login/auth"]}, {"isController": false, "data": [1.0, 500, 1500, "184 /escm/images/favicon.ico"]}, {"isController": false, "data": [0.5, 500, 1500, "1 /escm/order/index"]}, {"isController": false, "data": [1.0, 500, 1500, "69 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "93 /escm/images/favicon.ico"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.6153846153846154, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["158 /escm/login/doAuth?id=loginform", 1, 0, 0.0, 1156.0, 1156.0, 1156.0, 1156.0, 0.8650519031141869, 8.121688473183392, 2.6804782115051906, 1156, 1156]}, {"isController": true, "data": ["New_hit_the_portal_4.6", 1, 0, 0.0, 1038.0, 1038.0, 1038.0, 1038.0, 0.9633911368015414, 736.300841461946, 6.604497832369942, 1038, 1038]}, {"isController": false, "data": ["70 /escm/recentItem", 1, 0, 0.0, 13.0, 13.0, 13.0, 13.0, 76.92307692307693, 25.615985576923077, 43.34435096153847, 13, 13]}, {"isController": true, "data": ["new_List_Orders", 1, 0, 0.0, 3798.0, 3798.0, 3798.0, 3798.0, 0.2632964718272775, 191.4728454943391, 11.439768875065823, 3798, 3798]}, {"isController": false, "data": ["59 /escm/order/showOrderDetail", 1, 0, 0.0, 1521.0, 1521.0, 1521.0, 1521.0, 0.6574621959237344, 14.373638847797503, 0.39999897271531887, 1521, 1521]}, {"isController": true, "data": ["new_SP_user_login_4.6", 1, 0, 0.0, 2102.0, 2102.0, 2102.0, 2102.0, 0.4757373929590866, 282.1582681672217, 17.937715568506185, 2102, 2102]}, {"isController": false, "data": ["56 /escm/images/sidebar-bg.jpg", 1, 0, 0.0, 8.0, 8.0, 8.0, 8.0, 125.0, 207.8857421875, 68.359375, 8, 8]}, {"isController": false, "data": ["51 /escm/images/favicon.ico", 1, 0, 0.0, 4.0, 4.0, 4.0, 4.0, 250.0, 30.517578125, 147.216796875, 4, 4]}, {"isController": false, "data": ["88 /escm/login/auth", 1, 0, 0.0, 613.0, 613.0, 613.0, 613.0, 1.6313213703099512, 9.52028955954323, 0.587849204730832, 613, 613]}, {"isController": false, "data": ["184 /escm/images/favicon.ico", 1, 0, 0.0, 5.0, 5.0, 5.0, 5.0, 200.0, 24.4140625, 127.5390625, 5, 5]}, {"isController": false, "data": ["1 /escm/order/index", 1, 0, 0.0, 1125.0, 1125.0, 1125.0, 1125.0, 0.888888888888889, 19.247395833333332, 1.0703125, 1125, 1125]}, {"isController": false, "data": ["69 /escm/messages", 1, 0, 0.0, 12.0, 12.0, 12.0, 12.0, 83.33333333333333, 37.516276041666664, 46.793619791666664, 12, 12]}, {"isController": false, "data": ["93 /escm/images/favicon.ico", 1, 0, 0.0, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 20763.780381944445, 46.657986111111114, 9, 9]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 10, 0, 0.0, 446.6, 1484.5, 1521.0, 1521.0, 6.574621959237344, 163.25094510190664, 5.6474975345167655, 4, 1521]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 10, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
