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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "684 /escm/customer/setSearchBy"]}, {"isController": false, "data": [0.15, 500, 1500, "681 /escm/customer/index"]}, {"isController": false, "data": [0.6, 500, 1500, "11 /escm/customer/listByCriteria"]}, {"isController": false, "data": [0.925, 500, 1500, "675 /escm/login/auth"]}, {"isController": false, "data": [1.0, 500, 1500, "688 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "14 /escm/messages"]}, {"isController": false, "data": [0.2, 500, 1500, "680 /escm/dashboard/myAccountInfo"]}, {"isController": true, "data": [0.0, 500, 1500, "List_organizations_with_cache"]}, {"isController": false, "data": [0.825, 500, 1500, "685 /escm/customer/listByCriteria"]}, {"isController": false, "data": [0.0, 500, 1500, "12 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": false, "data": [0.125, 500, 1500, "676 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [0.175, 500, 1500, "682 /escm/customer/list"]}, {"isController": false, "data": [1.0, 500, 1500, "13 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "686 /escm/messages"]}, {"isController": true, "data": [0.0, 500, 1500, "organization_search_by_organization_id_with_cache"]}, {"isController": false, "data": [1.0, 500, 1500, "689 /escm/messages"]}, {"isController": true, "data": [0.0, 500, 1500, "SP_user_login_46_with_cache"]}, {"isController": false, "data": [0.55, 500, 1500, "687 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": true, "data": [0.925, 500, 1500, "Hit_the_portal_with-cache"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.5513157894736842, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["684 /escm/customer/setSearchBy", 20, 0, 0.0, 19.05, 31.800000000000004, 37.699999999999996, 38.0, 526.3157894736842, 234.8889802631579, 0.0, 9, 38]}, {"isController": false, "data": ["681 /escm/customer/index", 20, 0, 0.0, 2045.4499999999998, 3146.6, 3173.7, 3175.0, 0.3165809259992085, 4.961061164424219, 0.0, 753, 3175]}, {"isController": false, "data": ["11 /escm/customer/listByCriteria", 20, 0, 0.0, 545.2, 622.0, 668.65, 671.0, 29.806259314456035, 97.16141952309985, 0.0, 459, 671]}, {"isController": false, "data": ["675 /escm/login/auth", 20, 0, 0.0, 169.75, 713.5000000000005, 896.5499999999998, 905.0, 0.3283802643461128, 1.9164066989573927, 0.0, 37, 905]}, {"isController": false, "data": ["688 /escm/messages", 20, 0, 0.0, 24.95, 67.10000000000007, 124.14999999999996, 127.0, 157.48031496062993, 70.89689960629921, 0.0, 7, 127]}, {"isController": false, "data": ["14 /escm/messages", 20, 0, 0.0, 12.300000000000002, 20.900000000000002, 23.849999999999998, 24.0, 833.3333333333334, 375.1627604166667, 0.0, 7, 24]}, {"isController": false, "data": ["680 /escm/dashboard/myAccountInfo", 20, 0, 0.0, 2202.0499999999997, 3613.4, 3743.85, 3750.0, 0.3137254901960784, 2.5863664215686275, 0.0, 754, 3750]}, {"isController": true, "data": ["List_organizations_with_cache", 20, 0, 0.0, 5396.400000000001, 7630.6, 7963.55, 7980.0, 0.2942041776993233, 22.475202380295674, 0.0, 2555, 7980]}, {"isController": false, "data": ["685 /escm/customer/listByCriteria", 20, 0, 0.0, 506.3, 899.0, 1142.2999999999997, 1155.0, 17.316017316017316, 74.62459415584415, 0.0, 251, 1155]}, {"isController": false, "data": ["12 /escm/customer/renderCustomerOrganizationDetails", 20, 0, 0.0, 2040.8500000000001, 2665.5000000000005, 2696.5, 2697.0, 7.415647015202077, 1067.688056173526, 0.0, 1632, 2697]}, {"isController": false, "data": ["676 /escm/login/doAuth?id=loginform", 20, 0, 0.0, 2252.75, 3436.1, 4050.95, 4083.0, 0.31209525147074885, 2.921976552868936, 0.0, 1024, 4083]}, {"isController": false, "data": ["682 /escm/customer/list", 20, 0, 0.0, 2097.4, 3332.2000000000007, 3884.2, 3912.0, 5.112474437627812, 78.78727513100716, 0.0, 784, 3912]}, {"isController": false, "data": ["13 /escm/messages", 20, 0, 0.0, 15.45, 28.900000000000002, 39.44999999999999, 40.0, 500.0, 225.09765625, 0.0, 9, 40]}, {"isController": false, "data": ["686 /escm/messages", 20, 0, 0.0, 18.400000000000002, 35.500000000000014, 65.44999999999997, 67.0, 298.5074626865671, 134.3866604477612, 0.0, 8, 67]}, {"isController": true, "data": ["organization_search_by_organization_id_with_cache", 20, 0, 0.0, 2613.8, 3248.6000000000004, 3337.25, 3341.0, 5.986231667165519, 886.787731966477, 0.0, 2124, 3341]}, {"isController": false, "data": ["689 /escm/messages", 20, 0, 0.0, 22.55, 35.800000000000026, 170.9499999999999, 178.0, 112.35955056179775, 50.58374297752809, 0.0, 7, 178]}, {"isController": true, "data": ["SP_user_login_46_with_cache", 20, 0, 0.0, 4454.8, 6702.5, 7531.4, 7574.0, 0.2959718234824045, 5.211026175933052, 0.0, 1809, 7574]}, {"isController": false, "data": ["687 /escm/customer/renderCustomerOrganizationDetails", 20, 0, 0.0, 662.3, 909.7, 990.8, 995.0, 20.100502512562816, 788.0447157663317, 0.0, 399, 995]}, {"isController": true, "data": ["Hit_the_portal_with-cache", 20, 0, 0.0, 169.75, 713.5000000000005, 896.5499999999998, 905.0, 0.3283802643461128, 1.9164066989573927, 0.0, 37, 905]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 300, 0, 0.0, 842.3166666666664, 2711.7000000000003, 3147.7999999999997, 3748.7700000000013, 4.681428772061233, 77.39136281268043, 0.0, 7, 4083]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 300, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
