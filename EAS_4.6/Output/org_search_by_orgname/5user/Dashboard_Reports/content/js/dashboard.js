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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "684 /escm/customer/setSearchBy"]}, {"isController": false, "data": [0.4, 500, 1500, "681 /escm/customer/index"]}, {"isController": false, "data": [0.9, 500, 1500, "675 /escm/login/auth"]}, {"isController": true, "data": [0.0, 500, 1500, "46_Org_search_by_orgname_withcache"]}, {"isController": false, "data": [1.0, 500, 1500, "229 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "688 /escm/messages"]}, {"isController": false, "data": [0.4, 500, 1500, "680 /escm/dashboard/myAccountInfo"]}, {"isController": true, "data": [0.0, 500, 1500, "List_organizations_with_cache"]}, {"isController": false, "data": [0.6, 500, 1500, "227 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": false, "data": [0.7, 500, 1500, "685 /escm/customer/listByCriteria"]}, {"isController": false, "data": [0.4, 500, 1500, "676 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [0.4, 500, 1500, "682 /escm/customer/list"]}, {"isController": false, "data": [1.0, 500, 1500, "686 /escm/messages"]}, {"isController": false, "data": [0.0, 500, 1500, "226 /escm/customer/listByCriteria"]}, {"isController": false, "data": [1.0, 500, 1500, "689 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "228 /escm/messages"]}, {"isController": true, "data": [0.0, 500, 1500, "SP_user_login_46_with_cache"]}, {"isController": false, "data": [0.3, 500, 1500, "687 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": true, "data": [0.9, 500, 1500, "Hit_the_portal_with-cache"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.5789473684210527, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["684 /escm/customer/setSearchBy", 5, 0, 0.0, 22.6, 27.0, 27.0, 27.0, 185.18518518518516, 82.64612268518519, 0.0, 16, 27]}, {"isController": false, "data": ["681 /escm/customer/index", 5, 0, 0.0, 1362.4, 2367.0, 2367.0, 2367.0, 0.0801706030432761, 1.2562984030015873, 0.0, 943, 2367]}, {"isController": false, "data": ["675 /escm/login/auth", 5, 0, 0.0, 181.0, 629.0, 629.0, 629.0, 7.949125596184419, 46.390600158982515, 0.0, 55, 629]}, {"isController": true, "data": ["46_Org_search_by_orgname_withcache", 5, 0, 0.0, 3014.8, 3193.0, 3193.0, 3193.0, 1.5659254619480112, 68.34683536251174, 0.0, 2754, 3193]}, {"isController": false, "data": ["229 /escm/messages", 5, 0, 0.0, 15.4, 19.0, 19.0, 19.0, 263.1578947368421, 118.47245065789474, 0.0, 12, 19]}, {"isController": false, "data": ["688 /escm/messages", 5, 0, 0.0, 19.8, 23.0, 23.0, 23.0, 217.3913043478261, 97.86854619565217, 0.0, 15, 23]}, {"isController": false, "data": ["680 /escm/dashboard/myAccountInfo", 5, 0, 0.0, 1336.8, 2302.0, 2302.0, 2302.0, 0.08025424544958427, 0.6618467304420403, 0.0, 919, 2302]}, {"isController": true, "data": ["List_organizations_with_cache", 5, 0, 0.0, 4350.2, 4955.0, 4955.0, 4955.0, 0.07754703227507484, 5.924048013245033, 0.0, 2805, 4955]}, {"isController": false, "data": ["227 /escm/customer/renderCustomerOrganizationDetails", 5, 0, 0.0, 625.2, 744.0, 744.0, 744.0, 6.720430107526882, 262.62705813172045, 0.0, 458, 744]}, {"isController": false, "data": ["685 /escm/customer/listByCriteria", 5, 0, 0.0, 554.2, 787.0, 787.0, 787.0, 6.353240152477763, 27.379735149301144, 0.0, 297, 787]}, {"isController": false, "data": ["676 /escm/login/doAuth?id=loginform", 5, 0, 0.0, 1351.6, 1665.0, 1665.0, 1665.0, 3.003003003003003, 27.411200262762762, 0.0, 1142, 1665]}, {"isController": false, "data": ["682 /escm/customer/list", 5, 0, 0.0, 1232.0, 2218.0, 2218.0, 2218.0, 0.08036259603330226, 1.2384315531678936, 0.0, 825, 2218]}, {"isController": false, "data": ["686 /escm/messages", 5, 0, 0.0, 16.6, 19.0, 19.0, 19.0, 263.1578947368421, 118.47245065789474, 0.0, 14, 19]}, {"isController": false, "data": ["226 /escm/customer/listByCriteria", 5, 0, 0.0, 2360.4, 2514.0, 2514.0, 2514.0, 1.988862370723946, 7.293142775457439, 0.0, 2188, 2514]}, {"isController": false, "data": ["689 /escm/messages", 5, 0, 0.0, 15.0, 16.0, 16.0, 16.0, 312.5, 140.68603515625, 0.0, 14, 16]}, {"isController": false, "data": ["228 /escm/messages", 5, 0, 0.0, 13.8, 15.0, 15.0, 15.0, 333.3333333333333, 150.06510416666669, 0.0, 13, 15]}, {"isController": true, "data": ["SP_user_login_46_with_cache", 5, 0, 0.0, 2688.4, 3967.0, 3967.0, 3967.0, 1.2603982858583311, 21.899174045248298, 0.0, 2103, 3967]}, {"isController": false, "data": ["687 /escm/customer/renderCustomerOrganizationDetails", 5, 0, 0.0, 1127.6, 1748.0, 1748.0, 1748.0, 2.860411899313501, 112.1443480048627, 0.0, 677, 1748]}, {"isController": true, "data": ["Hit_the_portal_with-cache", 5, 0, 0.0, 181.0, 629.0, 629.0, 629.0, 7.949125596184419, 46.390600158982515, 0.0, 55, 629]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 75, 0, 0.0, 682.2933333333332, 2200.0, 2371.4, 2514.0, 1.1997312601977157, 11.457433534888185, 0.0, 12, 2514]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 75, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
