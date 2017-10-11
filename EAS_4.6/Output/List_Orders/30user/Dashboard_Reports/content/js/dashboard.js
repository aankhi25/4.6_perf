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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [0.08333333333333333, 500, 1500, "158 /escm/login/doAuth?id=loginform"]}, {"isController": true, "data": [0.45, 500, 1500, "New_hit_the_portal_4.6"]}, {"isController": false, "data": [1.0, 500, 1500, "70 /escm/recentItem"]}, {"isController": true, "data": [0.0, 500, 1500, "new_List_Orders"]}, {"isController": false, "data": [0.05, 500, 1500, "59 /escm/order/showOrderDetail"]}, {"isController": true, "data": [0.0, 500, 1500, "new_SP_user_login_4.6"]}, {"isController": false, "data": [1.0, 500, 1500, "56 /escm/images/sidebar-bg.jpg"]}, {"isController": false, "data": [1.0, 500, 1500, "51 /escm/images/favicon.ico"]}, {"isController": false, "data": [0.8166666666666667, 500, 1500, "88 /escm/login/auth"]}, {"isController": false, "data": [1.0, 500, 1500, "184 /escm/images/favicon.ico"]}, {"isController": false, "data": [0.0, 500, 1500, "1 /escm/order/index"]}, {"isController": false, "data": [1.0, 500, 1500, "69 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "93 /escm/images/favicon.ico"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.5692307692307692, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["158 /escm/login/doAuth?id=loginform", 30, 0, 0.0, 6351.466666666667, 12594.400000000001, 13809.85, 14158.0, 0.4045416543056717, 3.8009927915733974, 1.2778617529464118, 1135, 14158]}, {"isController": true, "data": ["New_hit_the_portal_4.6", 30, 0, 0.0, 1089.6333333333334, 1599.3000000000002, 2069.2999999999997, 2330.0, 0.4849974133471288, 370.6739556894238, 3.324884611032074, 450, 2330]}, {"isController": false, "data": ["70 /escm/recentItem", 30, 0, 0.0, 14.700000000000001, 23.700000000000006, 53.44999999999996, 87.0, 0.4992760497278945, 0.1662628251535274, 0.28133035223925307, 7, 87]}, {"isController": true, "data": ["new_List_Orders", 30, 0, 0.0, 12728.800000000003, 20028.8, 20131.55, 20208.0, 0.3857032656209823, 280.4889517107547, 16.758128897210078, 5547, 20208]}, {"isController": false, "data": ["59 /escm/order/showOrderDetail", 30, 0, 0.0, 3607.7000000000007, 12276.300000000003, 13971.05, 13976.0, 0.4798694755026633, 10.490896476158484, 0.29195183909976485, 1357, 13976]}, {"isController": true, "data": ["new_SP_user_login_4.6", 30, 0, 0.0, 7968.566666666667, 14157.500000000002, 14865.85, 15203.0, 0.40418193576201766, 239.72184546524707, 15.264025534193792, 2152, 15203]}, {"isController": false, "data": ["56 /escm/images/sidebar-bg.jpg", 30, 0, 0.0, 12.766666666666666, 28.60000000000001, 45.39999999999999, 52.0, 0.4996668887408395, 0.8309889760992671, 0.27325532978014655, 3, 52]}, {"isController": false, "data": ["51 /escm/images/favicon.ico", 30, 0, 0.0, 14.000000000000002, 29.700000000000028, 86.94999999999999, 93.0, 0.49985004498650404, 0.061016851194641605, 0.29434529016295113, 2, 93]}, {"isController": false, "data": ["88 /escm/login/auth", 30, 0, 0.0, 389.53333333333336, 846.3000000000002, 1132.8, 1190.0, 0.49299130691995463, 2.8770664552281726, 0.17765018774752273, 36, 1190]}, {"isController": false, "data": ["184 /escm/images/favicon.ico", 30, 0, 0.0, 11.233333333333334, 35.50000000000003, 52.45, 53.0, 0.49955872312790367, 0.06098128944432418, 0.31856625605714955, 3, 53]}, {"isController": false, "data": ["1 /escm/order/index", 30, 0, 0.0, 7291.5666666666675, 15334.4, 16393.4, 16587.0, 0.40548211823858565, 8.78036416940367, 0.48824165213689075, 1544, 16587]}, {"isController": false, "data": ["69 /escm/messages", 30, 0, 0.0, 18.16666666666666, 39.70000000000003, 57.49999999999999, 63.0, 0.49955872312790367, 0.22489899547066758, 0.28051393144389125, 7, 63]}, {"isController": false, "data": ["93 /escm/images/favicon.ico", 30, 0, 0.0, 26.1, 48.10000000000002, 152.94999999999996, 181.0, 0.49984171678968325, 93.40743269839551, 0.2098944709175428, 4, 181]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 300, 0, 0.0, 1773.7233333333338, 8366.400000000003, 11482.599999999999, 15356.540000000003, 4.045416543056716, 100.45267052273523, 3.4992853097440597, 2, 16587]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 300, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
