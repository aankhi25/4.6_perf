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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "684 /escm/customer/setSearchBy"]}, {"isController": false, "data": [0.45, 500, 1500, "681 /escm/customer/index"]}, {"isController": false, "data": [0.95, 500, 1500, "675 /escm/login/auth"]}, {"isController": true, "data": [0.0, 500, 1500, "46_Org_search_by_orgname_withcache"]}, {"isController": false, "data": [1.0, 500, 1500, "229 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "688 /escm/messages"]}, {"isController": false, "data": [0.3, 500, 1500, "680 /escm/dashboard/myAccountInfo"]}, {"isController": true, "data": [0.0, 500, 1500, "List_organizations_with_cache"]}, {"isController": false, "data": [0.75, 500, 1500, "227 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": false, "data": [0.95, 500, 1500, "685 /escm/customer/listByCriteria"]}, {"isController": false, "data": [0.15, 500, 1500, "676 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [0.35, 500, 1500, "682 /escm/customer/list"]}, {"isController": false, "data": [1.0, 500, 1500, "686 /escm/messages"]}, {"isController": false, "data": [0.0, 500, 1500, "226 /escm/customer/listByCriteria"]}, {"isController": false, "data": [1.0, 500, 1500, "689 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "228 /escm/messages"]}, {"isController": true, "data": [0.0, 500, 1500, "SP_user_login_46_with_cache"]}, {"isController": false, "data": [0.55, 500, 1500, "687 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": true, "data": [0.95, 500, 1500, "Hit_the_portal_with-cache"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.6, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["684 /escm/customer/setSearchBy", 10, 0, 0.0, 25.599999999999998, 58.10000000000001, 60.0, 60.0, 0.1665001665001665, 0.07430720321345322, 0.0, 11, 60]}, {"isController": false, "data": ["681 /escm/customer/index", 10, 0, 0.0, 1344.0, 2669.7000000000007, 2804.0, 2804.0, 0.15922552703649448, 2.4951604147426916, 0.0, 864, 2804]}, {"isController": false, "data": ["675 /escm/login/auth", 10, 0, 0.0, 145.8, 581.3000000000002, 612.0, 612.0, 0.1662510390689942, 0.9702306733167082, 0.0, 42, 612]}, {"isController": true, "data": ["46_Org_search_by_orgname_withcache", 10, 0, 0.0, 3173.7, 3893.2, 3902.0, 3902.0, 0.15834059061040298, 6.910855484522207, 0.0, 2808, 3902]}, {"isController": false, "data": ["229 /escm/messages", 10, 0, 0.0, 11.9, 13.9, 14.0, 14.0, 714.2857142857143, 321.56808035714283, 0.0, 9, 14]}, {"isController": false, "data": ["688 /escm/messages", 10, 0, 0.0, 16.200000000000003, 32.400000000000006, 34.0, 34.0, 0.16657227571043076, 0.07499005771729353, 0.0, 10, 34]}, {"isController": false, "data": ["680 /escm/dashboard/myAccountInfo", 10, 0, 0.0, 1575.3, 2731.8, 2748.0, 2748.0, 0.15978014252388714, 1.317296774638098, 0.0, 930, 2748]}, {"isController": true, "data": ["List_organizations_with_cache", 10, 0, 0.0, 3873.6, 5412.8, 5442.0, 5442.0, 0.15280706579872255, 11.673400324906025, 0.0, 2693, 5442]}, {"isController": false, "data": ["227 /escm/customer/renderCustomerOrganizationDetails", 10, 0, 0.0, 565.2, 1214.9, 1279.0, 1279.0, 7.818608287724785, 305.53655199374515, 0.0, 390, 1279]}, {"isController": false, "data": ["685 /escm/customer/listByCriteria", 10, 0, 0.0, 371.70000000000005, 641.4000000000001, 661.0, 661.0, 0.16485056296467251, 0.7104350921514647, 0.0, 236, 661]}, {"isController": false, "data": ["676 /escm/login/doAuth?id=loginform", 10, 0, 0.0, 1859.6999999999998, 3099.5, 3104.0, 3104.0, 0.1584685598377282, 1.4839249740507734, 0.0, 1217, 3104]}, {"isController": false, "data": ["682 /escm/customer/list", 10, 0, 0.0, 1387.0, 2356.0, 2430.0, 2430.0, 0.1601794009290405, 2.4685147365048854, 0.0, 840, 2430]}, {"isController": false, "data": ["686 /escm/messages", 10, 0, 0.0, 24.200000000000003, 81.30000000000001, 86.0, 86.0, 0.1665584037042589, 0.07498381260513999, 0.0, 10, 86]}, {"isController": false, "data": ["226 /escm/customer/listByCriteria", 10, 0, 0.0, 2583.5, 3180.1000000000004, 3238.0, 3238.0, 0.1595939928821079, 0.5852299250706203, 0.0, 2229, 3238]}, {"isController": false, "data": ["689 /escm/messages", 10, 0, 0.0, 19.1, 38.0, 39.0, 39.0, 0.1665584037042589, 0.07498381260513999, 0.0, 11, 39]}, {"isController": false, "data": ["228 /escm/messages", 10, 0, 0.0, 13.1, 19.700000000000003, 20.0, 20.0, 500.0, 225.09765625, 0.0, 10, 20]}, {"isController": true, "data": ["SP_user_login_46_with_cache", 10, 0, 0.0, 3435.1, 4490.0, 4501.0, 4501.0, 0.15545330182813083, 2.7373140389876878, 0.0, 2221, 4501]}, {"isController": false, "data": ["687 /escm/customer/renderCustomerOrganizationDetails", 10, 0, 0.0, 685.8, 1164.7, 1191.0, 1191.0, 0.16342272556421694, 6.40700072314556, 0.0, 498, 1191]}, {"isController": true, "data": ["Hit_the_portal_with-cache", 10, 0, 0.0, 145.8, 581.3000000000002, 612.0, 612.0, 0.1662510390689942, 0.9702306733167082, 0.0, 42, 612]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 150, 0, 0.0, 708.5399999999998, 2409.900000000001, 2624.35, 3169.660000000001, 2.377028397565923, 22.737561084677676, 0.0, 9, 3238]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 150, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
