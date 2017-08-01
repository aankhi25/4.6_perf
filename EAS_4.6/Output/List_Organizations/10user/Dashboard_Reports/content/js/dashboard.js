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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "99 /escm/images/favicon.ico"]}, {"isController": false, "data": [0.55, 500, 1500, "385 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": false, "data": [1.0, 500, 1500, "374 /escm/images/favicon.ico"]}, {"isController": false, "data": [1.0, 500, 1500, "406 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "381 /escm/customer/setSearchBy"]}, {"isController": false, "data": [0.1, 500, 1500, "65 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [0.95, 500, 1500, "33 /escm/login/auth"]}, {"isController": true, "data": [0.0, 500, 1500, "Hit_the_portal"]}, {"isController": false, "data": [1.0, 500, 1500, "43 /escm/images/favicon.ico"]}, {"isController": true, "data": [0.0, 500, 1500, "sp_userlogin_46"]}, {"isController": false, "data": [0.75, 500, 1500, "382 /escm/customer/listByCriteria"]}, {"isController": false, "data": [1.0, 500, 1500, "384 /escm/messages"]}, {"isController": false, "data": [0.475, 500, 1500, "324 /escm/customer/index"]}, {"isController": true, "data": [0.0, 500, 1500, "List_Organizations"]}, {"isController": false, "data": [1.0, 500, 1500, "405 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.655, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["99 /escm/images/favicon.ico", 20, 0, 0.0, 14.299999999999999, 28.0, 29.9, 30.0, 0.06666555557407376, 0.008137885201913301, 0.0, 3, 30]}, {"isController": false, "data": ["385 /escm/customer/renderCustomerOrganizationDetails", 20, 0, 0.0, 751.25, 1097.6000000000004, 1288.6999999999998, 1298.0, 0.06649090903046281, 2.5774609999650924, 0.0, 428, 1298]}, {"isController": false, "data": ["374 /escm/images/favicon.ico", 20, 0, 0.0, 10.6, 16.0, 26.449999999999992, 27.0, 0.06666311130073063, 0.008137586828702468, 0.0, 3, 27]}, {"isController": false, "data": ["406 /escm/messages", 20, 0, 0.0, 25.3, 82.3000000000001, 142.09999999999997, 145.0, 0.06664733893837453, 0.030004319580654946, 0.0, 8, 145]}, {"isController": false, "data": ["381 /escm/customer/setSearchBy", 20, 0, 0.0, 27.599999999999998, 101.90000000000015, 114.69999999999999, 115.0, 0.06665933413991128, 0.029749331740175244, 0.0, 11, 115]}, {"isController": false, "data": ["65 /escm/login/doAuth?id=loginform", 20, 0, 0.0, 1834.9499999999998, 2603.0, 2760.9, 2769.0, 0.08238284130181366, 0.7620091012443928, 0.0, 1129, 2769]}, {"isController": false, "data": ["33 /escm/login/auth", 20, 0, 0.0, 152.14999999999998, 550.5000000000005, 669.9499999999999, 675.0, 0.08313450331290995, 0.42427823663405023, 0.0, 49, 675]}, {"isController": true, "data": ["Hit_the_portal", 20, 20, 100.0, 707.0500000000001, 1046.8000000000002, 1081.35, 1083.0, 0.08298135408973603, 56.08129501738459, 0.0, 395, 1083]}, {"isController": false, "data": ["43 /escm/images/favicon.ico", 20, 0, 0.0, 35.0, 116.30000000000008, 120.95, 121.0, 0.08329168748958854, 15.565052760078293, 0.0, 7, 121]}, {"isController": true, "data": ["sp_userlogin_46", 20, 0, 0.0, 3125.5, 3958.5, 4188.05, 4200.0, 0.0819803165260021, 36.82241987448813, 0.0, 1956, 4200]}, {"isController": false, "data": ["382 /escm/customer/listByCriteria", 20, 0, 0.0, 504.6500000000001, 809.7000000000002, 975.5999999999999, 984.0, 0.06654267548135308, 0.271629280773492, 0.0, 280, 984]}, {"isController": false, "data": ["384 /escm/messages", 20, 0, 0.0, 33.10000000000001, 82.60000000000002, 120.09999999999997, 122.0, 0.06665733463981709, 0.030008819598589535, 0.0, 9, 122]}, {"isController": false, "data": ["324 /escm/customer/index", 20, 0, 0.0, 1059.0500000000002, 1348.3000000000002, 1518.6499999999999, 1527.0, 0.06643811953546468, 0.6729811687378751, 0.0, 708, 1527]}, {"isController": true, "data": ["List_Organizations", 20, 0, 0.0, 4234.3, 5776.700000000001, 5874.9, 5879.0, 0.06590089822924286, 40.239834992388445, 0.0, 2495, 5879]}, {"isController": false, "data": ["405 /escm/messages", 20, 0, 0.0, 17.5, 28.900000000000002, 35.64999999999999, 36.0, 0.066660445025131, 0.030010219879477912, 0.0, 8, 36]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 240, 0, 0.0, 372.12083333333345, 1210.3000000000002, 1676.35, 2590.6000000000004, 0.7972574344255761, 17.024352892715726, 0.0, 3, 2769]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 240, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
