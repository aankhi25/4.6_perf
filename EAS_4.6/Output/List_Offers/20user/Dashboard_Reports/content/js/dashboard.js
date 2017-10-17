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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [0.95, 500, 1500, "675 /escm/login/auth"]}, {"isController": true, "data": [0.0, 500, 1500, "List_offers_46_SP_with_cache"]}, {"isController": false, "data": [0.075, 500, 1500, "680 /escm/dashboard/myAccountInfo"]}, {"isController": false, "data": [0.05, 500, 1500, "143 /escm/productOffer/index"]}, {"isController": false, "data": [0.075, 500, 1500, "676 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [0.075, 500, 1500, "144 /escm/productOffer/list"]}, {"isController": true, "data": [0.0, 500, 1500, "SP_user_login_46_with_cache"]}, {"isController": false, "data": [0.975, 500, 1500, "147 /escm/productOffer/getAllService"]}, {"isController": false, "data": [1.0, 500, 1500, "146 /escm/productOffer/offerList"]}, {"isController": false, "data": [1.0, 500, 1500, "149 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "150 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "151 /escm/recentItem"]}, {"isController": true, "data": [0.95, 500, 1500, "Hit_the_portal_with-cache"]}, {"isController": false, "data": [1.0, 500, 1500, "148 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.5821428571428572, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["675 /escm/login/auth", 20, 0, 0.0, 164.04999999999998, 619.6000000000006, 857.7999999999998, 869.0, 0.3311751751088738, 1.9327176234869434, 0.0, 47, 869]}, {"isController": true, "data": ["List_offers_46_SP_with_cache", 20, 0, 0.0, 5440.200000000001, 6981.400000000001, 7188.25, 7197.0, 0.29763233477685014, 10.65099399898805, 0.0, 3139, 7197]}, {"isController": false, "data": ["680 /escm/dashboard/myAccountInfo", 20, 0, 0.0, 2552.45, 3579.1000000000004, 3663.9, 3667.0, 0.31413448097130386, 2.5919775943581445, 0.0, 1003, 3667]}, {"isController": false, "data": ["143 /escm/productOffer/index", 20, 0, 0.0, 2551.1, 3647.5000000000005, 3986.25, 4003.0, 0.3141295470251932, 3.8511086073459193, 0.0, 1225, 4003]}, {"isController": false, "data": ["676 /escm/login/doAuth?id=loginform", 20, 0, 0.0, 2884.2000000000003, 4010.3, 4025.7, 4026.0, 0.3123730984287633, 2.9082271020757196, 0.0, 1311, 4026]}, {"isController": false, "data": ["144 /escm/productOffer/list", 20, 0, 0.0, 2529.150000000001, 3503.9, 3612.4, 3618.0, 0.3149308726734482, 3.811078751417189, 0.0, 990, 3618]}, {"isController": true, "data": ["SP_user_login_46_with_cache", 20, 0, 0.0, 5436.65, 7109.8, 7449.849999999999, 7467.0, 0.2964412231164866, 5.205887114255859, 0.0, 2472, 7467]}, {"isController": false, "data": ["147 /escm/productOffer/getAllService", 20, 0, 0.0, 110.94999999999999, 259.7, 545.9499999999998, 561.0, 35.650623885918, 17.02456550802139, 0.0, 20, 561]}, {"isController": false, "data": ["146 /escm/productOffer/offerList", 20, 0, 0.0, 185.39999999999995, 261.5, 308.54999999999995, 311.0, 64.30868167202571, 603.2706993569132, 0.0, 132, 311]}, {"isController": false, "data": ["149 /escm/recentItem", 20, 0, 0.0, 14.8, 21.900000000000002, 25.799999999999997, 26.0, 769.2307692307693, 256.1598557692308, 0.0, 9, 26]}, {"isController": false, "data": ["150 /escm/messages", 20, 0, 0.0, 17.200000000000003, 22.800000000000004, 78.09999999999997, 81.0, 246.91358024691357, 111.15933641975309, 0.0, 10, 81]}, {"isController": false, "data": ["151 /escm/recentItem", 20, 0, 0.0, 15.299999999999997, 24.800000000000004, 29.749999999999996, 30.0, 666.6666666666666, 222.00520833333334, 0.0, 9, 30]}, {"isController": true, "data": ["Hit_the_portal_with-cache", 20, 0, 0.0, 164.04999999999998, 619.6000000000006, 857.7999999999998, 869.0, 0.3311751751088738, 1.9327176234869434, 0.0, 47, 869]}, {"isController": false, "data": ["148 /escm/messages", 20, 0, 0.0, 16.299999999999997, 21.900000000000002, 35.29999999999999, 36.0, 555.5555555555555, 250.10850694444446, 0.0, 10, 36]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 220, 0, 0.0, 1003.7181818181823, 3296.3, 3600.049999999999, 4016.43, 3.4361040827163962, 18.487164272131636, 0.0, 9, 4026]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 220, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
