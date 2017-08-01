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

    var data = {"KoPercent": 7.142857142857143, "OkPercent": 92.85714285714286};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "13 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "99 /escm/images/favicon.ico"]}, {"isController": true, "data": [0.0, 500, 1500, "order_search_by_id"]}, {"isController": false, "data": [0.0, 500, 1500, "5 /escm/order/showOrderDetail"]}, {"isController": false, "data": [1.0, 500, 1500, "7 /escm/recentItem"]}, {"isController": false, "data": [0.0, 500, 1500, "65 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "6 /escm/messages"]}, {"isController": false, "data": [0.5, 500, 1500, "33 /escm/login/auth"]}, {"isController": true, "data": [0.0, 500, 1500, "Hit_the_portal"]}, {"isController": false, "data": [1.0, 500, 1500, "43 /escm/images/favicon.ico"]}, {"isController": false, "data": [0.0, 500, 1500, "12 /escm/order/showOrderDetail"]}, {"isController": true, "data": [0.0, 500, 1500, "sp_userlogin_46"]}, {"isController": false, "data": [1.0, 500, 1500, "23 /escm/recentItem"]}, {"isController": true, "data": [0.0, 500, 1500, "List_Orders"]}, {"isController": false, "data": [0.0, 500, 1500, "1 /escm/order/index"]}, {"isController": false, "data": [1.0, 500, 1500, "10 /escm/messages"]}, {"isController": false, "data": [0.5, 500, 1500, "4 /escm/order/searchOrder"]}, {"isController": false, "data": [1.0, 500, 1500, "22 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.5, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["13 /escm/recentItem", 1, 0, 0.0, 16.0, 16.0, 16.0, 16.0, 62.5, 20.81298828125, 0.0, 16, 16]}, {"isController": false, "data": ["99 /escm/images/favicon.ico", 1, 0, 0.0, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 20.345052083333332, 0.0, 6, 6]}, {"isController": true, "data": ["order_search_by_id", 1, 0, 0.0, 2824.0, 2824.0, 2824.0, 2824.0, 0.3541076487252125, 25.940805926876774, 0.0, 2824, 2824]}, {"isController": false, "data": ["5 /escm/order/showOrderDetail", 1, 0, 0.0, 2048.0, 2048.0, 2048.0, 2048.0, 0.48828125, 11.167049407958984, 0.0, 2048, 2048]}, {"isController": false, "data": ["7 /escm/recentItem", 1, 0, 0.0, 12.0, 12.0, 12.0, 12.0, 83.33333333333333, 27.750651041666668, 0.0, 12, 12]}, {"isController": false, "data": ["65 /escm/login/doAuth?id=loginform", 1, 0, 0.0, 1788.0, 1788.0, 1788.0, 1788.0, 0.5592841163310962, 5.177201307326622, 0.0, 1788, 1788]}, {"isController": false, "data": ["6 /escm/messages", 1, 0, 0.0, 15.0, 15.0, 15.0, 15.0, 66.66666666666667, 30.013020833333336, 0.0, 15, 15]}, {"isController": false, "data": ["33 /escm/login/auth", 1, 0, 0.0, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 9.684090370018975, 0.0, 527, 527]}, {"isController": true, "data": ["Hit_the_portal", 1, 1, 100.0, 878.0, 878.0, 878.0, 878.0, 1.1389521640091116, 769.7381299829157, 0.0, 878, 878]}, {"isController": false, "data": ["43 /escm/images/favicon.ico", 1, 0, 0.0, 14.0, 14.0, 14.0, 14.0, 71.42857142857143, 13348.14453125, 0.0, 14, 14]}, {"isController": false, "data": ["12 /escm/order/showOrderDetail", 1, 1, 100.0, 115.0, 115.0, 115.0, 115.0, 8.695652173913043, 10.844089673913043, 0.0, 115, 115]}, {"isController": true, "data": ["sp_userlogin_46", 1, 0, 0.0, 2551.0, 2551.0, 2551.0, 2551.0, 0.3920031360250882, 176.07563516758134, 0.0, 2551, 2551]}, {"isController": false, "data": ["23 /escm/recentItem", 1, 0, 0.0, 18.0, 18.0, 18.0, 18.0, 55.55555555555555, 18.50043402777778, 0.0, 18, 18]}, {"isController": true, "data": ["List_Orders", 1, 1, 100.0, 2004.0, 2004.0, 2004.0, 2004.0, 0.499001996007984, 72.7319774513473, 0.0, 2004, 2004]}, {"isController": false, "data": ["1 /escm/order/index", 1, 0, 0.0, 1591.0, 1591.0, 1591.0, 1591.0, 0.6285355122564426, 11.81082063167819, 0.0, 1591, 1591]}, {"isController": false, "data": ["10 /escm/messages", 1, 0, 0.0, 24.0, 24.0, 24.0, 24.0, 41.666666666666664, 18.758138020833332, 0.0, 24, 24]}, {"isController": false, "data": ["4 /escm/order/searchOrder", 1, 0, 0.0, 632.0, 632.0, 632.0, 632.0, 1.5822784810126582, 5.774389339398734, 0.0, 632, 632]}, {"isController": false, "data": ["22 /escm/messages", 1, 0, 0.0, 24.0, 24.0, 24.0, 24.0, 41.666666666666664, 18.758138020833332, 0.0, 24, 24]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 14, 1, 7.142857142857143, 487.8571428571428, 1918.0, 2048.0, 2048.0, 6.8359375, 122.19905853271484, 0.0, 6, 2048]}}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "items": [{"isController": false, "data": ["404/Not Found", 1, 100.0, 7.142857142857143]}], "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);
    
        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": ["12 /escm/order/showOrderDetail", 1, 1, "404/Not Found", 1, null, null, null, null, null, null, null, null]}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 14, 1, "404/Not Found", 1, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
