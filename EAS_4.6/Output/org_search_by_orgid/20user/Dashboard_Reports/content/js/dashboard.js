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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "99 /escm/images/favicon.ico"]}, {"isController": false, "data": [0.7, 500, 1500, "385 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": false, "data": [1.0, 500, 1500, "130 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "131 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "374 /escm/images/favicon.ico"]}, {"isController": false, "data": [1.0, 500, 1500, "406 /escm/messages"]}, {"isController": false, "data": [0.925, 500, 1500, "128 /escm/customer/listByCriteria"]}, {"isController": false, "data": [1.0, 500, 1500, "381 /escm/customer/setSearchBy"]}, {"isController": false, "data": [0.325, 500, 1500, "65 /escm/login/doAuth?id=loginform"]}, {"isController": true, "data": [0.0, 500, 1500, "org_search_by_orgid"]}, {"isController": false, "data": [0.975, 500, 1500, "33 /escm/login/auth"]}, {"isController": true, "data": [0.0, 500, 1500, "Hit_the_portal"]}, {"isController": false, "data": [1.0, 500, 1500, "43 /escm/images/favicon.ico"]}, {"isController": true, "data": [0.05, 500, 1500, "sp_userlogin_46"]}, {"isController": false, "data": [0.15, 500, 1500, "129 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": false, "data": [0.925, 500, 1500, "382 /escm/customer/listByCriteria"]}, {"isController": false, "data": [1.0, 500, 1500, "384 /escm/messages"]}, {"isController": false, "data": [0.525, 500, 1500, "324 /escm/customer/index"]}, {"isController": true, "data": [0.0, 500, 1500, "List_Organizations"]}, {"isController": false, "data": [1.0, 500, 1500, "405 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.67875, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["99 /escm/images/favicon.ico", 20, 0, 0.0, 7.749999999999999, 15.800000000000004, 24.549999999999994, 25.0, 800.0, 97.65625, 0.0, 2, 25]}, {"isController": false, "data": ["385 /escm/customer/renderCustomerOrganizationDetails", 20, 0, 0.0, 576.1499999999999, 892.7000000000005, 1221.7499999999998, 1238.0, 16.15508885298869, 626.2337186995154, 0.0, 336, 1238]}, {"isController": false, "data": ["130 /escm/messages", 20, 0, 0.0, 19.1, 39.20000000000002, 99.84999999999995, 103.0, 194.17475728155338, 87.41656553398059, 0.0, 6, 103]}, {"isController": false, "data": ["131 /escm/messages", 20, 0, 0.0, 12.5, 29.900000000000023, 45.249999999999986, 46.0, 434.7826086956522, 195.73709239130434, 0.0, 6, 46]}, {"isController": false, "data": ["374 /escm/images/favicon.ico", 20, 0, 0.0, 6.750000000000001, 14.400000000000013, 39.69999999999998, 41.0, 487.8048780487805, 59.546493902439025, 0.0, 2, 41]}, {"isController": false, "data": ["406 /escm/messages", 20, 0, 0.0, 11.200000000000001, 19.800000000000004, 21.9, 22.0, 909.090909090909, 409.26846590909093, 0.0, 6, 22]}, {"isController": false, "data": ["128 /escm/customer/listByCriteria", 20, 0, 0.0, 459.45, 578.3000000000002, 590.65, 591.0, 33.840947546531304, 110.2144141285956, 0.0, 404, 591]}, {"isController": false, "data": ["381 /escm/customer/setSearchBy", 20, 0, 0.0, 18.25, 39.30000000000004, 57.14999999999999, 58.0, 344.82758620689657, 153.89278017241378, 0.0, 8, 58]}, {"isController": false, "data": ["65 /escm/login/doAuth?id=loginform", 20, 0, 0.0, 1364.9999999999998, 1891.9000000000005, 2319.8499999999995, 2341.0, 8.54335753951303, 79.95214384878257, 0.0, 779, 2341]}, {"isController": true, "data": ["org_search_by_orgid", 20, 0, 0.0, 2213.55, 2867.7000000000003, 2965.2999999999997, 2970.0, 6.7340067340067336, 994.1202388468013, 0.0, 1667, 2970]}, {"isController": false, "data": ["33 /escm/login/auth", 20, 0, 0.0, 128.79999999999998, 420.60000000000036, 624.1999999999998, 634.0, 31.545741324921135, 160.99418375394322, 0.0, 29, 634]}, {"isController": true, "data": ["Hit_the_portal", 20, 20, 100.0, 517.3499999999999, 902.4, 1263.0499999999997, 1282.0, 0.3263601057406743, 220.56397575960315, 0.0, 286, 1282]}, {"isController": false, "data": ["43 /escm/images/favicon.ico", 20, 0, 0.0, 14.599999999999998, 27.900000000000002, 76.44999999999996, 79.0, 253.16455696202533, 47309.87935126582, 0.0, 5, 79]}, {"isController": true, "data": ["sp_userlogin_46", 20, 0, 0.0, 2218.95, 3092.3000000000006, 3469.6499999999996, 3488.0, 5.73394495412844, 2576.0923613102063, 0.0, 1347, 3488]}, {"isController": false, "data": ["129 /escm/customer/renderCustomerOrganizationDetails", 20, 0, 0.0, 1715.8, 2388.5000000000005, 2431.35, 2433.0, 8.220304151253595, 1178.3765862618168, 0.0, 1221, 2433]}, {"isController": false, "data": ["382 /escm/customer/listByCriteria", 20, 0, 0.0, 352.94999999999993, 539.9000000000001, 563.9, 565.0, 35.39823008849557, 144.49668141592923, 0.0, 172, 565]}, {"isController": false, "data": ["384 /escm/messages", 20, 0, 0.0, 11.549999999999999, 17.900000000000002, 21.799999999999997, 22.0, 909.090909090909, 409.26846590909093, 0.0, 7, 22]}, {"isController": false, "data": ["324 /escm/customer/index", 20, 0, 0.0, 899.4000000000001, 1388.9000000000003, 1472.6, 1476.0, 13.550135501355014, 137.26128472222223, 0.0, 463, 1476]}, {"isController": true, "data": ["List_Organizations", 20, 0, 0.0, 3053.4, 3912.6, 3960.55, 3963.0, 5.046681806712087, 3081.562066300782, 0.0, 2115, 3963]}, {"isController": false, "data": ["405 /escm/messages", 20, 0, 0.0, 11.1, 15.800000000000004, 42.59999999999998, 44.0, 454.5454545454545, 204.63423295454547, 0.0, 5, 44]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 320, 0, 0.0, 350.6468749999999, 1273.7000000000007, 1630.4499999999996, 2329.240000000001, 131.52486642005752, 3319.8476995992605, 0.0, 2, 2433]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 320, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
