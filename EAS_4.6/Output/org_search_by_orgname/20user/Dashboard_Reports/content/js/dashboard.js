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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "684 /escm/customer/setSearchBy"]}, {"isController": false, "data": [0.25, 500, 1500, "681 /escm/customer/index"]}, {"isController": false, "data": [0.975, 500, 1500, "675 /escm/login/auth"]}, {"isController": true, "data": [0.0, 500, 1500, "46_Org_search_by_orgname_withcache"]}, {"isController": false, "data": [1.0, 500, 1500, "229 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "688 /escm/messages"]}, {"isController": false, "data": [0.2, 500, 1500, "680 /escm/dashboard/myAccountInfo"]}, {"isController": true, "data": [0.0, 500, 1500, "List_organizations_with_cache"]}, {"isController": false, "data": [0.725, 500, 1500, "227 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": false, "data": [0.975, 500, 1500, "685 /escm/customer/listByCriteria"]}, {"isController": false, "data": [0.2, 500, 1500, "676 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [0.325, 500, 1500, "682 /escm/customer/list"]}, {"isController": false, "data": [1.0, 500, 1500, "686 /escm/messages"]}, {"isController": false, "data": [0.0, 500, 1500, "226 /escm/customer/listByCriteria"]}, {"isController": false, "data": [1.0, 500, 1500, "689 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "228 /escm/messages"]}, {"isController": true, "data": [0.0, 500, 1500, "SP_user_login_46_with_cache"]}, {"isController": false, "data": [0.65, 500, 1500, "687 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": true, "data": [0.975, 500, 1500, "Hit_the_portal_with-cache"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.593421052631579, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["684 /escm/customer/setSearchBy", 20, 0, 0.0, 21.2, 37.60000000000001, 45.599999999999994, 46.0, 434.7826086956522, 194.03872282608697, 0.0, 11, 46]}, {"isController": false, "data": ["681 /escm/customer/index", 20, 0, 0.0, 1597.0000000000002, 2866.500000000001, 3020.1, 3026.0, 6.609385327164574, 103.57500619629874, 0.0, 757, 3026]}, {"isController": false, "data": ["675 /escm/login/auth", 20, 0, 0.0, 144.24999999999997, 468.90000000000043, 742.5999999999998, 756.0, 26.455026455026452, 154.38988095238096, 0.0, 36, 756]}, {"isController": true, "data": ["46_Org_search_by_orgname_withcache", 20, 0, 0.0, 3146.7999999999997, 4697.9000000000015, 4831.55, 4834.0, 4.137360364087712, 180.5788102503103, 0.0, 2659, 4834]}, {"isController": false, "data": ["229 /escm/messages", 20, 0, 0.0, 13.35, 22.700000000000006, 35.349999999999994, 36.0, 555.5555555555555, 250.10850694444446, 0.0, 8, 36]}, {"isController": false, "data": ["688 /escm/messages", 20, 0, 0.0, 23.549999999999997, 71.50000000000007, 99.69999999999999, 101.0, 198.01980198019803, 89.14758663366337, 0.0, 9, 101]}, {"isController": false, "data": ["680 /escm/dashboard/myAccountInfo", 20, 0, 0.0, 1663.6000000000001, 2674.6000000000004, 2749.4, 2752.0, 7.267441860465116, 59.508922488190414, 0.0, 767, 2752]}, {"isController": true, "data": ["List_organizations_with_cache", 20, 0, 0.0, 4030.8000000000006, 5484.1, 5757.75, 5772.0, 3.465003465003465, 264.7056235923423, 0.0, 2403, 5772]}, {"isController": false, "data": ["227 /escm/customer/renderCustomerOrganizationDetails", 20, 0, 0.0, 512.15, 721.8000000000002, 806.8499999999999, 811.0, 24.66091245376079, 963.711852651048, 0.0, 342, 811]}, {"isController": false, "data": ["685 /escm/customer/listByCriteria", 20, 0, 0.0, 332.1499999999999, 468.90000000000003, 532.6999999999999, 536.0, 37.31343283582089, 160.8048624067164, 0.0, 222, 536]}, {"isController": false, "data": ["676 /escm/login/doAuth?id=loginform", 20, 0, 0.0, 1933.5500000000002, 3111.8000000000006, 3588.4999999999995, 3612.0, 5.537098560354375, 51.86947371608527, 0.0, 942, 3612]}, {"isController": false, "data": ["682 /escm/customer/list", 20, 0, 0.0, 1454.95, 2508.3000000000006, 2835.75, 2851.0, 7.01508242721852, 108.11036697649948, 0.0, 727, 2851]}, {"isController": false, "data": ["686 /escm/messages", 20, 0, 0.0, 16.2, 27.60000000000001, 55.54999999999998, 57.0, 350.8771929824561, 157.96326754385964, 0.0, 8, 57]}, {"isController": false, "data": ["226 /escm/customer/listByCriteria", 20, 0, 0.0, 2608.75, 4252.000000000003, 4465.6, 4470.0, 4.47427293064877, 16.40712388143177, 0.0, 2130, 4470]}, {"isController": false, "data": ["689 /escm/messages", 20, 0, 0.0, 15.85, 27.800000000000004, 58.39999999999998, 60.0, 333.3333333333333, 150.06510416666669, 0.0, 9, 60]}, {"isController": false, "data": ["228 /escm/messages", 20, 0, 0.0, 12.549999999999999, 22.400000000000013, 26.799999999999997, 27.0, 740.7407407407406, 333.47800925925924, 0.0, 8, 27]}, {"isController": true, "data": ["SP_user_login_46_with_cache", 20, 0, 0.0, 3597.15, 5155.3, 5301.85, 5309.0, 3.7671877943115466, 66.136954935016, 0.0, 1709, 5309]}, {"isController": false, "data": ["687 /escm/customer/renderCustomerOrganizationDetails", 20, 0, 0.0, 569.9000000000001, 719.4000000000001, 1158.1999999999998, 1181.0, 16.93480101608806, 663.9384658128704, 0.0, 415, 1181]}, {"isController": true, "data": ["Hit_the_portal_with-cache", 20, 0, 0.0, 144.24999999999997, 468.90000000000043, 742.5999999999998, 756.0, 26.455026455026452, 154.38988095238096, 0.0, 36, 756]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 300, 0, 0.0, 727.9333333333329, 2278.5000000000005, 2576.3999999999996, 3607.3000000000043, 67.11409395973155, 641.7536178691275, 0.0, 8, 4470]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 300, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
