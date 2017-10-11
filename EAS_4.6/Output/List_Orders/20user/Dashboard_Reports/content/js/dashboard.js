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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [0.175, 500, 1500, "158 /escm/login/doAuth?id=loginform"]}, {"isController": true, "data": [0.55, 500, 1500, "New_hit_the_portal_4.6"]}, {"isController": false, "data": [1.0, 500, 1500, "70 /escm/recentItem"]}, {"isController": true, "data": [0.0, 500, 1500, "new_List_Orders"]}, {"isController": false, "data": [0.075, 500, 1500, "59 /escm/order/showOrderDetail"]}, {"isController": true, "data": [0.0, 500, 1500, "new_SP_user_login_4.6"]}, {"isController": false, "data": [1.0, 500, 1500, "56 /escm/images/sidebar-bg.jpg"]}, {"isController": false, "data": [1.0, 500, 1500, "51 /escm/images/favicon.ico"]}, {"isController": false, "data": [0.975, 500, 1500, "88 /escm/login/auth"]}, {"isController": false, "data": [1.0, 500, 1500, "184 /escm/images/favicon.ico"]}, {"isController": false, "data": [0.1, 500, 1500, "1 /escm/order/index"]}, {"isController": false, "data": [1.0, 500, 1500, "69 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "93 /escm/images/favicon.ico"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.6057692307692307, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["158 /escm/login/doAuth?id=loginform", 20, 0, 0.0, 3017.4, 6276.200000000001, 6498.15, 6507.0, 0.30398832684824906, 2.8370363703033803, 0.9615412018178502, 981, 6507]}, {"isController": true, "data": ["New_hit_the_portal_4.6", 20, 0, 0.0, 809.9, 1284.0000000000002, 1795.5999999999997, 1822.0, 0.32350943029989326, 247.25187584921224, 2.217808789751221, 423, 1822]}, {"isController": false, "data": ["70 /escm/recentItem", 20, 0, 0.0, 11.950000000000001, 25.10000000000002, 29.799999999999997, 30.0, 0.33316674995835416, 0.11094713060136598, 0.18773165500583042, 7, 30]}, {"isController": true, "data": ["new_List_Orders", 20, 0, 0.0, 10834.5, 18853.0, 19535.25, 19570.0, 0.2882218155092159, 209.59881662427404, 12.522731243965355, 4574, 19570]}, {"isController": false, "data": ["59 /escm/order/showOrderDetail", 20, 0, 0.0, 5480.1, 15071.100000000002, 16290.55, 16351.0, 0.2814562546616192, 6.15315870878425, 0.17123754556073123, 1326, 16351]}, {"isController": true, "data": ["new_SP_user_login_4.6", 20, 0, 0.0, 4406.650000000001, 7727.6, 7996.25, 8010.0, 0.2955912564106354, 175.2976523126321, 11.164343196228256, 1779, 8010]}, {"isController": false, "data": ["56 /escm/images/sidebar-bg.jpg", 20, 0, 0.0, 8.15, 17.700000000000006, 36.04999999999998, 37.0, 0.333127904458917, 0.5540203332944684, 0.18217932275097024, 3, 37]}, {"isController": false, "data": ["51 /escm/images/favicon.ico", 20, 0, 0.0, 8.999999999999998, 23.50000000000001, 31.599999999999994, 32.0, 0.33322781119312217, 0.040677223046035424, 0.19622692397407487, 2, 32]}, {"isController": false, "data": ["88 /escm/login/auth", 20, 0, 0.0, 182.55, 445.0000000000003, 684.1499999999999, 696.0, 0.3308026927339188, 1.9305438396268544, 0.11920526720587504, 40, 696]}, {"isController": false, "data": ["184 /escm/images/favicon.ico", 20, 0, 0.0, 8.450000000000001, 27.0, 27.95, 28.0, 0.333183400802972, 0.040671801855831545, 0.21246949289486397, 2, 28]}, {"isController": false, "data": ["1 /escm/order/index", 20, 0, 0.0, 3936.4, 7208.500000000002, 8143.349999999999, 8189.0, 0.30129103207243035, 6.523995359176571, 0.362785002485651, 1212, 8189]}, {"isController": false, "data": ["69 /escm/messages", 20, 0, 0.0, 13.200000000000001, 23.0, 25.849999999999998, 26.0, 0.3331889514543698, 0.15000010412154732, 0.18709340535767832, 8, 26]}, {"isController": false, "data": ["93 /escm/images/favicon.ico", 20, 0, 0.0, 11.249999999999998, 16.900000000000002, 42.64999999999998, 44.0, 0.33308906801678767, 62.245694303344216, 0.139871385983612, 5, 44]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 200, 0, 0.0, 1267.845, 5429.800000000001, 6500.699999999999, 15134.910000000007, 2.814562546616192, 69.87107544434906, 2.4358059851672555, 2, 16351]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 200, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
