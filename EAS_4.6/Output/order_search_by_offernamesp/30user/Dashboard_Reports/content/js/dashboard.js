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

    var data = {"KoPercent": 5.0, "OkPercent": 95.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "99 /escm/images/favicon.ico"]}, {"isController": true, "data": [0.0, 500, 1500, "order_search_by_offername"]}, {"isController": false, "data": [1.0, 500, 1500, "115 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "116 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "113 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "111 /escm/recentItem"]}, {"isController": false, "data": [0.21666666666666667, 500, 1500, "65 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "109 /escm/messages"]}, {"isController": false, "data": [0.18333333333333332, 500, 1500, "108 /escm/order/showOrderDetail"]}, {"isController": false, "data": [0.11666666666666667, 500, 1500, "106 /escm/order/showOrderDetail"]}, {"isController": false, "data": [0.95, 500, 1500, "33 /escm/login/auth"]}, {"isController": true, "data": [0.0, 500, 1500, "Hit_the_portal"]}, {"isController": false, "data": [1.0, 500, 1500, "43 /escm/images/favicon.ico"]}, {"isController": false, "data": [0.0, 500, 1500, "12 /escm/order/showOrderDetail"]}, {"isController": false, "data": [0.8, 500, 1500, "104 /escm/order/searchOrder"]}, {"isController": false, "data": [0.85, 500, 1500, "105 /escm/order/searchOrder"]}, {"isController": true, "data": [0.0, 500, 1500, "sp_userlogin_46"]}, {"isController": false, "data": [1.0, 500, 1500, "23 /escm/recentItem"]}, {"isController": true, "data": [0.0, 500, 1500, "List_Orders"]}, {"isController": false, "data": [1.0, 500, 1500, "107 /escm/messages"]}, {"isController": false, "data": [0.18333333333333332, 500, 1500, "1 /escm/order/index"]}, {"isController": false, "data": [1.0, 500, 1500, "110 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "114 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "22 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.6375, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["99 /escm/images/favicon.ico", 30, 0, 0.0, 4.8, 9.0, 13.45, 14.0, 0.4998916901338043, 0.06102193483078666, 0.0, 2, 14]}, {"isController": true, "data": ["order_search_by_offername", 30, 0, 0.0, 6067.466666666668, 15675.1, 16371.3, 16687.0, 0.4657878801993572, 31.967437666907326, 0.0, 3067, 16687]}, {"isController": false, "data": ["115 /escm/recentItem", 30, 0, 0.0, 8.999999999999998, 16.700000000000006, 18.9, 20.0, 0.49983338887037654, 0.16644842344218594, 0.0, 6, 20]}, {"isController": false, "data": ["116 /escm/recentItem", 30, 0, 0.0, 8.500000000000004, 12.900000000000002, 17.349999999999998, 19.0, 0.49984171678968325, 0.16645119670437694, 0.0, 6, 19]}, {"isController": false, "data": ["113 /escm/messages", 30, 0, 0.0, 10.433333333333334, 17.60000000000001, 22.45, 23.0, 0.499808406777402, 0.2250114018792796, 0.0, 6, 23]}, {"isController": false, "data": ["111 /escm/recentItem", 30, 0, 0.0, 12.200000000000001, 14.900000000000002, 58.99999999999996, 92.0, 0.49973347547974417, 0.166415151502532, 0.0, 6, 92]}, {"isController": false, "data": ["65 /escm/login/doAuth?id=loginform", 30, 0, 0.0, 3694.1333333333337, 9268.700000000004, 9567.2, 9675.0, 3.10077519379845, 28.08018410852713, 0.0, 905, 9675]}, {"isController": false, "data": ["109 /escm/messages", 30, 0, 0.0, 10.866666666666667, 20.50000000000001, 27.049999999999994, 32.0, 0.49982506122857, 0.2250188996351277, 0.0, 7, 32]}, {"isController": false, "data": ["108 /escm/order/showOrderDetail", 30, 0, 0.0, 2138.766666666667, 2603.7000000000003, 8364.699999999993, 14308.0, 0.4841833440929632, 10.367103020093609, 0.0, 1153, 14308]}, {"isController": false, "data": ["106 /escm/order/showOrderDetail", 30, 0, 0.0, 2512.466666666667, 8420.300000000014, 10610.05, 11748.0, 0.48517781767017615, 10.388032962778775, 0.0, 1322, 11748]}, {"isController": false, "data": ["33 /escm/login/auth", 30, 0, 0.0, 193.89999999999998, 564.2000000000003, 694.3499999999999, 795.0, 37.73584905660377, 192.58549528301887, 0.0, 35, 795]}, {"isController": true, "data": ["Hit_the_portal", 30, 30, 100.0, 570.2, 920.6, 1094.35, 1228.0, 24.4299674267101, 16510.50679458469, 0.0, 301, 1228]}, {"isController": false, "data": ["43 /escm/images/favicon.ico", 30, 0, 0.0, 11.599999999999998, 33.40000000000001, 40.49999999999999, 46.0, 652.1739130434783, 121874.36311141304, 0.0, 4, 46]}, {"isController": false, "data": ["12 /escm/order/showOrderDetail", 30, 30, 100.0, 121.9, 413.9000000000002, 521.4499999999998, 621.0, 0.49913483295620925, 0.6224562321143352, 0.0, 26, 621]}, {"isController": false, "data": ["104 /escm/order/searchOrder", 30, 0, 0.0, 781.4333333333333, 3126.300000000002, 3973.549999999999, 4809.0, 0.49545011643077735, 2.1550144712721506, 0.0, 148, 4809]}, {"isController": false, "data": ["105 /escm/order/searchOrder", 30, 0, 0.0, 522.5333333333334, 1970.2000000000012, 2177.65, 2264.0, 0.4963107567084671, 2.1587579202924925, 0.0, 157, 2264]}, {"isController": true, "data": ["sp_userlogin_46", 30, 0, 0.0, 4496.066666666667, 10131.100000000004, 10615.0, 10725.0, 2.797202797202797, 1255.8544580419582, 0.0, 1503, 10725]}, {"isController": false, "data": ["23 /escm/recentItem", 30, 0, 0.0, 15.599999999999996, 42.90000000000005, 58.949999999999974, 76.0, 0.4993674678740262, 0.1662932681103935, 0.0, 6, 76]}, {"isController": true, "data": ["List_Orders", 30, 30, 100.0, 3835.0, 8705.300000000003, 9924.449999999999, 10233.0, 0.4747812049946983, 69.20201890816149, 0.0, 1204, 10233]}, {"isController": false, "data": ["107 /escm/messages", 30, 0, 0.0, 16.46666666666666, 29.900000000000002, 69.29999999999995, 99.0, 0.49917635900763735, 0.2247268569360555, 0.0, 7, 99]}, {"isController": false, "data": ["1 /escm/order/index", 30, 0, 0.0, 3484.5333333333333, 8508.500000000004, 9737.1, 10110.0, 0.47614512903532996, 8.947591548820748, 0.0, 1007, 10110]}, {"isController": false, "data": ["110 /escm/recentItem", 30, 0, 0.0, 13.63333333333333, 33.800000000000004, 49.54999999999998, 60.0, 0.49982506122857, 0.16644565027240465, 0.0, 6, 60]}, {"isController": false, "data": ["114 /escm/messages", 30, 0, 0.0, 9.733333333333333, 13.800000000000004, 28.449999999999985, 40.0, 0.4996668887408395, 0.22494769112258495, 0.0, 6, 40]}, {"isController": false, "data": ["22 /escm/messages", 30, 0, 0.0, 13.3, 23.60000000000001, 38.29999999999999, 46.0, 0.4996169603304133, 0.22492521358625053, 0.0, 7, 46]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 600, 30, 5.0, 679.2900000000005, 1831.8999999999996, 3286.249999999995, 9478.57, 9.5229025807066, 131.71688571822526, 0.0, 2, 14308]}}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "items": [{"isController": false, "data": ["404/Not Found", 30, 100.0, 5.0]}], "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);
    
        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": ["12 /escm/order/showOrderDetail", 30, 30, "404/Not Found", 30, null, null, null, null, null, null, null, null]}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 600, 30, "404/Not Found", 30, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
