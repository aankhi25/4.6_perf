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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "99 /escm/images/favicon.ico"]}, {"isController": false, "data": [0.65, 500, 1500, "385 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": false, "data": [1.0, 500, 1500, "374 /escm/images/favicon.ico"]}, {"isController": false, "data": [1.0, 500, 1500, "406 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "381 /escm/customer/setSearchBy"]}, {"isController": false, "data": [0.3, 500, 1500, "65 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [0.9, 500, 1500, "33 /escm/login/auth"]}, {"isController": true, "data": [0.0, 500, 1500, "Hit_the_portal"]}, {"isController": false, "data": [1.0, 500, 1500, "43 /escm/images/favicon.ico"]}, {"isController": true, "data": [0.0, 500, 1500, "sp_userlogin_46"]}, {"isController": false, "data": [1.0, 500, 1500, "382 /escm/customer/listByCriteria"]}, {"isController": false, "data": [1.0, 500, 1500, "384 /escm/messages"]}, {"isController": false, "data": [0.45, 500, 1500, "324 /escm/customer/index"]}, {"isController": true, "data": [0.0, 500, 1500, "List_Organizations"]}, {"isController": false, "data": [1.0, 500, 1500, "405 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.6866666666666666, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["99 /escm/images/favicon.ico", 10, 0, 0.0, 10.9, 40.30000000000001, 43.0, 43.0, 0.027776543264743787, 0.003390691316497044, 0.0, 4, 43]}, {"isController": false, "data": ["385 /escm/customer/renderCustomerOrganizationDetails", 10, 0, 0.0, 596.2, 820.2, 831.0, 831.0, 0.0277284826974268, 1.0748713441728595, 0.0, 401, 831]}, {"isController": false, "data": ["374 /escm/images/favicon.ico", 10, 0, 0.0, 6.2, 15.100000000000003, 16.0, 16.0, 0.027777237664823182, 0.003390776082131736, 0.0, 3, 16]}, {"isController": false, "data": ["406 /escm/messages", 10, 0, 0.0, 9.999999999999998, 13.8, 14.0, 14.0, 0.027776929038279385, 0.012505043248678512, 0.0, 6, 14]}, {"isController": false, "data": ["381 /escm/customer/setSearchBy", 10, 0, 0.0, 20.799999999999997, 76.10000000000002, 82.0, 82.0, 0.027771452058142312, 0.012394095303292028, 0.0, 7, 82]}, {"isController": false, "data": ["65 /escm/login/doAuth?id=loginform", 10, 0, 0.0, 1618.8000000000002, 2492.3, 2504.0, 2504.0, 0.027665578487246167, 0.25586337354064076, 0.0, 963, 2504]}, {"isController": false, "data": ["33 /escm/login/auth", 10, 0, 0.0, 159.6, 548.6, 550.0, 550.0, 0.02773540424351685, 0.14154806892247954, 0.0, 42, 550]}, {"isController": true, "data": ["Hit_the_portal", 10, 10, 100.0, 566.6, 944.2, 951.0, 951.0, 0.027704591481946303, 18.723596225664977, 0.0, 362, 951]}, {"isController": false, "data": ["43 /escm/images/favicon.ico", 10, 0, 0.0, 13.100000000000001, 19.0, 19.0, 19.0, 0.027776311805765806, 5.190671143397987, 0.0, 7, 19]}, {"isController": true, "data": ["sp_userlogin_46", 10, 0, 0.0, 2414.4, 3284.5, 3290.0, 3290.0, 0.02758689181248638, 12.390943413077842, 0.0, 1687, 3290]}, {"isController": false, "data": ["382 /escm/customer/listByCriteria", 10, 0, 0.0, 300.3, 457.5, 461.0, 461.0, 0.027751799010370847, 0.11328371080405288, 0.0, 200, 461]}, {"isController": false, "data": ["384 /escm/messages", 10, 0, 0.0, 11.799999999999999, 16.0, 16.0, 16.0, 0.027776543264743787, 0.0125048695752411, 0.0, 7, 16]}, {"isController": false, "data": ["324 /escm/customer/index", 10, 0, 0.0, 1053.2, 1983.5, 2016.0, 2016.0, 0.027691932786140742, 0.2804484267174537, 0.0, 493, 2016]}, {"isController": true, "data": ["List_Organizations", 10, 0, 0.0, 3045.3, 4216.5, 4222.0, 4222.0, 0.027537057995797844, 16.814385772152875, 0.0, 1847, 4222]}, {"isController": false, "data": ["405 /escm/messages", 10, 0, 0.0, 10.3, 16.8, 17.0, 17.0, 0.027776929038279385, 0.012505043248678512, 0.0, 7, 17]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 120, 0, 0.0, 317.6000000000001, 1195.0000000000002, 1558.7999999999988, 2479.429999999999, 0.33198694184695404, 7.089045122558513, 0.0, 3, 2504]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 120, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
