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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "684 /escm/customer/setSearchBy"]}, {"isController": false, "data": [0.45, 500, 1500, "681 /escm/customer/index"]}, {"isController": false, "data": [1.0, 500, 1500, "675 /escm/login/auth"]}, {"isController": false, "data": [0.45, 500, 1500, "680 /escm/dashboard/myAccountInfo"]}, {"isController": true, "data": [0.0, 500, 1500, "List_organizations_with_cache"]}, {"isController": false, "data": [0.0, 500, 1500, "545 /escm/dashboard/index"]}, {"isController": true, "data": [0.0, 500, 1500, "SP_user_login_46_new"]}, {"isController": false, "data": [1.0, 500, 1500, "650 /escm/customer/setSearchBy"]}, {"isController": false, "data": [0.5, 500, 1500, "682 /escm/customer/list"]}, {"isController": false, "data": [1.0, 500, 1500, "686 /escm/messages"]}, {"isController": false, "data": [0.0, 500, 1500, "598 /escm/customer/index"]}, {"isController": false, "data": [0.0, 500, 1500, "600 /escm/customer/list"]}, {"isController": false, "data": [0.15, 500, 1500, "658 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": false, "data": [0.55, 500, 1500, "687 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": true, "data": [1.0, 500, 1500, "Hit_the_portal_with-cache"]}, {"isController": false, "data": [0.0, 500, 1500, "540 /success.txt"]}, {"isController": false, "data": [1.0, 500, 1500, "654 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "688 /escm/messages"]}, {"isController": true, "data": [0.45, 500, 1500, "Hit_the_portal_new"]}, {"isController": false, "data": [0.0, 500, 1500, "543 /escm/"]}, {"isController": false, "data": [0.95, 500, 1500, "524 /escm/login/auth"]}, {"isController": false, "data": [0.9, 500, 1500, "685 /escm/customer/listByCriteria"]}, {"isController": false, "data": [0.45, 500, 1500, "676 /escm/login/doAuth?id=loginform"]}, {"isController": true, "data": [0.0, 500, 1500, "List_Organizations_without_cache"]}, {"isController": false, "data": [1.0, 500, 1500, "673 /escm/messages"]}, {"isController": false, "data": [0.0, 500, 1500, "541 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "652 /escm/images/sidebar-bg.jpg"]}, {"isController": false, "data": [1.0, 500, 1500, "689 /escm/messages"]}, {"isController": true, "data": [0.0, 500, 1500, "SP_user_login_46_with_cache"]}, {"isController": false, "data": [0.0, 500, 1500, "546 /escm/dashboard/myAccountInfo"]}, {"isController": false, "data": [1.0, 500, 1500, "674 /escm/messages"]}, {"isController": false, "data": [0.5, 500, 1500, "653 /escm/customer/listByCriteria"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.5109375, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["684 /escm/customer/setSearchBy", 10, 0, 0.0, 17.599999999999998, 46.900000000000006, 49.0, 49.0, 204.08163265306123, 91.07940051020408, 0.0, 10, 49]}, {"isController": false, "data": ["681 /escm/customer/index", 10, 0, 0.0, 914.1, 1505.9, 1570.0, 1570.0, 6.369426751592357, 99.81463972929936, 0.0, 717, 1570]}, {"isController": false, "data": ["675 /escm/login/auth", 10, 0, 0.0, 108.4, 447.2000000000001, 477.0, 477.0, 20.964360587002098, 122.34669811320755, 0.0, 45, 477]}, {"isController": false, "data": ["680 /escm/dashboard/myAccountInfo", 10, 0, 0.0, 994.0, 1696.2000000000003, 1752.0, 1752.0, 5.707762557077626, 47.05838416809361, 0.0, 720, 1752]}, {"isController": true, "data": ["List_organizations_with_cache", 10, 0, 0.0, 2866.7000000000003, 3536.5, 3543.0, 3543.0, 2.822466836014677, 216.01518398955687, 0.0, 2094, 3543]}, {"isController": false, "data": ["545 /escm/dashboard/index", 10, 0, 0.0, 4701.7, 7374.8, 7439.0, 7439.0, 1.3442667025137787, 11.316126369471704, 0.0, 2682, 7439]}, {"isController": true, "data": ["SP_user_login_46_new", 10, 10, 100.0, 66740.9, 69634.3, 69666.0, 69666.0, 0.14354204346453076, 48.57238466396808, 0.0, 64055, 69666]}, {"isController": false, "data": ["650 /escm/customer/setSearchBy", 10, 0, 0.0, 47.2, 79.8, 80.0, 80.0, 125.0, 55.7861328125, 0.0, 21, 80]}, {"isController": false, "data": ["682 /escm/customer/list", 10, 0, 0.0, 863.1999999999999, 1383.8000000000002, 1431.0, 1431.0, 6.988120195667365, 107.69348357791753, 0.0, 611, 1431]}, {"isController": false, "data": ["686 /escm/messages", 10, 0, 0.0, 11.7, 17.0, 17.0, 17.0, 588.2352941176471, 264.82077205882354, 0.0, 9, 17]}, {"isController": false, "data": ["598 /escm/customer/index", 10, 0, 0.0, 4390.9, 5561.900000000001, 5600.0, 5600.0, 1.7857142857142856, 27.99560546875, 0.0, 2781, 5600]}, {"isController": false, "data": ["600 /escm/customer/list", 10, 0, 0.0, 3410.4, 4015.1, 4018.0, 4018.0, 2.4888003982080633, 38.37176067073171, 0.0, 2578, 4018]}, {"isController": false, "data": ["658 /escm/customer/renderCustomerOrganizationDetails", 10, 0, 0.0, 3797.2999999999997, 7097.2, 7109.0, 7109.0, 1.4066676044450697, 55.22461624349416, 0.0, 1134, 7109]}, {"isController": false, "data": ["687 /escm/customer/renderCustomerOrganizationDetails", 10, 0, 0.0, 708.1999999999999, 1544.7000000000003, 1625.0, 1625.0, 6.153846153846154, 241.59375, 0.0, 429, 1625]}, {"isController": true, "data": ["Hit_the_portal_with-cache", 10, 0, 0.0, 108.4, 447.2000000000001, 477.0, 477.0, 20.964360587002098, 122.34669811320755, 0.0, 45, 477]}, {"isController": false, "data": ["540 /success.txt", 10, 10, 100.0, 42032.6, 42141.7, 42144.0, 42144.0, 0.2372817008352316, 0.5111752266040244, 0.0, 41998, 42144]}, {"isController": false, "data": ["654 /escm/messages", 10, 0, 0.0, 55.300000000000004, 135.4, 136.0, 136.0, 73.52941176470588, 33.10259650735294, 0.0, 16, 136]}, {"isController": false, "data": ["688 /escm/messages", 10, 0, 0.0, 14.699999999999998, 22.8, 23.0, 23.0, 0.16663611671193615, 0.07501879863691656, 0.0, 9, 23]}, {"isController": true, "data": ["Hit_the_portal_new", 10, 0, 0.0, 810.1, 1710.4, 1781.0, 1781.0, 5.614823133071308, 3245.1484418865807, 0.0, 565, 1781]}, {"isController": false, "data": ["543 /escm/", 10, 0, 0.0, 4048.0, 5004.7, 5035.0, 5035.0, 1.9860973187686195, 17.02942682472691, 0.0, 2678, 5035]}, {"isController": false, "data": ["524 /escm/login/auth", 10, 0, 0.0, 216.8, 622.3000000000002, 664.0, 664.0, 15.060240963855422, 87.890625, 0.0, 109, 664]}, {"isController": false, "data": ["685 /escm/customer/listByCriteria", 10, 0, 0.0, 324.6, 588.6, 596.0, 596.0, 16.778523489932887, 73.7665163590604, 0.0, 178, 596]}, {"isController": false, "data": ["676 /escm/login/doAuth?id=loginform", 10, 0, 0.0, 1265.0, 1936.1000000000004, 1994.0, 1994.0, 5.015045135406218, 46.36125172392177, 0.0, 894, 1994]}, {"isController": true, "data": ["List_Organizations_without_cache", 10, 0, 0.0, 15467.999999999998, 19672.7, 19675.0, 19675.0, 0.5082592121982211, 354.7654264612452, 0.0, 12828, 19675]}, {"isController": false, "data": ["673 /escm/messages", 10, 0, 0.0, 28.3, 48.8, 49.0, 49.0, 204.08163265306123, 91.8765943877551, 0.0, 13, 49]}, {"isController": false, "data": ["541 /escm/login/doAuth?id=loginform", 10, 0, 0.0, 9262.4, 12503.3, 12506.0, 12506.0, 0.7996161842315689, 7.116740214696946, 0.0, 5331, 12506]}, {"isController": false, "data": ["652 /escm/images/sidebar-bg.jpg", 10, 0, 0.0, 21.3, 43.800000000000004, 45.0, 45.0, 222.2222222222222, 369.57465277777777, 0.0, 5, 45]}, {"isController": false, "data": ["689 /escm/messages", 10, 0, 0.0, 12.6, 29.400000000000006, 31.0, 31.0, 0.16664167041610425, 0.07502129888850005, 0.0, 9, 31]}, {"isController": true, "data": ["SP_user_login_46_with_cache", 10, 0, 0.0, 2259.0, 2947.3, 2953.0, 2953.0, 3.3863867253640367, 59.224729089061974, 0.0, 1735, 2953]}, {"isController": false, "data": ["546 /escm/dashboard/myAccountInfo", 10, 0, 0.0, 5538.0, 7221.700000000001, 7294.0, 7294.0, 1.3709898546750754, 11.312808472717302, 0.0, 2922, 7294]}, {"isController": false, "data": ["674 /escm/messages", 10, 0, 0.0, 28.3, 65.0, 65.0, 65.0, 153.84615384615387, 69.2608173076923, 0.0, 12, 65]}, {"isController": false, "data": ["653 /escm/customer/listByCriteria", 10, 0, 0.0, 934.5, 1771.4, 1810.0, 1810.0, 5.524861878453039, 24.289968922651934, 0.0, 348, 1810]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 260, 10, 3.8461538461538463, 3221.042307692308, 6556.100000000001, 11544.399999999989, 42055.119999999995, 0.002957485934936265, 0.025048141863627457, 0.0, 5, 42144]}}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "items": [{"isController": false, "data": ["Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 10, 100.0, 3.8461538461538463]}], "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);
    
        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": ["540 /success.txt", 10, 10, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 10, null, null, null, null, null, null, null, null]}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 260, 10, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 10, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
