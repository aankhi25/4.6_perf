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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "684 /escm/customer/setSearchBy"]}, {"isController": false, "data": [0.5, 500, 1500, "681 /escm/customer/index"]}, {"isController": false, "data": [0.9833333333333333, 500, 1500, "675 /escm/login/auth"]}, {"isController": false, "data": [0.48333333333333334, 500, 1500, "680 /escm/dashboard/myAccountInfo"]}, {"isController": true, "data": [0.0, 500, 1500, "List_organizations_with_cache"]}, {"isController": false, "data": [0.0, 500, 1500, "545 /escm/dashboard/index"]}, {"isController": true, "data": [0.0, 500, 1500, "SP_user_login_46_new"]}, {"isController": false, "data": [1.0, 500, 1500, "650 /escm/customer/setSearchBy"]}, {"isController": false, "data": [0.48333333333333334, 500, 1500, "682 /escm/customer/list"]}, {"isController": false, "data": [1.0, 500, 1500, "686 /escm/messages"]}, {"isController": false, "data": [0.0, 500, 1500, "598 /escm/customer/index"]}, {"isController": false, "data": [0.0, 500, 1500, "600 /escm/customer/list"]}, {"isController": false, "data": [0.2833333333333333, 500, 1500, "658 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": false, "data": [0.7, 500, 1500, "687 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": true, "data": [0.9833333333333333, 500, 1500, "Hit_the_portal_with-cache"]}, {"isController": false, "data": [0.0, 500, 1500, "540 /success.txt"]}, {"isController": false, "data": [1.0, 500, 1500, "654 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "688 /escm/messages"]}, {"isController": true, "data": [0.6166666666666667, 500, 1500, "Hit_the_portal_new"]}, {"isController": false, "data": [0.0, 500, 1500, "543 /escm/"]}, {"isController": false, "data": [0.9833333333333333, 500, 1500, "524 /escm/login/auth"]}, {"isController": false, "data": [0.95, 500, 1500, "685 /escm/customer/listByCriteria"]}, {"isController": false, "data": [0.4, 500, 1500, "676 /escm/login/doAuth?id=loginform"]}, {"isController": true, "data": [0.0, 500, 1500, "List_Organizations_without_cache"]}, {"isController": false, "data": [1.0, 500, 1500, "673 /escm/messages"]}, {"isController": false, "data": [0.0, 500, 1500, "541 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "652 /escm/images/sidebar-bg.jpg"]}, {"isController": false, "data": [1.0, 500, 1500, "689 /escm/messages"]}, {"isController": true, "data": [0.0, 500, 1500, "SP_user_login_46_with_cache"]}, {"isController": false, "data": [0.0, 500, 1500, "546 /escm/dashboard/myAccountInfo"]}, {"isController": false, "data": [1.0, 500, 1500, "674 /escm/messages"]}, {"isController": false, "data": [0.5666666666666667, 500, 1500, "653 /escm/customer/listByCriteria"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.5291666666666667, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["684 /escm/customer/setSearchBy", 30, 0, 0.0, 15.03333333333333, 28.300000000000015, 45.59999999999998, 61.0, 491.8032786885246, 219.48642418032787, 0.0, 8, 61]}, {"isController": false, "data": ["681 /escm/customer/index", 30, 0, 0.0, 977.4666666666668, 1225.0, 1403.25, 1450.0, 20.689655172413794, 324.2234644396552, 0.0, 728, 1450]}, {"isController": false, "data": ["675 /escm/login/auth", 30, 0, 0.0, 96.73333333333333, 203.3, 383.24999999999983, 529.0, 56.71077504725898, 330.96053875236294, 0.0, 35, 529]}, {"isController": false, "data": ["680 /escm/dashboard/myAccountInfo", 30, 0, 0.0, 1004.1333333333334, 1268.2000000000003, 1441.5499999999997, 1562.0, 19.206145966709347, 158.3312910131242, 0.0, 757, 1562]}, {"isController": true, "data": ["List_organizations_with_cache", 30, 0, 0.0, 2898.0333333333333, 3542.1000000000004, 3740.2999999999997, 3924.0, 7.6452599388379205, 585.1204626178644, 0.0, 2198, 3924]}, {"isController": false, "data": ["545 /escm/dashboard/index", 30, 0, 0.0, 14624.233333333332, 18788.2, 18985.1, 19215.0, 0.3787161522438932, 3.191152046645206, 0.0, 6248, 19215]}, {"isController": true, "data": ["SP_user_login_46_new", 30, 30, 100.0, 94617.59999999999, 106663.0, 108379.2, 109906.0, 0.18863060468684176, 63.8870796779604, 0.0, 78806, 109906]}, {"isController": false, "data": ["650 /escm/customer/setSearchBy", 30, 0, 0.0, 34.766666666666666, 77.10000000000002, 109.99999999999996, 143.0, 209.7902097902098, 93.62707604895105, 0.0, 12, 143]}, {"isController": false, "data": ["682 /escm/customer/list", 30, 0, 0.0, 991.3000000000001, 1288.9000000000003, 1561.5999999999997, 1742.0, 17.22158438576349, 265.3968364308266, 0.0, 692, 1742]}, {"isController": false, "data": ["686 /escm/messages", 30, 0, 0.0, 9.500000000000002, 11.0, 21.999999999999986, 33.0, 909.090909090909, 409.2684659090909, 0.0, 7, 33]}, {"isController": false, "data": ["598 /escm/customer/index", 30, 0, 0.0, 9301.533333333331, 11986.8, 13234.349999999999, 14556.0, 0.4023821020441011, 6.308308729344386, 0.0, 5253, 14556]}, {"isController": false, "data": ["600 /escm/customer/list", 30, 0, 0.0, 7056.933333333334, 11221.500000000004, 12617.55, 12936.0, 2.319109461966605, 35.75429639185219, 0.0, 4224, 12936]}, {"isController": false, "data": ["658 /escm/customer/renderCustomerOrganizationDetails", 30, 0, 0.0, 2120.0666666666666, 4557.0, 4641.35, 4643.0, 0.4865706500583885, 19.102396259082653, 0.0, 727, 4643]}, {"isController": false, "data": ["687 /escm/customer/renderCustomerOrganizationDetails", 30, 0, 0.0, 559.8666666666667, 753.7, 838.5, 844.0, 35.54502369668246, 1395.4580587233413, 0.0, 384, 844]}, {"isController": true, "data": ["Hit_the_portal_with-cache", 30, 0, 0.0, 96.76666666666667, 203.3, 383.24999999999983, 529.0, 56.71077504725898, 330.96053875236294, 0.0, 35, 529]}, {"isController": false, "data": ["540 /success.txt", 30, 30, 100.0, 42014.86666666667, 42021.7, 42139.0, 42161.0, 0.29407440082340836, 0.633523562711366, 0.0, 41994, 42161]}, {"isController": false, "data": ["654 /escm/messages", 30, 0, 0.0, 64.30000000000001, 360.0000000000006, 429.45, 452.0, 66.3716814159292, 29.88021985619469, 0.0, 9, 452]}, {"isController": false, "data": ["688 /escm/messages", 30, 0, 0.0, 10.533333333333335, 15.900000000000002, 25.599999999999994, 30.0, 1000.0, 450.1953125, 0.0, 6, 30]}, {"isController": true, "data": ["Hit_the_portal_new", 30, 0, 0.0, 621.3333333333335, 851.2000000000003, 1490.7999999999993, 2010.0, 0.49526199359461154, 286.2420861260607, 0.0, 474, 2010]}, {"isController": false, "data": ["543 /escm/", 30, 0, 0.0, 13168.066666666666, 17834.3, 19161.1, 19754.0, 0.445202938339393, 3.8213542053127547, 0.0, 4192, 19754]}, {"isController": false, "data": ["524 /escm/login/auth", 30, 0, 0.0, 152.13333333333333, 210.5, 480.4499999999996, 789.0, 0.4985541928407618, 2.9095311097816334, 0.0, 87, 789]}, {"isController": false, "data": ["685 /escm/customer/listByCriteria", 30, 0, 0.0, 324.2333333333334, 530.2000000000002, 680.5999999999998, 828.0, 36.231884057971016, 159.29291213768116, 0.0, 183, 828]}, {"isController": false, "data": ["676 /escm/login/doAuth?id=loginform", 30, 0, 0.0, 1326.0333333333333, 1632.5000000000002, 1814.8, 1894.0, 15.83949313621964, 147.04690387407604, 0.0, 990, 1894]}, {"isController": true, "data": ["List_Organizations_without_cache", 30, 0, 0.0, 21392.3, 25285.700000000004, 26448.25, 27364.0, 0.34339087038139277, 239.6869616632709, 0.0, 16323, 27364]}, {"isController": false, "data": ["673 /escm/messages", 30, 0, 0.0, 18.93333333333333, 24.900000000000002, 51.299999999999976, 70.0, 0.4998000799680128, 0.2250076531887245, 0.0, 11, 70]}, {"isController": false, "data": ["541 /escm/login/doAuth?id=loginform", 30, 0, 0.0, 13129.633333333331, 21075.200000000004, 22011.899999999998, 22629.0, 1.3257324671881214, 12.17075917517345, 0.0, 5658, 22629]}, {"isController": false, "data": ["652 /escm/images/sidebar-bg.jpg", 30, 0, 0.0, 19.03333333333333, 38.90000000000002, 112.6499999999999, 188.0, 159.5744680851064, 265.386053856383, 0.0, 4, 188]}, {"isController": false, "data": ["689 /escm/messages", 30, 0, 0.0, 10.1, 12.900000000000002, 29.799999999999983, 43.0, 697.6744186046512, 314.08975290697674, 0.0, 7, 43]}, {"isController": true, "data": ["SP_user_login_46_with_cache", 30, 0, 0.0, 2330.166666666667, 2803.3, 2896.7, 2900.0, 10.344827586206897, 181.31734913793105, 0.0, 1764, 2900]}, {"isController": false, "data": ["546 /escm/dashboard/myAccountInfo", 30, 0, 0.0, 10921.166666666668, 17859.5, 17968.15, 18027.0, 0.3844822945903341, 3.1752705593896984, 0.0, 5422, 18027]}, {"isController": false, "data": ["674 /escm/messages", 30, 0, 0.0, 21.166666666666668, 53.30000000000004, 86.34999999999997, 110.0, 0.49908501081350853, 0.22468573240725337, 0.0, 10, 110]}, {"isController": false, "data": ["653 /escm/customer/listByCriteria", 30, 0, 0.0, 993.4, 2989.4000000000015, 3419.95, 3503.0, 8.564087924636025, 37.65187874678847, 0.0, 250, 3503]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 780, 30, 3.8461538461538463, 4575.583333333335, 13558.3, 18741.549999999996, 42015.0, 0.010383157687578132, 0.08807562387535758, 0.0, 4, 42161]}}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "items": [{"isController": false, "data": ["Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 30, 100.0, 3.8461538461538463]}], "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);
    
        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": ["540 /success.txt", 30, 30, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 30, null, null, null, null, null, null, null, null]}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 780, 30, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 30, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
