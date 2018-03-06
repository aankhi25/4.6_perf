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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": true, "data": [0.0, 500, 1500, "Login Page Request"]}, {"isController": true, "data": [0.0, 500, 1500, "Order Selection"]}, {"isController": false, "data": [1.0, 500, 1500, "117 /escm/messages"]}, {"isController": false, "data": [0.5, 500, 1500, "88 /escm/order/showOrderDetail"]}, {"isController": false, "data": [1.0, 500, 1500, "109 /escm/order/searchOrder"]}, {"isController": true, "data": [0.0, 500, 1500, "Login Page Credentials and Dashboard Display"]}, {"isController": false, "data": [1.0, 500, 1500, "98 /escm/messages"]}, {"isController": false, "data": [0.5, 500, 1500, "77 /escm/order/index"]}, {"isController": true, "data": [0.1, 500, 1500, "Order_Search"]}, {"isController": false, "data": [1.0, 500, 1500, "112 /escm/recentItem"]}, {"isController": false, "data": [0.4, 500, 1500, "5 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "111 /escm/messages"]}, {"isController": false, "data": [0.9, 500, 1500, "62 /escm/login/auth"]}, {"isController": false, "data": [1.0, 500, 1500, "118 /escm/recentItem"]}, {"isController": false, "data": [0.2, 500, 1500, "110 /escm/order/showOrderDetail"]}, {"isController": false, "data": [1.0, 500, 1500, "99 /escm/recentItem"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.6, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": true, "data": ["Login Page Request", 5, 5, 100.0, 488.2, 851.0, 851.0, 851.0, 5.875440658049354, 2872.832283710341, 0.0, 344, 851]}, {"isController": true, "data": ["Order Selection", 5, 0, 0.0, 2351.2, 2480.0, 2480.0, 2480.0, 2.0161290322580645, 331.8512947328629, 0.0, 2143, 2480]}, {"isController": false, "data": ["117 /escm/messages", 5, 0, 0.0, 25.0, 61.0, 61.0, 61.0, 81.96721311475409, 36.90125512295082, 0.0, 14, 61]}, {"isController": false, "data": ["88 /escm/order/showOrderDetail", 5, 0, 0.0, 731.6, 805.0, 805.0, 805.0, 6.211180124223602, 124.95632763975155, 0.0, 648, 805]}, {"isController": false, "data": ["109 /escm/order/searchOrder", 5, 0, 0.0, 414.0, 449.0, 449.0, 449.0, 11.135857461024498, 40.565405762806236, 0.0, 378, 449]}, {"isController": true, "data": ["Login Page Credentials and Dashboard Display", 5, 0, 0.0, 2033.0, 2222.0, 2222.0, 2222.0, 2.25022502250225, 720.6103911172368, 0.0, 1738, 2222]}, {"isController": false, "data": ["98 /escm/messages", 5, 0, 0.0, 17.6, 23.0, 23.0, 23.0, 217.3913043478261, 97.86854619565217, 0.0, 13, 23]}, {"isController": false, "data": ["77 /escm/order/index", 5, 0, 0.0, 1309.6, 1390.0, 1390.0, 1390.0, 3.5971223021582737, 67.49452000899281, 0.0, 1224, 1390]}, {"isController": true, "data": ["Order_Search", 5, 0, 0.0, 2274.4, 3246.0, 3246.0, 3246.0, 1.5403573629081946, 110.96710374306839, 0.0, 1476, 3246]}, {"isController": false, "data": ["112 /escm/recentItem", 5, 0, 0.0, 17.4, 22.0, 22.0, 22.0, 227.27272727272725, 75.68359375, 0.0, 10, 22]}, {"isController": false, "data": ["5 /escm/login/doAuth?id=loginform", 5, 0, 0.0, 1308.2, 1511.0, 1511.0, 1511.0, 3.309066843150232, 32.382967612508274, 0.0, 1082, 1511]}, {"isController": false, "data": ["111 /escm/messages", 5, 0, 0.0, 16.8, 23.0, 23.0, 23.0, 217.3913043478261, 97.86854619565217, 0.0, 13, 23]}, {"isController": false, "data": ["62 /escm/login/auth", 5, 0, 0.0, 200.0, 530.0, 530.0, 530.0, 9.433962264150942, 48.14637382075472, 0.0, 59, 530]}, {"isController": false, "data": ["118 /escm/recentItem", 5, 0, 0.0, 13.0, 16.0, 16.0, 16.0, 312.5, 104.06494140625, 0.0, 11, 16]}, {"isController": false, "data": ["110 /escm/order/showOrderDetail", 5, 0, 0.0, 1677.2, 2685.0, 2685.0, 2685.0, 1.86219739292365, 40.55844099162011, 0.0, 974, 2685]}, {"isController": false, "data": ["99 /escm/recentItem", 5, 0, 0.0, 36.6, 95.0, 95.0, 95.0, 52.63157894736842, 17.52672697368421, 0.0, 14, 95]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 60, 0, 0.0, 480.58333333333337, 1386.7, 1611.6999999999996, 2685.0, 22.3463687150838, 151.84983123836128, 0.0, 10, 2685]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": true, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 60, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
