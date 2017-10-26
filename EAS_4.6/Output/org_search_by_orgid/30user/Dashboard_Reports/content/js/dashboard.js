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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "684 /escm/customer/setSearchBy"]}, {"isController": false, "data": [0.06666666666666667, 500, 1500, "681 /escm/customer/index"]}, {"isController": false, "data": [0.7833333333333333, 500, 1500, "11 /escm/customer/listByCriteria"]}, {"isController": false, "data": [0.9833333333333333, 500, 1500, "675 /escm/login/auth"]}, {"isController": false, "data": [1.0, 500, 1500, "688 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "14 /escm/messages"]}, {"isController": false, "data": [0.08333333333333333, 500, 1500, "680 /escm/dashboard/myAccountInfo"]}, {"isController": true, "data": [0.0, 500, 1500, "List_organizations_with_cache"]}, {"isController": false, "data": [0.9, 500, 1500, "685 /escm/customer/listByCriteria"]}, {"isController": false, "data": [0.05, 500, 1500, "12 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": false, "data": [0.05, 500, 1500, "676 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [0.06666666666666667, 500, 1500, "682 /escm/customer/list"]}, {"isController": false, "data": [1.0, 500, 1500, "13 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "686 /escm/messages"]}, {"isController": true, "data": [0.0, 500, 1500, "organization_search_by_organization_id_with_cache"]}, {"isController": false, "data": [1.0, 500, 1500, "689 /escm/messages"]}, {"isController": true, "data": [0.0, 500, 1500, "SP_user_login_46_with_cache"]}, {"isController": false, "data": [0.75, 500, 1500, "687 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": true, "data": [0.9833333333333333, 500, 1500, "Hit_the_portal_with-cache"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.5640350877192982, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["684 /escm/customer/setSearchBy", 30, 0, 0.0, 17.6, 24.0, 29.249999999999996, 32.0, 0.49973347547974417, 0.22302558427172176, 0.0, 10, 32]}, {"isController": false, "data": ["681 /escm/customer/index", 30, 0, 0.0, 3266.1333333333328, 4760.7, 4906.15, 4921.0, 0.46210009087968457, 7.241523592135056, 0.0, 805, 4921]}, {"isController": false, "data": ["11 /escm/customer/listByCriteria", 30, 0, 0.0, 509.53333333333336, 678.9000000000001, 701.6999999999999, 716.0, 0.4950086626515964, 1.6136122225888954, 0.0, 397, 716]}, {"isController": false, "data": ["675 /escm/login/auth", 30, 0, 0.0, 112.63333333333334, 361.10000000000025, 505.5499999999999, 582.0, 0.4996668887408395, 2.9160247335109926, 0.0, 35, 582]}, {"isController": false, "data": ["688 /escm/messages", 30, 0, 0.0, 12.76666666666667, 25.800000000000004, 33.39999999999999, 40.0, 0.4997834271815546, 0.22500015618232097, 0.0, 7, 40]}, {"isController": false, "data": ["14 /escm/messages", 30, 0, 0.0, 11.466666666666669, 25.400000000000013, 35.699999999999996, 39.0, 0.4996752111127767, 0.22495143781541996, 0.0, 7, 39]}, {"isController": false, "data": ["680 /escm/dashboard/myAccountInfo", 30, 0, 0.0, 3248.0, 4754.2, 4917.349999999999, 5084.0, 0.4609427816360396, 3.7998820514642615, 0.0, 744, 5084]}, {"isController": true, "data": ["List_organizations_with_cache", 30, 0, 0.0, 7304.366666666667, 9898.7, 10157.949999999999, 10351.0, 0.4329754069968826, 33.07674184653187, 0.0, 3402, 10351]}, {"isController": false, "data": ["685 /escm/customer/listByCriteria", 30, 0, 0.0, 363.5333333333334, 563.1, 613.55, 657.0, 0.4952292911618079, 2.134225451071346, 0.0, 167, 657]}, {"isController": false, "data": ["12 /escm/customer/renderCustomerOrganizationDetails", 30, 0, 0.0, 1842.7000000000003, 2300.2000000000003, 2610.7, 2713.0, 0.48140956721279904, 69.31241550259159, 0.0, 1343, 2713]}, {"isController": false, "data": ["676 /escm/login/doAuth?id=loginform", 30, 0, 0.0, 3260.6666666666665, 4859.9, 4933.0, 4944.0, 0.4655710228595372, 4.359136031123423, 0.0, 1006, 4944]}, {"isController": false, "data": ["682 /escm/customer/list", 30, 0, 0.0, 3062.8999999999996, 4631.8, 4853.3, 4982.0, 0.46166630759287186, 7.114785753170109, 0.0, 1191, 4982]}, {"isController": false, "data": ["13 /escm/messages", 30, 0, 0.0, 18.499999999999996, 47.800000000000004, 59.09999999999999, 69.0, 0.49960031974420466, 0.22491772207234212, 0.0, 8, 69]}, {"isController": false, "data": ["686 /escm/messages", 30, 0, 0.0, 12.900000000000002, 22.700000000000006, 39.899999999999984, 52.0, 0.49956704189702256, 0.22490274054153067, 0.0, 7, 52]}, {"isController": true, "data": ["organization_search_by_organization_id_with_cache", 30, 0, 0.0, 2382.233333333334, 2826.8, 3149.7999999999997, 3207.0, 0.47738773431781295, 70.71936737174182, 0.0, 1824, 3207]}, {"isController": false, "data": ["689 /escm/messages", 30, 0, 0.0, 13.666666666666664, 32.30000000000001, 44.0, 44.0, 0.49963360202518153, 0.22493270559922723, 0.0, 7, 44]}, {"isController": true, "data": ["SP_user_login_46_with_cache", 30, 0, 0.0, 6508.666666666665, 9565.0, 9812.9, 9946.0, 0.4366875791496237, 7.688629701669602, 0.0, 1841, 9946]}, {"isController": false, "data": ["687 /escm/customer/renderCustomerOrganizationDetails", 30, 0, 0.0, 554.8333333333333, 836.5, 876.9, 878.0, 0.4933074620975433, 19.340414522149505, 0.0, 324, 878]}, {"isController": true, "data": ["Hit_the_portal_with-cache", 30, 0, 0.0, 112.63333333333334, 361.10000000000025, 505.5499999999999, 582.0, 0.4996668887408395, 2.9160247335109926, 0.0, 35, 582]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 450, 0, 0.0, 1087.188888888889, 4054.7000000000003, 4536.65, 4922.47, 6.914141724540594, 114.30224126225339, 0.0, 7, 5084]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 450, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
