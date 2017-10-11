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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [0.5, 500, 1500, "158 /escm/login/doAuth?id=loginform"]}, {"isController": true, "data": [0.7, 500, 1500, "New_hit_the_portal_4.6"]}, {"isController": false, "data": [1.0, 500, 1500, "70 /escm/recentItem"]}, {"isController": true, "data": [0.0, 500, 1500, "new_List_Orders"]}, {"isController": false, "data": [0.5, 500, 1500, "59 /escm/order/showOrderDetail"]}, {"isController": true, "data": [0.0, 500, 1500, "new_SP_user_login_4.6"]}, {"isController": false, "data": [1.0, 500, 1500, "56 /escm/images/sidebar-bg.jpg"]}, {"isController": false, "data": [1.0, 500, 1500, "51 /escm/images/favicon.ico"]}, {"isController": false, "data": [0.9, 500, 1500, "88 /escm/login/auth"]}, {"isController": false, "data": [1.0, 500, 1500, "184 /escm/images/favicon.ico"]}, {"isController": false, "data": [0.4, 500, 1500, "1 /escm/order/index"]}, {"isController": false, "data": [1.0, 500, 1500, "69 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "93 /escm/images/favicon.ico"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.6923076923076923, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["158 /escm/login/doAuth?id=loginform", 5, 0, 0.0, 1144.0, 1291.0, 1291.0, 1291.0, 3.8729666924864445, 36.36806496901627, 12.091674331913246, 1055, 1291]}, {"isController": true, "data": ["New_hit_the_portal_4.6", 5, 0, 0.0, 678.8, 1045.0, 1045.0, 1045.0, 4.784688995215311, 3656.843413576555, 32.80128588516747, 452, 1045]}, {"isController": false, "data": ["70 /escm/recentItem", 5, 0, 0.0, 10.6, 15.0, 15.0, 15.0, 333.3333333333333, 111.00260416666667, 187.82552083333334, 7, 15]}, {"isController": true, "data": ["new_List_Orders", 5, 0, 0.0, 3596.4, 3828.0, 3828.0, 3828.0, 1.3061650992685476, 949.8616281347963, 56.75057756987984, 3178, 3828]}, {"isController": false, "data": ["59 /escm/order/showOrderDetail", 5, 0, 0.0, 1281.6, 1440.0, 1440.0, 1440.0, 3.472222222222222, 75.91078016493056, 2.1124945746527777, 1153, 1440]}, {"isController": true, "data": ["new_SP_user_login_4.6", 5, 0, 0.0, 2052.8, 2252.0, 2252.0, 2252.0, 2.2202486678507993, 1316.8255821214477, 83.76668655639432, 1959, 2252]}, {"isController": false, "data": ["56 /escm/images/sidebar-bg.jpg", 5, 0, 0.0, 4.0, 6.0, 6.0, 6.0, 833.3333333333334, 1385.9049479166667, 455.72916666666663, 3, 6]}, {"isController": false, "data": ["51 /escm/images/favicon.ico", 5, 0, 0.0, 5.4, 7.0, 7.0, 7.0, 714.2857142857143, 87.19308035714286, 420.6194196428571, 4, 7]}, {"isController": false, "data": ["88 /escm/login/auth", 5, 0, 0.0, 173.4, 589.0, 589.0, 589.0, 8.488964346349746, 49.54106536502547, 3.059011566213922, 41, 589]}, {"isController": false, "data": ["184 /escm/images/favicon.ico", 5, 0, 0.0, 4.6, 9.0, 9.0, 9.0, 555.5555555555555, 67.81684027777779, 354.27517361111114, 3, 9]}, {"isController": false, "data": ["1 /escm/order/index", 5, 0, 0.0, 1400.0, 1545.0, 1545.0, 1545.0, 3.236245954692557, 70.07610234627832, 3.8967688106796117, 1202, 1545]}, {"isController": false, "data": ["69 /escm/messages", 5, 0, 0.0, 9.8, 16.0, 16.0, 16.0, 312.5, 140.68603515625, 175.47607421875, 7, 16]}, {"isController": false, "data": ["93 /escm/images/favicon.ico", 5, 0, 0.0, 9.0, 12.0, 12.0, 12.0, 416.6666666666667, 77864.17643229167, 174.96744791666666, 6, 12]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 50, 0, 0.0, 404.2399999999999, 1398.5, 1437.25, 1545.0, 32.362459546925564, 803.5807291666667, 27.87469660194175, 3, 1545]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 50, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
