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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "684 /escm/customer/setSearchBy"]}, {"isController": false, "data": [0.45, 500, 1500, "681 /escm/customer/index"]}, {"isController": false, "data": [0.9, 500, 1500, "675 /escm/login/auth"]}, {"isController": false, "data": [1.0, 500, 1500, "688 /escm/messages"]}, {"isController": false, "data": [0.5, 500, 1500, "680 /escm/dashboard/myAccountInfo"]}, {"isController": true, "data": [0.0, 500, 1500, "List_organizations_with_cache"]}, {"isController": false, "data": [0.95, 500, 1500, "685 /escm/customer/listByCriteria"]}, {"isController": false, "data": [0.35, 500, 1500, "676 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [0.4, 500, 1500, "682 /escm/customer/list"]}, {"isController": false, "data": [1.0, 500, 1500, "686 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "689 /escm/messages"]}, {"isController": true, "data": [0.0, 500, 1500, "SP_user_login_46_with_cache"]}, {"isController": false, "data": [0.7, 500, 1500, "687 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": true, "data": [0.9, 500, 1500, "Hit_the_portal_with-cache"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.6535714285714286, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["684 /escm/customer/setSearchBy", 10, 0, 0.0, 23.399999999999995, 46.7, 48.0, 48.0, 0.018517524058893134, 0.008264168452064612, 0.0, 14, 48]}, {"isController": false, "data": ["681 /escm/customer/index", 10, 0, 0.0, 1139.1, 1697.2000000000003, 1740.0, 1740.0, 0.018459039391590062, 0.28926973155941965, 0.0, 849, 1740]}, {"isController": false, "data": ["675 /escm/login/auth", 10, 0, 0.0, 165.8, 544.3000000000001, 549.0, 549.0, 0.018514678437064905, 0.10805050619130847, 0.0, 47, 549]}, {"isController": false, "data": ["688 /escm/messages", 10, 0, 0.0, 18.9, 61.20000000000002, 66.0, 66.0, 0.018516255420633773, 0.00833593139542204, 0.0, 10, 66]}, {"isController": false, "data": ["680 /escm/dashboard/myAccountInfo", 10, 0, 0.0, 1026.4, 1280.3, 1286.0, 1286.0, 0.018474521787003543, 0.15224521440606262, 0.0, 777, 1286]}, {"isController": true, "data": ["List_organizations_with_cache", 10, 0, 0.0, 3342.4, 4121.9, 4140.0, 4140.0, 0.01837762340574117, 1.4065288947927004, 0.0, 2311, 4140]}, {"isController": false, "data": ["685 /escm/customer/listByCriteria", 10, 0, 0.0, 300.79999999999995, 562.7, 576.0, 576.0, 0.01849878647960694, 0.08132962571405315, 0.0, 215, 576]}, {"isController": false, "data": ["676 /escm/login/doAuth?id=loginform", 10, 0, 0.0, 1344.0, 1650.4, 1664.0, 1664.0, 0.018466265825589814, 0.17283270671137965, 0.0, 1061, 1664]}, {"isController": false, "data": ["682 /escm/customer/list", 10, 0, 0.0, 1196.6, 1966.8000000000002, 2003.0, 2003.0, 0.018450082379617823, 0.2843366699538563, 0.0, 720, 2003]}, {"isController": false, "data": ["686 /escm/messages", 10, 0, 0.0, 17.8, 35.800000000000004, 37.0, 37.0, 0.01851724974399902, 0.008336379035140184, 0.0, 11, 37]}, {"isController": false, "data": ["689 /escm/messages", 10, 0, 0.0, 13.3, 23.000000000000004, 24.0, 24.0, 0.018517695509829193, 0.0083365797168274, 0.0, 11, 24]}, {"isController": true, "data": ["SP_user_login_46_with_cache", 10, 0, 0.0, 2370.3999999999996, 2798.3, 2814.0, 2814.0, 0.018422516736856458, 0.3242398927164738, 0.0, 1854, 2814]}, {"isController": false, "data": ["687 /escm/customer/renderCustomerOrganizationDetails", 10, 0, 0.0, 632.4999999999999, 895.6, 899.0, 899.0, 0.018487739855314947, 0.7258189173256006, 0.0, 466, 899]}, {"isController": true, "data": ["Hit_the_portal_with-cache", 10, 0, 0.0, 165.8, 544.3000000000001, 549.0, 549.0, 0.018514678437064905, 0.10805050619130847, 0.0, 47, 549]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 110, 0, 0.0, 534.4181818181817, 1296.1000000000001, 1528.0, 1974.0700000000002, 0.2029509061757961, 1.844473113502139, 0.0, 10, 2003]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 110, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
