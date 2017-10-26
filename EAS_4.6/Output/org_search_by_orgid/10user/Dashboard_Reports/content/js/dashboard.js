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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "684 /escm/customer/setSearchBy"]}, {"isController": false, "data": [0.3, 500, 1500, "681 /escm/customer/index"]}, {"isController": false, "data": [0.7, 500, 1500, "11 /escm/customer/listByCriteria"]}, {"isController": false, "data": [0.95, 500, 1500, "675 /escm/login/auth"]}, {"isController": false, "data": [1.0, 500, 1500, "688 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "14 /escm/messages"]}, {"isController": false, "data": [0.25, 500, 1500, "680 /escm/dashboard/myAccountInfo"]}, {"isController": true, "data": [0.0, 500, 1500, "List_organizations_with_cache"]}, {"isController": false, "data": [0.95, 500, 1500, "685 /escm/customer/listByCriteria"]}, {"isController": false, "data": [0.1, 500, 1500, "12 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": false, "data": [0.2, 500, 1500, "676 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [0.4, 500, 1500, "682 /escm/customer/list"]}, {"isController": false, "data": [1.0, 500, 1500, "13 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "686 /escm/messages"]}, {"isController": true, "data": [0.0, 500, 1500, "organization_search_by_organization_id_with_cache"]}, {"isController": false, "data": [1.0, 500, 1500, "689 /escm/messages"]}, {"isController": true, "data": [0.0, 500, 1500, "SP_user_login_46_with_cache"]}, {"isController": false, "data": [0.65, 500, 1500, "687 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": true, "data": [0.95, 500, 1500, "Hit_the_portal_with-cache"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.6026315789473684, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["684 /escm/customer/setSearchBy", 10, 0, 0.0, 23.5, 55.5, 56.0, 56.0, 0.16662501041406313, 0.07436291968674498, 0.0, 10, 56]}, {"isController": false, "data": ["681 /escm/customer/index", 10, 0, 0.0, 1443.5, 2350.5, 2399.0, 2399.0, 4.168403501458942, 65.32222084722801, 0.0, 934, 2399]}, {"isController": false, "data": ["11 /escm/customer/listByCriteria", 10, 0, 0.0, 562.0, 739.4, 746.0, 746.0, 0.16479894528675015, 0.5372059368820039, 0.0, 449, 746]}, {"isController": false, "data": ["675 /escm/login/auth", 10, 0, 0.0, 123.69999999999997, 533.6000000000001, 572.0, 572.0, 17.482517482517483, 102.02687937062937, 0.0, 37, 572]}, {"isController": false, "data": ["688 /escm/messages", 10, 0, 0.0, 14.2, 23.400000000000002, 24.0, 24.0, 0.16661945782028426, 0.07501129888198343, 0.0, 9, 24]}, {"isController": false, "data": ["14 /escm/messages", 10, 0, 0.0, 12.000000000000002, 27.500000000000007, 29.0, 29.0, 0.16663889351774705, 0.07502004874187636, 0.0, 8, 29]}, {"isController": false, "data": ["680 /escm/dashboard/myAccountInfo", 10, 0, 0.0, 1430.4, 2432.0, 2492.0, 2492.0, 4.012841091492777, 33.0820343850321, 0.0, 889, 2492]}, {"isController": true, "data": ["List_organizations_with_cache", 10, 0, 0.0, 3885.5, 5229.9, 5257.0, 5257.0, 1.9022256039566292, 145.31758993960435, 0.0, 2811, 5257]}, {"isController": false, "data": ["685 /escm/customer/listByCriteria", 10, 0, 0.0, 360.99999999999994, 557.8000000000001, 570.0, 570.0, 0.16599438938963862, 0.7153644925551517, 0.0, 228, 570]}, {"isController": false, "data": ["12 /escm/customer/renderCustomerOrganizationDetails", 10, 0, 0.0, 1735.8999999999999, 2299.0, 2315.0, 2315.0, 0.16253819647617188, 23.40183365942559, 0.0, 1463, 2315]}, {"isController": false, "data": ["676 /escm/login/doAuth?id=loginform", 10, 0, 0.0, 1880.4, 3367.9, 3401.0, 3401.0, 2.940311673037342, 27.531539436930316, 0.0, 1110, 3401]}, {"isController": false, "data": ["682 /escm/customer/list", 10, 0, 0.0, 1381.8000000000002, 2471.6000000000004, 2505.0, 2505.0, 3.992015968063872, 61.518759356287426, 0.0, 927, 2505]}, {"isController": false, "data": ["13 /escm/messages", 10, 0, 0.0, 13.899999999999999, 31.600000000000005, 33.0, 33.0, 0.1666305633779348, 0.0750162985519804, 0.0, 7, 33]}, {"isController": false, "data": ["686 /escm/messages", 10, 0, 0.0, 18.700000000000003, 36.0, 36.0, 36.0, 0.16663611671193615, 0.07501879863691656, 0.0, 10, 36]}, {"isController": true, "data": ["organization_search_by_organization_id_with_cache", 10, 0, 0.0, 2323.7999999999997, 2850.2, 2863.0, 2863.0, 0.16072260884938683, 23.809061163993313, 0.0, 1934, 2863]}, {"isController": false, "data": ["689 /escm/messages", 10, 0, 0.0, 13.799999999999999, 24.700000000000003, 25.0, 25.0, 0.16661390559656108, 0.07500879929688932, 0.0, 8, 25]}, {"isController": true, "data": ["SP_user_login_46_with_cache", 10, 0, 0.0, 3310.8, 4849.1, 4875.0, 4875.0, 2.051282051282051, 36.117988782051285, 0.0, 2002, 4875]}, {"isController": false, "data": ["687 /escm/customer/renderCustomerOrganizationDetails", 10, 0, 0.0, 629.0, 955.0000000000001, 977.0, 977.0, 0.16556565506051424, 6.491127621111277, 0.0, 384, 977]}, {"isController": true, "data": ["Hit_the_portal_with-cache", 10, 0, 0.0, 123.69999999999997, 533.6000000000001, 572.0, 572.0, 17.482517482517483, 102.02687937062937, 0.0, 37, 572]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 150, 0, 0.0, 642.9199999999998, 1794.6000000000006, 2191.6999999999994, 3232.1900000000032, 2.4380729471425786, 40.30532990682498, 0.0, 7, 3401]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 150, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
