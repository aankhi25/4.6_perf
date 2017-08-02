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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "186 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "72 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "99 /escm/images/favicon.ico"]}, {"isController": false, "data": [1.0, 500, 1500, "60 /escm/productOffer/offerList"]}, {"isController": false, "data": [1.0, 500, 1500, "178 /escm/images/favicon.ico"]}, {"isController": false, "data": [1.0, 500, 1500, "59 /escm/productOffer/offerList"]}, {"isController": false, "data": [1.0, 500, 1500, "62 /escm/messages"]}, {"isController": false, "data": [0.0, 500, 1500, "133 /escm/productOffer/productModelSearch/productModelSearch"]}, {"isController": true, "data": [0.0, 500, 1500, "List_offers"]}, {"isController": false, "data": [0.15, 500, 1500, "49 /escm/productOffer/index"]}, {"isController": false, "data": [0.0, 500, 1500, "65 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "66 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "65 /escm/recentItem"]}, {"isController": false, "data": [0.95, 500, 1500, "33 /escm/login/auth"]}, {"isController": false, "data": [1.0, 500, 1500, "61 /escm/productOffer/getAllService"]}, {"isController": true, "data": [0.0, 500, 1500, "Hit_the_portal"]}, {"isController": false, "data": [1.0, 500, 1500, "43 /escm/images/favicon.ico"]}, {"isController": true, "data": [0.0, 500, 1500, "sp_userlogin_46"]}, {"isController": false, "data": [0.5, 500, 1500, "184 /escm/productOffer/showOfferDetails"]}, {"isController": false, "data": [1.0, 500, 1500, "63 /escm/messages"]}, {"isController": true, "data": [0.0, 500, 1500, "Offer_search_by_id"]}, {"isController": false, "data": [1.0, 500, 1500, "67 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "185 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.6782608695652174, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["186 /escm/recentItem", 10, 0, 0.0, 12.600000000000001, 18.9, 19.0, 19.0, 526.3157894736842, 175.2672697368421, 0.0, 6, 19]}, {"isController": false, "data": ["72 /escm/recentItem", 10, 0, 0.0, 8.2, 11.8, 12.0, 12.0, 833.3333333333334, 277.5065104166667, 0.0, 6, 12]}, {"isController": false, "data": ["99 /escm/images/favicon.ico", 10, 0, 0.0, 5.699999999999999, 10.9, 11.0, 11.0, 909.090909090909, 110.97301136363637, 0.0, 3, 11]}, {"isController": false, "data": ["60 /escm/productOffer/offerList", 10, 0, 0.0, 187.6, 278.6, 283.0, 283.0, 35.3356890459364, 260.117601590106, 0.0, 126, 283]}, {"isController": false, "data": ["178 /escm/images/favicon.ico", 10, 0, 0.0, 15.0, 61.40000000000001, 65.0, 65.0, 153.84615384615387, 18.780048076923077, 0.0, 3, 65]}, {"isController": false, "data": ["59 /escm/productOffer/offerList", 10, 0, 0.0, 55.900000000000006, 92.7, 94.0, 94.0, 106.38297872340425, 583.6519281914893, 0.0, 26, 94]}, {"isController": false, "data": ["62 /escm/messages", 10, 0, 0.0, 11.000000000000002, 17.8, 18.0, 18.0, 555.5555555555555, 250.10850694444446, 0.0, 7, 18]}, {"isController": false, "data": ["133 /escm/productOffer/productModelSearch/productModelSearch", 10, 0, 0.0, 2857.7999999999997, 5213.1, 5366.0, 5366.0, 1.8635855385762206, 38.89233862513977, 0.0, 2076, 5366]}, {"isController": true, "data": ["List_offers", 10, 0, 0.0, 6349.6, 11542.2, 11549.0, 11549.0, 0.8658758334054897, 90.64037267837043, 0.0, 1662, 11549]}, {"isController": false, "data": ["49 /escm/productOffer/index", 10, 0, 0.0, 5861.400000000001, 11212.9, 11236.0, 11236.0, 0.8899964400142399, 10.509519485359558, 0.0, 1143, 11236]}, {"isController": false, "data": ["65 /escm/login/doAuth?id=loginform", 10, 0, 0.0, 10952.6, 17833.8, 17971.0, 17971.0, 0.1305500071802504, 1.1613596048904031, 0.0, 3019, 17971]}, {"isController": false, "data": ["66 /escm/recentItem", 10, 0, 0.0, 15.3, 42.900000000000006, 44.0, 44.0, 227.27272727272725, 75.68359375, 0.0, 5, 44]}, {"isController": false, "data": ["65 /escm/recentItem", 10, 0, 0.0, 11.299999999999999, 23.5, 24.0, 24.0, 416.6666666666667, 138.75325520833334, 0.0, 5, 24]}, {"isController": false, "data": ["33 /escm/login/auth", 10, 0, 0.0, 111.60000000000001, 483.5000000000001, 514.0, 514.0, 0.16608812635984652, 0.8476333480044511, 0.0, 35, 514]}, {"isController": false, "data": ["61 /escm/productOffer/getAllService", 10, 0, 0.0, 68.8, 261.00000000000006, 273.0, 273.0, 36.630036630036635, 17.49227335164835, 0.0, 12, 273]}, {"isController": true, "data": ["Hit_the_portal", 10, 10, 100.0, 392.79999999999995, 776.7, 810.0, 810.0, 0.16535211733386249, 111.74993437587844, 0.0, 286, 810]}, {"isController": false, "data": ["43 /escm/images/favicon.ico", 10, 0, 0.0, 6.8999999999999995, 8.9, 9.0, 9.0, 0.1666444474070124, 31.14151837046727, 0.0, 5, 9]}, {"isController": true, "data": ["sp_userlogin_46", 10, 0, 0.0, 11761.300000000001, 18773.8, 18904.0, 18904.0, 0.1288626581789129, 57.83459289870106, 0.0, 3802, 18904]}, {"isController": false, "data": ["184 /escm/productOffer/showOfferDetails", 10, 0, 0.0, 1005.4, 1275.3, 1278.0, 1278.0, 7.82472613458529, 71.5488678599374, 0.0, 693, 1278]}, {"isController": false, "data": ["63 /escm/messages", 10, 0, 0.0, 9.399999999999999, 15.700000000000001, 16.0, 16.0, 625.0, 281.3720703125, 0.0, 7, 16]}, {"isController": true, "data": ["Offer_search_by_id", 10, 0, 0.0, 4841.299999999999, 7568.700000000001, 7727.0, 7727.0, 1.2941633234114145, 623.5464675407661, 0.0, 3786, 7727]}, {"isController": false, "data": ["67 /escm/messages", 10, 0, 0.0, 12.9, 22.300000000000004, 23.0, 23.0, 434.7826086956522, 195.73709239130434, 0.0, 7, 23]}, {"isController": false, "data": ["185 /escm/messages", 10, 0, 0.0, 16.400000000000002, 50.40000000000001, 54.0, 54.0, 185.18518518518516, 83.36950231481481, 0.0, 7, 54]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 190, 0, 0.0, 1117.1473684210523, 2723.300000000002, 9400.849999999999, 16722.480000000003, 2.4804501364247575, 33.86436588597762, 0.0, 3, 17971]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 190, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
