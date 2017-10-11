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

    var data = {"KoPercent": 3.8461538461538463, "OkPercent": 96.15384615384616};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "684 /escm/customer/setSearchBy"]}, {"isController": false, "data": [0.5, 500, 1500, "681 /escm/customer/index"]}, {"isController": false, "data": [0.975, 500, 1500, "675 /escm/login/auth"]}, {"isController": false, "data": [0.5, 500, 1500, "680 /escm/dashboard/myAccountInfo"]}, {"isController": true, "data": [0.0, 500, 1500, "List_organizations_with_cache"]}, {"isController": false, "data": [0.0, 500, 1500, "545 /escm/dashboard/index"]}, {"isController": true, "data": [0.0, 500, 1500, "SP_user_login_46_new"]}, {"isController": false, "data": [1.0, 500, 1500, "650 /escm/customer/setSearchBy"]}, {"isController": false, "data": [0.5, 500, 1500, "682 /escm/customer/list"]}, {"isController": false, "data": [1.0, 500, 1500, "686 /escm/messages"]}, {"isController": false, "data": [0.0, 500, 1500, "598 /escm/customer/index"]}, {"isController": false, "data": [0.0, 500, 1500, "600 /escm/customer/list"]}, {"isController": false, "data": [0.325, 500, 1500, "658 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": false, "data": [0.825, 500, 1500, "687 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": true, "data": [0.975, 500, 1500, "Hit_the_portal_with-cache"]}, {"isController": false, "data": [0.0, 500, 1500, "540 /success.txt"]}, {"isController": false, "data": [1.0, 500, 1500, "654 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "688 /escm/messages"]}, {"isController": true, "data": [0.7, 500, 1500, "Hit_the_portal_new"]}, {"isController": false, "data": [0.0, 500, 1500, "543 /escm/"]}, {"isController": false, "data": [1.0, 500, 1500, "524 /escm/login/auth"]}, {"isController": false, "data": [1.0, 500, 1500, "685 /escm/customer/listByCriteria"]}, {"isController": false, "data": [0.475, 500, 1500, "676 /escm/login/doAuth?id=loginform"]}, {"isController": true, "data": [0.0, 500, 1500, "List_Organizations_without_cache"]}, {"isController": false, "data": [1.0, 500, 1500, "673 /escm/messages"]}, {"isController": false, "data": [0.0, 500, 1500, "541 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "652 /escm/images/sidebar-bg.jpg"]}, {"isController": false, "data": [1.0, 500, 1500, "689 /escm/messages"]}, {"isController": true, "data": [0.0, 500, 1500, "SP_user_login_46_with_cache"]}, {"isController": false, "data": [0.0, 500, 1500, "546 /escm/dashboard/myAccountInfo"]}, {"isController": false, "data": [1.0, 500, 1500, "674 /escm/messages"]}, {"isController": false, "data": [0.6, 500, 1500, "653 /escm/customer/listByCriteria"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.54296875, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["684 /escm/customer/setSearchBy", 20, 0, 0.0, 11.649999999999999, 17.800000000000004, 32.249999999999986, 33.0, 606.0606060606061, 270.4782196969697, 0.0, 8, 33]}, {"isController": false, "data": ["681 /escm/customer/index", 20, 0, 0.0, 818.3, 954.3000000000001, 1302.8999999999996, 1321.0, 15.14004542013626, 237.25811411809235, 0.0, 664, 1321]}, {"isController": false, "data": ["675 /escm/login/auth", 20, 0, 0.0, 116.15, 430.2000000000004, 615.2999999999998, 624.0, 32.05128205128205, 187.04927884615384, 0.0, 33, 624]}, {"isController": false, "data": ["680 /escm/dashboard/myAccountInfo", 20, 0, 0.0, 817.55, 919.3000000000001, 999.8, 1004.0, 19.9203187250996, 164.21618214641435, 0.0, 689, 1004]}, {"isController": true, "data": ["List_organizations_with_cache", 20, 0, 0.0, 2408.8000000000006, 2853.2000000000003, 2939.65, 2944.0, 6.793478260869565, 519.9356079101562, 0.0, 1914, 2944]}, {"isController": false, "data": ["545 /escm/dashboard/index", 20, 0, 0.0, 7932.900000000001, 9889.300000000001, 11602.249999999998, 11690.0, 0.2789789370902497, 2.3501387266355143, 0.0, 5413, 11690]}, {"isController": true, "data": ["SP_user_login_46_new", 20, 20, 100.0, 77494.04999999997, 81612.3, 83329.4, 83413.0, 0.1394573713680071, 47.22509383955778, 0.0, 70250, 83413]}, {"isController": false, "data": ["650 /escm/customer/setSearchBy", 20, 0, 0.0, 33.8, 83.60000000000002, 95.44999999999999, 96.0, 208.33333333333334, 92.97688802083333, 0.0, 16, 96]}, {"isController": false, "data": ["682 /escm/customer/list", 20, 0, 0.0, 813.55, 909.1000000000001, 1366.1499999999996, 1390.0, 14.388489208633095, 221.74291816546764, 0.0, 612, 1390]}, {"isController": false, "data": ["686 /escm/messages", 20, 0, 0.0, 8.650000000000002, 11.0, 13.849999999999998, 14.0, 1428.5714285714287, 643.1361607142857, 0.0, 7, 14]}, {"isController": false, "data": ["598 /escm/customer/index", 20, 0, 0.0, 8336.15, 12508.400000000003, 13496.699999999999, 13542.0, 1.4768867227883622, 23.150055152488555, 0.0, 4956, 13542]}, {"isController": false, "data": ["600 /escm/customer/list", 20, 0, 0.0, 6288.650000000001, 9031.300000000001, 10550.349999999999, 10627.0, 1.881998682600922, 29.011818363602142, 0.0, 3088, 10627]}, {"isController": false, "data": ["658 /escm/customer/renderCustomerOrganizationDetails", 20, 0, 0.0, 1919.6000000000001, 5234.7, 5265.45, 5267.0, 3.7972280235428135, 149.07679893677616, 0.0, 711, 5267]}, {"isController": false, "data": ["687 /escm/customer/renderCustomerOrganizationDetails", 20, 0, 0.0, 499.90000000000003, 628.6000000000001, 991.3499999999997, 1010.0, 19.801980198019802, 777.4085318688119, 0.0, 373, 1010]}, {"isController": true, "data": ["Hit_the_portal_with-cache", 20, 0, 0.0, 116.15, 430.2000000000004, 615.2999999999998, 624.0, 32.05128205128205, 187.04927884615384, 0.0, 33, 624]}, {"isController": false, "data": ["540 /success.txt", 20, 20, 100.0, 42016.35000000001, 42025.3, 42203.65, 42213.0, 0.19602846333287594, 0.42230350596906674, 0.0, 41995, 42213]}, {"isController": false, "data": ["654 /escm/messages", 20, 0, 0.0, 23.95, 57.400000000000034, 82.74999999999999, 84.0, 238.09523809523807, 107.1893601190476, 0.0, 12, 84]}, {"isController": false, "data": ["688 /escm/messages", 20, 0, 0.0, 10.649999999999999, 14.900000000000002, 17.849999999999998, 18.0, 1111.111111111111, 500.2170138888889, 0.0, 7, 18]}, {"isController": true, "data": ["Hit_the_portal_new", 20, 0, 0.0, 556.2, 856.5000000000006, 1246.7999999999997, 1266.0, 0.32995133217850364, 190.6989812752619, 0.0, 332, 1266]}, {"isController": false, "data": ["543 /escm/", 20, 0, 0.0, 8222.0, 9188.5, 9232.1, 9234.0, 0.2890340482108792, 2.4797935845280077, 0.0, 5662, 9234]}, {"isController": false, "data": ["524 /escm/login/auth", 20, 0, 0.0, 146.24999999999997, 312.50000000000034, 461.89999999999986, 469.0, 0.33232527998404837, 1.9394295636569072, 0.0, 76, 469]}, {"isController": false, "data": ["685 /escm/customer/listByCriteria", 20, 0, 0.0, 236.45000000000002, 339.00000000000006, 403.69999999999993, 407.0, 49.140049140049136, 216.04345823095824, 0.0, 160, 407]}, {"isController": false, "data": ["676 /escm/login/doAuth?id=loginform", 20, 0, 0.0, 1100.3500000000001, 1264.0, 1718.2999999999997, 1742.0, 11.481056257175661, 106.81586807548794, 0.0, 879, 1742]}, {"isController": true, "data": ["List_Organizations_without_cache", 20, 0, 0.0, 19289.95, 24429.6, 27288.55, 27439.0, 0.7288895367906993, 508.7621206357739, 0.0, 14894, 27439]}, {"isController": false, "data": ["673 /escm/messages", 20, 0, 0.0, 24.35, 67.30000000000004, 73.75, 74.0, 270.27027027027026, 121.67440878378379, 0.0, 10, 74]}, {"isController": false, "data": ["541 /escm/login/doAuth?id=loginform", 20, 0, 0.0, 10687.449999999999, 13187.300000000003, 15014.099999999999, 15105.0, 1.32406487917908, 12.097349801390267, 0.0, 8864, 15105]}, {"isController": false, "data": ["652 /escm/images/sidebar-bg.jpg", 20, 0, 0.0, 9.65, 17.50000000000001, 28.449999999999992, 29.0, 689.6551724137931, 1146.9558189655172, 0.0, 5, 29]}, {"isController": false, "data": ["689 /escm/messages", 20, 0, 0.0, 9.650000000000002, 15.50000000000001, 23.599999999999994, 24.0, 833.3333333333334, 375.1627604166667, 0.0, 6, 24]}, {"isController": true, "data": ["SP_user_login_46_with_cache", 20, 0, 0.0, 1917.8999999999999, 2142.8, 2581.8999999999996, 2605.0, 7.677543186180422, 134.7202645153551, 0.0, 1589, 2605]}, {"isController": false, "data": ["546 /escm/dashboard/myAccountInfo", 20, 0, 0.0, 7790.2, 13302.800000000007, 13682.2, 13688.0, 1.461133839859731, 12.06048979945938, 0.0, 4786, 13688]}, {"isController": false, "data": ["674 /escm/messages", 20, 0, 0.0, 21.5, 53.500000000000014, 55.9, 56.0, 357.14285714285717, 160.78404017857142, 0.0, 9, 56]}, {"isController": false, "data": ["653 /escm/customer/listByCriteria", 20, 0, 0.0, 762.0999999999999, 1551.5, 1868.3999999999996, 1885.0, 10.610079575596817, 46.647049071618035, 0.0, 321, 1885]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 520, 20, 3.8461538461538463, 3794.528846153847, 9233.8, 12618.699999999995, 42012.0, 0.0424362036963892, 0.3599055972730414, 0.0, 5, 42213]}}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "items": [{"isController": false, "data": ["Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 20, 100.0, 3.8461538461538463]}], "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);
    
        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": ["540 /success.txt", 20, 20, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 20, null, null, null, null, null, null, null, null]}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 520, 20, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 20, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
