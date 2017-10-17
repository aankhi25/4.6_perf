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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [0.9833333333333333, 500, 1500, "675 /escm/login/auth"]}, {"isController": true, "data": [0.0, 500, 1500, "List_offers_46_SP_with_cache"]}, {"isController": false, "data": [0.06666666666666667, 500, 1500, "680 /escm/dashboard/myAccountInfo"]}, {"isController": false, "data": [0.05, 500, 1500, "143 /escm/productOffer/index"]}, {"isController": false, "data": [0.06666666666666667, 500, 1500, "676 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [0.08333333333333333, 500, 1500, "144 /escm/productOffer/list"]}, {"isController": true, "data": [0.0, 500, 1500, "SP_user_login_46_with_cache"]}, {"isController": false, "data": [0.9833333333333333, 500, 1500, "147 /escm/productOffer/getAllService"]}, {"isController": false, "data": [0.9833333333333333, 500, 1500, "146 /escm/productOffer/offerList"]}, {"isController": false, "data": [1.0, 500, 1500, "149 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "150 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "151 /escm/recentItem"]}, {"isController": true, "data": [0.9833333333333333, 500, 1500, "Hit_the_portal_with-cache"]}, {"isController": false, "data": [1.0, 500, 1500, "148 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.5857142857142857, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["675 /escm/login/auth", 30, 0, 0.0, 131.66666666666669, 365.6, 520.55, 586.0, 0.4961383895347876, 2.8954326326756745, 0.0, 37, 586]}, {"isController": true, "data": ["List_offers_46_SP_with_cache", 30, 0, 0.0, 6230.066666666666, 8930.0, 9411.55, 9675.0, 3.10077519379845, 110.9595041989664, 0.0, 3238, 9675]}, {"isController": false, "data": ["680 /escm/dashboard/myAccountInfo", 30, 0, 0.0, 3046.1, 4775.8, 4876.0, 4887.0, 0.4623422257154746, 3.7770590603664833, 0.0, 823, 4887]}, {"isController": false, "data": ["143 /escm/productOffer/index", 30, 0, 0.0, 3014.133333333333, 4624.1, 4825.9, 4849.0, 6.186842647968653, 75.84501153588369, 0.0, 970, 4849]}, {"isController": false, "data": ["676 /escm/login/doAuth?id=loginform", 30, 0, 0.0, 3305.4666666666667, 4992.3, 5129.2, 5237.0, 0.45986173490503857, 4.288929211950274, 0.0, 1180, 5237]}, {"isController": false, "data": ["144 /escm/productOffer/list", 30, 0, 0.0, 2852.6, 4134.2, 5021.95, 5050.0, 5.9405940594059405, 71.8844755569307, 0.0, 1042, 5050]}, {"isController": true, "data": ["SP_user_login_46_with_cache", 30, 0, 0.0, 6351.566666666667, 8823.9, 9002.25, 9071.0, 0.43433568357197666, 7.599121284620174, 0.0, 2003, 9071]}, {"isController": false, "data": ["147 /escm/productOffer/getAllService", 30, 0, 0.0, 93.73333333333332, 275.1, 452.2999999999998, 614.0, 48.8599348534202, 23.332527483713356, 0.0, 17, 614]}, {"isController": false, "data": ["146 /escm/productOffer/offerList", 30, 0, 0.0, 204.5333333333333, 244.0, 563.7999999999995, 918.0, 32.67973856209151, 306.5640318627451, 0.0, 121, 918]}, {"isController": false, "data": ["149 /escm/recentItem", 30, 0, 0.0, 15.666666666666664, 21.800000000000004, 62.449999999999946, 107.0, 280.3738317757009, 93.36667640186916, 0.0, 8, 107]}, {"isController": false, "data": ["150 /escm/messages", 30, 0, 0.0, 15.933333333333334, 21.800000000000004, 68.44999999999995, 113.0, 265.4867256637168, 119.52087942477876, 0.0, 9, 113]}, {"isController": false, "data": ["151 /escm/recentItem", 30, 0, 0.0, 15.700000000000003, 19.800000000000004, 66.19999999999995, 108.0, 277.77777777777777, 92.50217013888889, 0.0, 8, 108]}, {"isController": true, "data": ["Hit_the_portal_with-cache", 30, 0, 0.0, 131.66666666666669, 365.6, 520.55, 586.0, 0.4961383895347876, 2.8954326326756745, 0.0, 37, 586]}, {"isController": false, "data": ["148 /escm/messages", 30, 0, 0.0, 17.766666666666666, 36.50000000000003, 70.99999999999996, 104.0, 288.46153846153845, 129.8640324519231, 0.0, 8, 104]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 330, 0, 0.0, 1155.7545454545448, 3895.400000000001, 4372.099999999998, 5033.87, 5.058479083955424, 27.185343200561032, 0.0, 8, 5237]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 330, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
