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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [0.9, 500, 1500, "675 /escm/login/auth"]}, {"isController": true, "data": [0.0, 500, 1500, "List_offers_46_SP_with_cache"]}, {"isController": false, "data": [0.5, 500, 1500, "680 /escm/dashboard/myAccountInfo"]}, {"isController": false, "data": [0.5, 500, 1500, "143 /escm/productOffer/index"]}, {"isController": false, "data": [0.1, 500, 1500, "676 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [0.5, 500, 1500, "144 /escm/productOffer/list"]}, {"isController": true, "data": [0.0, 500, 1500, "SP_user_login_46_with_cache"]}, {"isController": false, "data": [1.0, 500, 1500, "147 /escm/productOffer/getAllService"]}, {"isController": false, "data": [1.0, 500, 1500, "146 /escm/productOffer/offerList"]}, {"isController": false, "data": [1.0, 500, 1500, "149 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "150 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "151 /escm/recentItem"]}, {"isController": true, "data": [0.9, 500, 1500, "Hit_the_portal_with-cache"]}, {"isController": false, "data": [1.0, 500, 1500, "148 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.6714285714285714, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["675 /escm/login/auth", 5, 0, 0.0, 194.8, 559.0, 559.0, 559.0, 8.944543828264758, 52.19979874776386, 0.0, 91, 559]}, {"isController": true, "data": ["List_offers_46_SP_with_cache", 5, 0, 0.0, 2784.6, 3432.0, 3432.0, 3432.0, 1.456876456876457, 52.13597437718531, 0.0, 2050, 3432]}, {"isController": false, "data": ["680 /escm/dashboard/myAccountInfo", 5, 0, 0.0, 1156.0, 1423.0, 1423.0, 1423.0, 3.513703443429374, 28.993543569922696, 0.0, 1021, 1423]}, {"isController": false, "data": ["143 /escm/productOffer/index", 5, 0, 0.0, 1225.8, 1467.0, 1467.0, 1467.0, 3.408316291751875, 41.78582459952283, 0.0, 989, 1467]}, {"isController": false, "data": ["676 /escm/login/doAuth?id=loginform", 5, 0, 0.0, 1620.8, 1850.0, 1850.0, 1850.0, 2.7027027027027026, 25.321473817567565, 0.0, 1434, 1850]}, {"isController": false, "data": ["144 /escm/productOffer/list", 5, 0, 0.0, 1131.0, 1432.0, 1432.0, 1432.0, 3.4916201117318435, 42.253377051326815, 0.0, 822, 1432]}, {"isController": true, "data": ["SP_user_login_46_with_cache", 5, 0, 0.0, 2776.8, 3048.0, 3048.0, 3048.0, 1.6404199475065617, 28.90503250082021, 0.0, 2455, 3048]}, {"isController": false, "data": ["147 /escm/productOffer/getAllService", 5, 0, 0.0, 139.6, 312.0, 312.0, 312.0, 16.025641025641026, 7.652869591346154, 0.0, 34, 312]}, {"isController": false, "data": ["146 /escm/productOffer/offerList", 5, 0, 0.0, 228.0, 319.0, 319.0, 319.0, 15.67398119122257, 147.03541340125392, 0.0, 147, 319]}, {"isController": false, "data": ["149 /escm/recentItem", 5, 0, 0.0, 15.4, 19.0, 19.0, 19.0, 263.1578947368421, 87.63363486842105, 0.0, 13, 19]}, {"isController": false, "data": ["150 /escm/messages", 5, 0, 0.0, 13.6, 15.0, 15.0, 15.0, 333.3333333333333, 150.06510416666669, 0.0, 12, 15]}, {"isController": false, "data": ["151 /escm/recentItem", 5, 0, 0.0, 13.6, 20.0, 20.0, 20.0, 250.0, 83.251953125, 0.0, 10, 20]}, {"isController": true, "data": ["Hit_the_portal_with-cache", 5, 0, 0.0, 194.8, 559.0, 559.0, 559.0, 8.944543828264758, 52.19979874776386, 0.0, 91, 559]}, {"isController": false, "data": ["148 /escm/messages", 5, 0, 0.0, 17.6, 27.0, 27.0, 27.0, 185.18518518518516, 83.36950231481481, 0.0, 13, 27]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 55, 0, 0.0, 523.2909090909089, 1447.2, 1628.3999999999999, 1850.0, 29.72972972972973, 160.11507601351352, 0.0, 10, 1850]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 55, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
