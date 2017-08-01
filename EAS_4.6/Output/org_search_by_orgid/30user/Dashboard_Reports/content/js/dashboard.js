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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "99 /escm/images/favicon.ico"]}, {"isController": false, "data": [0.5166666666666667, 500, 1500, "385 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": false, "data": [1.0, 500, 1500, "130 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "131 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "374 /escm/images/favicon.ico"]}, {"isController": false, "data": [1.0, 500, 1500, "406 /escm/messages"]}, {"isController": false, "data": [0.65, 500, 1500, "128 /escm/customer/listByCriteria"]}, {"isController": false, "data": [1.0, 500, 1500, "381 /escm/customer/setSearchBy"]}, {"isController": false, "data": [0.05, 500, 1500, "65 /escm/login/doAuth?id=loginform"]}, {"isController": true, "data": [0.0, 500, 1500, "org_search_by_orgid"]}, {"isController": false, "data": [0.9833333333333333, 500, 1500, "33 /escm/login/auth"]}, {"isController": true, "data": [0.0, 500, 1500, "Hit_the_portal"]}, {"isController": false, "data": [1.0, 500, 1500, "43 /escm/images/favicon.ico"]}, {"isController": true, "data": [0.0, 500, 1500, "sp_userlogin_46"]}, {"isController": false, "data": [0.1, 500, 1500, "129 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": false, "data": [0.6833333333333333, 500, 1500, "382 /escm/customer/listByCriteria"]}, {"isController": false, "data": [1.0, 500, 1500, "384 /escm/messages"]}, {"isController": false, "data": [0.25, 500, 1500, "324 /escm/customer/index"]}, {"isController": true, "data": [0.0, 500, 1500, "List_Organizations"]}, {"isController": false, "data": [1.0, 500, 1500, "405 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.6116666666666667, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["99 /escm/images/favicon.ico", 30, 0, 0.0, 11.733333333333336, 42.30000000000004, 50.94999999999999, 57.0, 0.4995254508217194, 0.06097722788351066, 0.0, 3, 57]}, {"isController": false, "data": ["385 /escm/customer/renderCustomerOrganizationDetails", 30, 0, 0.0, 954.5666666666667, 2143.8, 2794.999999999999, 3433.0, 0.47293995239071146, 18.332935316593886, 0.0, 324, 3433]}, {"isController": false, "data": ["130 /escm/messages", 30, 0, 0.0, 24.83333333333333, 69.50000000000003, 117.34999999999992, 174.0, 172.41379310344828, 77.61988146551725, 0.0, 6, 174]}, {"isController": false, "data": ["131 /escm/messages", 30, 0, 0.0, 20.033333333333335, 49.0, 62.349999999999994, 64.0, 468.75, 211.029052734375, 0.0, 5, 64]}, {"isController": false, "data": ["374 /escm/images/favicon.ico", 30, 0, 0.0, 6.633333333333335, 16.800000000000004, 20.249999999999996, 23.0, 0.499808406777402, 0.061011768405444575, 0.0, 2, 23]}, {"isController": false, "data": ["406 /escm/messages", 30, 0, 0.0, 13.666666666666666, 38.500000000000014, 39.9, 41.0, 0.4996585666461251, 0.2249439445545544, 0.0, 5, 41]}, {"isController": false, "data": ["128 /escm/customer/listByCriteria", 30, 0, 0.0, 739.4999999999999, 1338.1000000000004, 1605.5, 1655.0, 0.4865785418863028, 1.58470648163166, 0.0, 394, 1655]}, {"isController": false, "data": ["381 /escm/customer/setSearchBy", 30, 0, 0.0, 14.166666666666668, 22.60000000000001, 54.59999999999995, 92.0, 0.49923450708913, 0.22280290013645743, 0.0, 7, 92]}, {"isController": false, "data": ["65 /escm/login/doAuth?id=loginform", 30, 0, 0.0, 2444.2000000000003, 4254.700000000002, 5650.999999999999, 6102.0, 0.4538440591812653, 4.2284172330262315, 0.0, 1257, 6102]}, {"isController": true, "data": ["org_search_by_orgid", 30, 0, 0.0, 3269.7, 7150.600000000001, 7780.099999999999, 7889.0, 0.44189780376791526, 65.23556605267422, 0.0, 1697, 7889]}, {"isController": false, "data": ["33 /escm/login/auth", 30, 0, 0.0, 129.93333333333334, 344.9000000000002, 577.5499999999998, 709.0, 0.496113775425831, 2.5319244046634695, 0.0, 32, 709]}, {"isController": true, "data": ["Hit_the_portal", 30, 30, 100.0, 540.2666666666665, 948.8000000000002, 1052.1499999999999, 1133.0, 0.4919161774833568, 332.45174865952845, 0.0, 276, 1133]}, {"isController": false, "data": ["43 /escm/images/favicon.ico", 30, 0, 0.0, 14.766666666666664, 42.0, 51.599999999999994, 56.0, 0.4995337684827495, 93.34988515926803, 0.0, 4, 56]}, {"isController": true, "data": ["sp_userlogin_46", 30, 0, 0.0, 3346.6000000000004, 5206.9000000000015, 6837.45, 7267.0, 0.44598391484680455, 200.34890982483984, 0.0, 1805, 7267]}, {"isController": false, "data": ["129 /escm/customer/renderCustomerOrganizationDetails", 30, 0, 0.0, 2472.5333333333338, 5944.3, 6141.25, 6298.0, 4.7634169577643695, 682.828998293109, 0.0, 1278, 6298]}, {"isController": false, "data": ["382 /escm/customer/listByCriteria", 30, 0, 0.0, 834.3666666666668, 2682.3, 3292.9499999999994, 3684.0, 0.47107593744111553, 1.9229466977576786, 0.0, 174, 3684]}, {"isController": false, "data": ["384 /escm/messages", 30, 0, 0.0, 17.93333333333333, 40.900000000000006, 64.49999999999997, 81.0, 0.49932591002147103, 0.224794184101463, 0.0, 6, 81]}, {"isController": false, "data": ["324 /escm/customer/index", 30, 0, 0.0, 1575.366666666667, 2271.1, 2359.7, 2462.0, 0.4802920175466684, 4.86511423945759, 0.0, 834, 2462]}, {"isController": true, "data": ["List_Organizations", 30, 0, 0.0, 4651.666666666666, 8237.1, 8592.2, 8645.0, 0.4370311020467623, 266.85601361625027, 0.0, 2435, 8645]}, {"isController": false, "data": ["405 /escm/messages", 30, 0, 0.0, 23.399999999999995, 31.00000000000002, 191.89999999999975, 380.0, 0.49685326266975827, 0.22368100985425637, 0.0, 6, 380]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 480, 0, 0.0, 581.1020833333329, 1935.5000000000002, 2461.2, 5839.929999999999, 7.240037406859935, 182.7279268416845, 0.0, 2, 6298]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 480, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
