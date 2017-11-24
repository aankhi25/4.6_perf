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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "684 /escm/customer/setSearchBy"]}, {"isController": false, "data": [0.16666666666666666, 500, 1500, "681 /escm/customer/index"]}, {"isController": false, "data": [0.9833333333333333, 500, 1500, "675 /escm/login/auth"]}, {"isController": true, "data": [0.0, 500, 1500, "46_Org_search_by_orgname_withcache"]}, {"isController": false, "data": [1.0, 500, 1500, "229 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "688 /escm/messages"]}, {"isController": false, "data": [0.16666666666666666, 500, 1500, "680 /escm/dashboard/myAccountInfo"]}, {"isController": true, "data": [0.0, 500, 1500, "List_organizations_with_cache"]}, {"isController": false, "data": [0.85, 500, 1500, "227 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": false, "data": [0.95, 500, 1500, "685 /escm/customer/listByCriteria"]}, {"isController": false, "data": [0.11666666666666667, 500, 1500, "676 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [0.21666666666666667, 500, 1500, "682 /escm/customer/list"]}, {"isController": false, "data": [1.0, 500, 1500, "686 /escm/messages"]}, {"isController": false, "data": [0.0, 500, 1500, "226 /escm/customer/listByCriteria"]}, {"isController": false, "data": [1.0, 500, 1500, "689 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "228 /escm/messages"]}, {"isController": true, "data": [0.0, 500, 1500, "SP_user_login_46_with_cache"]}, {"isController": false, "data": [0.7333333333333333, 500, 1500, "687 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": true, "data": [0.9833333333333333, 500, 1500, "Hit_the_portal_with-cache"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.5877192982456141, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["684 /escm/customer/setSearchBy", 30, 0, 0.0, 18.666666666666664, 34.70000000000003, 53.599999999999994, 58.0, 517.2413793103449, 230.83917025862067, 0.0, 10, 58]}, {"isController": false, "data": ["681 /escm/customer/index", 30, 0, 0.0, 1966.5, 2858.4000000000005, 3802.45, 3902.0, 7.688364941055869, 120.48158396335212, 0.0, 868, 3902]}, {"isController": false, "data": ["675 /escm/login/auth", 30, 0, 0.0, 101.8, 199.0, 480.29999999999984, 587.0, 51.10732538330494, 298.2591567291312, 0.0, 37, 587]}, {"isController": true, "data": ["46_Org_search_by_orgname_withcache", 30, 0, 0.0, 2934.266666666667, 3444.1000000000004, 3827.85, 3912.0, 7.668711656441718, 334.7075604709867, 0.0, 2413, 3912]}, {"isController": false, "data": ["229 /escm/messages", 30, 0, 0.0, 11.033333333333335, 14.900000000000002, 25.599999999999994, 30.0, 0.4999166805532411, 0.22506014622562906, 0.0, 6, 30]}, {"isController": false, "data": ["688 /escm/messages", 30, 0, 0.0, 12.733333333333333, 20.800000000000004, 30.29999999999999, 38.0, 789.4736842105264, 355.4173519736842, 0.0, 7, 38]}, {"isController": false, "data": ["680 /escm/dashboard/myAccountInfo", 30, 0, 0.0, 1906.2, 2550.9, 3202.75, 3387.0, 8.857395925597874, 72.69206017493357, 0.0, 795, 3387]}, {"isController": true, "data": ["List_organizations_with_cache", 30, 0, 0.0, 4759.2, 6672.200000000001, 7147.099999999999, 7344.0, 4.0849673202614385, 312.0666370932053, 0.0, 2869, 7344]}, {"isController": false, "data": ["227 /escm/customer/renderCustomerOrganizationDetails", 30, 0, 0.0, 478.86666666666673, 625.5, 711.9499999999999, 784.0, 0.496113775425831, 19.387373775219118, 0.0, 324, 784]}, {"isController": false, "data": ["685 /escm/customer/listByCriteria", 30, 0, 0.0, 333.1333333333334, 510.8, 852.7999999999997, 1108.0, 27.075812274368232, 116.68511676444042, 0.0, 176, 1108]}, {"isController": false, "data": ["676 /escm/login/doAuth?id=loginform", 30, 0, 0.0, 2340.2999999999997, 3863.7000000000003, 4102.15, 4238.0, 7.078810759792354, 66.29610444195374, 0.0, 1045, 4238]}, {"isController": false, "data": ["682 /escm/customer/list", 30, 0, 0.0, 1854.6333333333337, 2732.2000000000003, 3542.8499999999995, 3814.0, 7.865757734661772, 121.2202371198217, 0.0, 964, 3814]}, {"isController": false, "data": ["686 /escm/messages", 30, 0, 0.0, 14.100000000000005, 25.60000000000001, 39.05, 44.0, 681.8181818181818, 306.9513494318182, 0.0, 8, 44]}, {"isController": false, "data": ["226 /escm/customer/listByCriteria", 30, 0, 0.0, 2432.1, 2783.9000000000005, 3397.45, 3442.0, 8.715862870424171, 31.96100105316676, 0.0, 2069, 3442]}, {"isController": false, "data": ["689 /escm/messages", 30, 0, 0.0, 10.433333333333334, 15.900000000000002, 18.799999999999997, 21.0, 1428.5714285714287, 643.1361607142857, 0.0, 7, 21]}, {"isController": false, "data": ["228 /escm/messages", 30, 0, 0.0, 12.266666666666667, 26.00000000000002, 31.499999999999993, 37.0, 0.49977510120445795, 0.22499640786646008, 0.0, 7, 37]}, {"isController": true, "data": ["SP_user_login_46_with_cache", 30, 0, 0.0, 4246.5, 6365.6, 6678.099999999999, 6886.0, 4.356665698518733, 76.55691234933198, 0.0, 1851, 6886]}, {"isController": false, "data": ["687 /escm/customer/renderCustomerOrganizationDetails", 30, 0, 0.0, 549.0, 848.4000000000002, 908.8499999999999, 960.0, 31.25, 1225.1780192057292, 0.0, 344, 960]}, {"isController": true, "data": ["Hit_the_portal_with-cache", 30, 0, 0.0, 101.8, 199.0, 480.29999999999984, 587.0, 51.10732538330494, 298.2591567291312, 0.0, 37, 587]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 450, 0, 0.0, 802.7844444444445, 2439.3000000000006, 2690.2999999999997, 3850.17, 7.441706631387465, 71.16656826215478, 0.0, 6, 4238]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 450, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
