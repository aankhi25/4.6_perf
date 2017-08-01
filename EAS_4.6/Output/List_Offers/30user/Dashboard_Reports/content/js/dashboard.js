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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "72 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "99 /escm/images/favicon.ico"]}, {"isController": false, "data": [1.0, 500, 1500, "60 /escm/productOffer/offerList"]}, {"isController": false, "data": [1.0, 500, 1500, "59 /escm/productOffer/offerList"]}, {"isController": false, "data": [1.0, 500, 1500, "62 /escm/messages"]}, {"isController": true, "data": [0.0, 500, 1500, "List_offers"]}, {"isController": false, "data": [0.0, 500, 1500, "49 /escm/productOffer/index"]}, {"isController": false, "data": [0.0, 500, 1500, "65 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "66 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "65 /escm/recentItem"]}, {"isController": false, "data": [0.9833333333333333, 500, 1500, "33 /escm/login/auth"]}, {"isController": false, "data": [1.0, 500, 1500, "61 /escm/productOffer/getAllService"]}, {"isController": true, "data": [0.0, 500, 1500, "Hit_the_portal"]}, {"isController": false, "data": [1.0, 500, 1500, "43 /escm/images/favicon.ico"]}, {"isController": true, "data": [0.0, 500, 1500, "sp_userlogin_46"]}, {"isController": false, "data": [1.0, 500, 1500, "63 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "67 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.7049019607843138, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["72 /escm/recentItem", 30, 0, 0.0, 9.699999999999998, 13.0, 23.649999999999988, 33.0, 0.49972515116685823, 0.16641237944130727, 0.0, 6, 33]}, {"isController": false, "data": ["99 /escm/images/favicon.ico", 30, 0, 0.0, 5.7, 9.0, 15.74999999999999, 24.0, 0.49992501124831273, 0.06102600234964755, 0.0, 3, 24]}, {"isController": false, "data": ["60 /escm/productOffer/offerList", 30, 0, 0.0, 190.23333333333332, 249.8, 300.84999999999997, 341.0, 0.4984299456711359, 3.669106377411155, 0.0, 115, 341]}, {"isController": false, "data": ["59 /escm/productOffer/offerList", 30, 0, 0.0, 45.0, 63.500000000000014, 141.45, 142.0, 0.4996668887408395, 2.7413365048301133, 0.0, 28, 142]}, {"isController": false, "data": ["62 /escm/messages", 30, 0, 0.0, 20.9, 94.90000000000018, 112.05, 117.0, 0.4998833605492052, 0.2250451457159996, 0.0, 7, 117]}, {"isController": true, "data": ["List_offers", 30, 0, 0.0, 18441.966666666664, 41220.3, 43560.149999999994, 45291.0, 0.29370300751879697, 30.743735177176337, 0.0, 3046, 45291]}, {"isController": false, "data": ["49 /escm/productOffer/index", 30, 0, 0.0, 17954.53333333333, 40864.200000000004, 43178.649999999994, 44783.0, 0.29450454518681407, 3.4763903222125143, 0.0, 2527, 44783]}, {"isController": false, "data": ["65 /escm/login/doAuth?id=loginform", 30, 0, 0.0, 15486.5, 38548.200000000004, 41708.149999999994, 44407.0, 0.6755691670232171, 5.7180156703898035, 0.0, 2899, 44407]}, {"isController": false, "data": ["66 /escm/recentItem", 30, 0, 0.0, 10.433333333333332, 15.900000000000002, 20.349999999999998, 22.0, 0.4998167338642498, 0.16644287719502848, 0.0, 5, 22]}, {"isController": false, "data": ["65 /escm/recentItem", 30, 0, 0.0, 11.633333333333333, 23.200000000000017, 29.84999999999999, 37.0, 0.4998000799680128, 0.16643733131747301, 0.0, 5, 37]}, {"isController": false, "data": ["33 /escm/login/auth", 30, 0, 0.0, 97.53333333333332, 252.20000000000002, 426.09999999999974, 634.0, 47.3186119873817, 241.49127563091483, 0.0, 34, 634]}, {"isController": false, "data": ["61 /escm/productOffer/getAllService", 30, 0, 0.0, 98.03333333333332, 208.3, 215.15, 219.0, 0.4982643790795396, 0.23794070446278795, 0.0, 11, 219]}, {"isController": true, "data": ["Hit_the_portal", 30, 30, 100.0, 436.6000000000001, 661.8000000000002, 837.9499999999998, 965.0, 31.088082901554404, 21010.26149611399, 0.0, 286, 965]}, {"isController": false, "data": ["43 /escm/images/favicon.ico", 30, 0, 0.0, 12.666666666666666, 21.700000000000006, 69.89999999999995, 115.0, 260.8695652173913, 48749.745244565216, 0.0, 4, 115]}, {"isController": true, "data": ["sp_userlogin_46", 30, 0, 0.0, 16219.566666666666, 39153.5, 42341.799999999996, 45094.0, 0.6652769769814165, 298.2943008631969, 0.0, 3601, 45094]}, {"isController": false, "data": ["63 /escm/messages", 30, 0, 0.0, 11.1, 18.800000000000004, 23.249999999999996, 26.0, 0.4997834271815546, 0.22500015618232097, 0.0, 5, 26]}, {"isController": false, "data": ["67 /escm/messages", 30, 0, 0.0, 12.1, 13.900000000000002, 43.599999999999966, 70.0, 0.499417346429166, 0.22483534834359914, 0.0, 7, 70]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 420, 0, 0.0, 2426.1476190476183, 7699.600000000003, 18724.449999999997, 40722.520000000026, 4.123063632615397, 67.15958534066813, 0.0, 3, 44783]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 420, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
