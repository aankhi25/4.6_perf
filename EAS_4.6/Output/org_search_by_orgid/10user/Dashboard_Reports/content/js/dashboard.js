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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "99 /escm/images/favicon.ico"]}, {"isController": false, "data": [0.45, 500, 1500, "385 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": false, "data": [1.0, 500, 1500, "130 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "131 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "374 /escm/images/favicon.ico"]}, {"isController": false, "data": [1.0, 500, 1500, "406 /escm/messages"]}, {"isController": false, "data": [0.7, 500, 1500, "128 /escm/customer/listByCriteria"]}, {"isController": false, "data": [1.0, 500, 1500, "381 /escm/customer/setSearchBy"]}, {"isController": false, "data": [0.0, 500, 1500, "65 /escm/login/doAuth?id=loginform"]}, {"isController": true, "data": [0.0, 500, 1500, "org_search_by_orgid"]}, {"isController": false, "data": [0.95, 500, 1500, "33 /escm/login/auth"]}, {"isController": true, "data": [0.0, 500, 1500, "Hit_the_portal"]}, {"isController": false, "data": [1.0, 500, 1500, "43 /escm/images/favicon.ico"]}, {"isController": true, "data": [0.0, 500, 1500, "sp_userlogin_46"]}, {"isController": false, "data": [0.0, 500, 1500, "129 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": false, "data": [0.7, 500, 1500, "382 /escm/customer/listByCriteria"]}, {"isController": false, "data": [1.0, 500, 1500, "384 /escm/messages"]}, {"isController": false, "data": [0.3, 500, 1500, "324 /escm/customer/index"]}, {"isController": true, "data": [0.0, 500, 1500, "List_Organizations"]}, {"isController": false, "data": [1.0, 500, 1500, "405 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.605, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["99 /escm/images/favicon.ico", 10, 0, 0.0, 16.6, 41.60000000000001, 43.0, 43.0, 232.5581395348837, 28.388444767441865, 0.0, 3, 43]}, {"isController": false, "data": ["385 /escm/customer/renderCustomerOrganizationDetails", 10, 0, 0.0, 899.2, 2077.5, 2112.0, 2112.0, 4.734848484848485, 183.54196259469697, 0.0, 404, 2112]}, {"isController": false, "data": ["130 /escm/messages", 10, 0, 0.0, 13.999999999999998, 33.400000000000006, 35.0, 35.0, 285.7142857142857, 128.62723214285714, 0.0, 8, 35]}, {"isController": false, "data": ["131 /escm/messages", 10, 0, 0.0, 9.299999999999999, 16.9, 17.0, 17.0, 588.2352941176471, 264.82077205882354, 0.0, 6, 17]}, {"isController": false, "data": ["374 /escm/images/favicon.ico", 10, 0, 0.0, 3.9, 7.700000000000001, 8.0, 8.0, 1250.0, 152.587890625, 0.0, 2, 8]}, {"isController": false, "data": ["406 /escm/messages", 10, 0, 0.0, 10.6, 33.50000000000001, 36.0, 36.0, 277.77777777777777, 125.05425347222223, 0.0, 6, 36]}, {"isController": false, "data": ["128 /escm/customer/listByCriteria", 10, 0, 0.0, 670.5, 937.7, 946.0, 946.0, 10.570824524312897, 34.42744119978858, 0.0, 410, 946]}, {"isController": false, "data": ["381 /escm/customer/setSearchBy", 10, 0, 0.0, 14.200000000000001, 21.700000000000003, 22.0, 22.0, 454.5454545454545, 202.85866477272728, 0.0, 9, 22]}, {"isController": false, "data": ["65 /escm/login/doAuth?id=loginform", 10, 0, 0.0, 8611.6, 12485.0, 12582.0, 12582.0, 0.1475600938482197, 1.3800903621124703, 0.0, 6185, 12582]}, {"isController": true, "data": ["org_search_by_orgid", 10, 0, 0.0, 3183.2000000000003, 3920.9, 3949.0, 3949.0, 2.5322866548493286, 373.83252682641177, 0.0, 2359, 3949]}, {"isController": false, "data": ["33 /escm/login/auth", 10, 0, 0.0, 96.7, 460.70000000000016, 502.0, 502.0, 0.16641981061425554, 0.8493261037793939, 0.0, 33, 502]}, {"isController": true, "data": ["Hit_the_portal", 10, 10, 100.0, 364.29999999999995, 743.4000000000001, 782.0, 782.0, 0.16557387906483872, 111.89980762384926, 0.0, 294, 782]}, {"isController": false, "data": ["43 /escm/images/favicon.ico", 10, 0, 0.0, 6.5, 8.9, 9.0, 9.0, 0.16664167041610425, 31.140999423003215, 0.0, 5, 9]}, {"isController": true, "data": ["sp_userlogin_46", 10, 0, 0.0, 9634.0, 13533.2, 13621.0, 13621.0, 0.14498426920679108, 65.13633505139693, 0.0, 6761, 13621]}, {"isController": false, "data": ["129 /escm/customer/renderCustomerOrganizationDetails", 10, 0, 0.0, 2485.7, 3375.0, 3431.0, 3431.0, 2.914602156805596, 417.8056575160303, 0.0, 1833, 3431]}, {"isController": false, "data": ["382 /escm/customer/listByCriteria", 10, 0, 0.0, 760.7, 1139.6, 1142.0, 1142.0, 8.756567425569177, 35.74458187390543, 0.0, 229, 1142]}, {"isController": false, "data": ["384 /escm/messages", 10, 0, 0.0, 13.1, 24.900000000000006, 26.0, 26.0, 384.61538461538464, 173.15204326923077, 0.0, 8, 26]}, {"isController": false, "data": ["324 /escm/customer/index", 10, 0, 0.0, 1768.7, 4724.200000000001, 4932.0, 4932.0, 2.02757502027575, 20.52761303730738, 0.0, 669, 4932]}, {"isController": true, "data": ["List_Organizations", 10, 0, 0.0, 4590.700000000001, 6948.700000000001, 7197.0, 7197.0, 1.3894678338196471, 848.4174721238015, 0.0, 3706, 7197]}, {"isController": false, "data": ["405 /escm/messages", 10, 0, 0.0, 9.399999999999999, 17.0, 17.0, 17.0, 588.2352941176471, 264.82077205882354, 0.0, 6, 17]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 160, 0, 0.0, 961.9187499999999, 2476.6000000000004, 6561.599999999996, 11990.299999999987, 2.360961501571515, 59.5918412871298, 0.0, 2, 12582]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 160, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
