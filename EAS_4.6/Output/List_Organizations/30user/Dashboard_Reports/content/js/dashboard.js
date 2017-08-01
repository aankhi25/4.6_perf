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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "99 /escm/images/favicon.ico"]}, {"isController": false, "data": [0.49166666666666664, 500, 1500, "385 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": false, "data": [1.0, 500, 1500, "374 /escm/images/favicon.ico"]}, {"isController": false, "data": [1.0, 500, 1500, "406 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "381 /escm/customer/setSearchBy"]}, {"isController": false, "data": [0.05, 500, 1500, "65 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [0.9583333333333334, 500, 1500, "33 /escm/login/auth"]}, {"isController": true, "data": [0.0, 500, 1500, "Hit_the_portal"]}, {"isController": false, "data": [1.0, 500, 1500, "43 /escm/images/favicon.ico"]}, {"isController": true, "data": [0.0, 500, 1500, "sp_userlogin_46"]}, {"isController": false, "data": [0.75, 500, 1500, "382 /escm/customer/listByCriteria"]}, {"isController": false, "data": [1.0, 500, 1500, "384 /escm/messages"]}, {"isController": false, "data": [0.3416666666666667, 500, 1500, "324 /escm/customer/index"]}, {"isController": true, "data": [0.0, 500, 1500, "List_Organizations"]}, {"isController": false, "data": [1.0, 500, 1500, "405 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.6394444444444445, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["99 /escm/images/favicon.ico", 60, 0, 0.0, 16.866666666666664, 52.19999999999999, 55.949999999999996, 93.0, 0.16662362223092367, 0.0203397976356108, 0.0, 3, 93]}, {"isController": false, "data": ["385 /escm/customer/renderCustomerOrganizationDetails", 60, 0, 0.0, 877.2166666666666, 1274.6, 1931.5999999999983, 3327.0, 0.1651404932746534, 6.4015083390788465, 0.0, 483, 3327]}, {"isController": false, "data": ["374 /escm/images/favicon.ico", 60, 0, 0.0, 11.866666666666664, 22.499999999999993, 61.59999999999988, 74.0, 0.16665416760409638, 0.02034352631885942, 0.0, 2, 74]}, {"isController": false, "data": ["406 /escm/messages", 60, 0, 0.0, 32.6, 86.79999999999998, 99.0, 285.0, 0.16665879666793512, 0.07502900904679502, 0.0, 7, 285]}, {"isController": false, "data": ["381 /escm/customer/setSearchBy", 60, 0, 0.0, 32.716666666666676, 73.29999999999998, 93.49999999999996, 214.0, 0.16662778684973506, 0.07436415877961809, 0.0, 8, 214]}, {"isController": false, "data": ["65 /escm/login/doAuth?id=loginform", 60, 0, 0.0, 2083.45, 2739.4, 2904.9999999999995, 4863.0, 0.1644452849425675, 1.5209101172905994, 0.0, 1044, 4863]}, {"isController": false, "data": ["33 /escm/login/auth", 60, 0, 0.0, 177.28333333333336, 376.19999999999993, 699.5999999999999, 857.0, 0.19943029412644545, 1.01779562217266, 0.0, 40, 857]}, {"isController": true, "data": ["Hit_the_portal", 60, 60, 100.0, 813.4833333333333, 1256.0, 1830.7999999999986, 2290.0, 0.19848489860729765, 134.14206453240266, 0.0, 340, 2290]}, {"isController": false, "data": ["43 /escm/images/favicon.ico", 60, 0, 0.0, 37.73333333333333, 92.29999999999998, 240.54999999999953, 329.0, 0.16655285554870838, 31.124402231391883, 0.0, 5, 329]}, {"isController": true, "data": ["sp_userlogin_46", 60, 0, 0.0, 3523.4166666666665, 4590.8, 5195.849999999999, 5846.0, 0.1640034331385337, 73.6639197657621, 0.0, 1709, 5846]}, {"isController": false, "data": ["382 /escm/customer/listByCriteria", 60, 0, 0.0, 586.7666666666667, 866.3999999999999, 1452.199999999998, 3465.0, 0.1650777929099088, 0.6738527093392762, 0.0, 188, 3465]}, {"isController": false, "data": ["384 /escm/messages", 60, 0, 0.0, 32.28333333333333, 68.9, 123.64999999999989, 177.0, 0.16660881638320027, 0.07500650815688997, 0.0, 8, 177]}, {"isController": false, "data": ["324 /escm/customer/index", 60, 0, 0.0, 1317.683333333333, 1812.3, 1956.8499999999997, 2085.0, 0.16579302950839603, 1.6794126894185362, 0.0, 700, 2085]}, {"isController": true, "data": ["List_Organizations", 60, 0, 0.0, 5114.966666666667, 6934.8, 8886.499999999996, 9441.0, 0.16358847682769226, 99.88898242684868, 0.0, 2153, 9441]}, {"isController": false, "data": ["405 /escm/messages", 60, 0, 0.0, 25.583333333333336, 66.19999999999997, 120.04999999999993, 200.0, 0.16665370471185575, 0.07502671667203661, 0.0, 7, 200]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 720, 0, 0.0, 436.0041666666669, 1598.7999999999997, 2044.0999999999988, 2763.119999999999, 1.97334341931081, 42.13793730454993, 0.0, 2, 4863]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 720, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
