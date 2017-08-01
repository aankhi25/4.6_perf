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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "99 /escm/images/favicon.ico"]}, {"isController": false, "data": [0.5375, 500, 1500, "385 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": false, "data": [1.0, 500, 1500, "374 /escm/images/favicon.ico"]}, {"isController": false, "data": [1.0, 500, 1500, "406 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "381 /escm/customer/setSearchBy"]}, {"isController": false, "data": [0.1625, 500, 1500, "65 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [0.975, 500, 1500, "33 /escm/login/auth"]}, {"isController": true, "data": [0.0, 500, 1500, "Hit_the_portal"]}, {"isController": false, "data": [1.0, 500, 1500, "43 /escm/images/favicon.ico"]}, {"isController": true, "data": [0.0, 500, 1500, "sp_userlogin_46"]}, {"isController": false, "data": [0.7875, 500, 1500, "382 /escm/customer/listByCriteria"]}, {"isController": false, "data": [1.0, 500, 1500, "384 /escm/messages"]}, {"isController": false, "data": [0.4625, 500, 1500, "324 /escm/customer/index"]}, {"isController": true, "data": [0.0, 500, 1500, "List_Organizations"]}, {"isController": false, "data": [1.0, 500, 1500, "405 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.6616666666666666, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["99 /escm/images/favicon.ico", 40, 0, 0.0, 16.025, 42.9, 60.349999999999945, 83.0, 0.11108549973200624, 0.013560241666504666, 0.0, 3, 83]}, {"isController": false, "data": ["385 /escm/customer/renderCustomerOrganizationDetails", 40, 0, 0.0, 784.1500000000001, 1204.2999999999997, 1423.0499999999995, 1646.0, 0.11079227556254778, 4.294737055307504, 0.0, 432, 1646]}, {"isController": false, "data": ["374 /escm/images/favicon.ico", 40, 0, 0.0, 23.65, 58.199999999999946, 103.24999999999994, 366.0, 0.1111058644452901, 0.0135627275934192, 0.0, 2, 366]}, {"isController": false, "data": ["406 /escm/messages", 40, 0, 0.0, 20.999999999999996, 48.59999999999998, 86.19999999999993, 115.0, 0.11110370419749795, 0.05001836683110015, 0.0, 6, 115]}, {"isController": false, "data": ["381 /escm/customer/setSearchBy", 40, 0, 0.0, 28.575000000000006, 66.5, 90.04999999999993, 136.0, 0.11109197860368492, 0.0495791349823086, 0.0, 8, 136]}, {"isController": false, "data": ["65 /escm/login/doAuth?id=loginform", 40, 0, 0.0, 1881.8000000000002, 3054.1999999999994, 4198.549999999996, 4459.0, 0.11059805900406448, 1.0229483412019245, 0.0, 1062, 4459]}, {"isController": false, "data": ["33 /escm/login/auth", 40, 0, 0.0, 151.15000000000003, 339.09999999999997, 622.1999999999992, 666.0, 0.11109290421847531, 0.566964372505617, 0.0, 42, 666]}, {"isController": true, "data": ["Hit_the_portal", 40, 40, 100.0, 727.9749999999999, 1030.6, 1542.449999999999, 1609.0, 0.11097393499701758, 74.99952315887306, 0.0, 342, 1609]}, {"isController": false, "data": ["43 /escm/images/favicon.ico", 40, 0, 0.0, 21.800000000000004, 57.29999999999999, 69.0, 70.0, 0.11110895065929273, 20.763376649620703, 0.0, 6, 70]}, {"isController": true, "data": ["sp_userlogin_46", 40, 0, 0.0, 3207.2500000000005, 4697.199999999999, 5096.199999999999, 5378.0, 0.11007699886070306, 49.442333691714225, 0.0, 1918, 5378]}, {"isController": false, "data": ["382 /escm/customer/listByCriteria", 40, 0, 0.0, 519.125, 718.8, 1337.8499999999976, 1402.0, 0.11086966162579272, 0.45257342343341167, 0.0, 206, 1402]}, {"isController": false, "data": ["384 /escm/messages", 40, 0, 0.0, 28.224999999999994, 67.79999999999998, 79.94999999999999, 175.0, 0.11108981889582274, 0.05001211573337332, 0.0, 7, 175]}, {"isController": false, "data": ["324 /escm/customer/index", 40, 0, 0.0, 1153.8, 1474.9999999999998, 3321.099999999992, 3670.0, 0.1107177555296599, 1.1214984212340047, 0.0, 543, 3670]}, {"isController": true, "data": ["List_Organizations", 40, 0, 0.0, 4524.125000000001, 6692.299999999999, 6912.75, 7056.0, 0.1097195020928995, 66.99593339237614, 0.0, 2712, 7056]}, {"isController": false, "data": ["405 /escm/messages", 40, 0, 0.0, 21.974999999999994, 45.39999999999999, 80.44999999999996, 98.0, 0.11110308699927227, 0.05001808897135207, 0.0, 6, 98]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 480, 0, 0.0, 387.60624999999993, 1275.4000000000005, 1645.2999999999997, 3164.5699999999993, 1.3271767080487737, 28.339983077632922, 0.0, 2, 4459]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 480, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
