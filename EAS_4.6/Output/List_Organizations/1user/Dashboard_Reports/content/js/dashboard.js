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

    var data = {"KoPercent": 6.666666666666667, "OkPercent": 93.33333333333333};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "654 /escm/messages"]}, {"isController": true, "data": [0.5, 500, 1500, "Hit_the_portal_new"]}, {"isController": false, "data": [0.5, 500, 1500, "543 /escm/"]}, {"isController": false, "data": [0.5, 500, 1500, "524 /escm/login/auth"]}, {"isController": false, "data": [0.5, 500, 1500, "545 /escm/dashboard/index"]}, {"isController": true, "data": [0.0, 500, 1500, "SP_user_login_46_new"]}, {"isController": false, "data": [1.0, 500, 1500, "650 /escm/customer/setSearchBy"]}, {"isController": true, "data": [0.0, 500, 1500, "List_Organizations_without_cache"]}, {"isController": false, "data": [1.0, 500, 1500, "673 /escm/messages"]}, {"isController": false, "data": [0.0, 500, 1500, "541 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "652 /escm/images/sidebar-bg.jpg"]}, {"isController": false, "data": [0.25, 500, 1500, "598 /escm/customer/index"]}, {"isController": false, "data": [0.5, 500, 1500, "600 /escm/customer/list"]}, {"isController": false, "data": [0.25, 500, 1500, "658 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": false, "data": [0.5, 500, 1500, "546 /escm/dashboard/myAccountInfo"]}, {"isController": false, "data": [1.0, 500, 1500, "674 /escm/messages"]}, {"isController": false, "data": [0.0, 500, 1500, "540 /success.txt"]}, {"isController": false, "data": [0.5, 500, 1500, "653 /escm/customer/listByCriteria"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.5, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["654 /escm/messages", 2, 0, 0.0, 72.0, 120.0, 120.0, 120.0, 4.623195682305088E-5, 2.0813410249439897E-5, 0.0, 24, 120]}, {"isController": true, "data": ["Hit_the_portal_new", 2, 0, 0.0, 1294.0, 1448.0, 1448.0, 1448.0, 4.629474456504328E-5, 0.026756553970135447, 0.0, 1140, 1448]}, {"isController": false, "data": ["543 /escm/", 2, 0, 0.0, 1196.5, 1442.0, 1442.0, 1442.0, 4.623054404890156E-5, 3.9598447446573785E-4, 0.0, 951, 1442]}, {"isController": false, "data": ["524 /escm/login/auth", 2, 0, 0.0, 666.5, 722.0, 722.0, 722.0, 4.629552256094239E-5, 2.7017777619549966E-4, 0.0, 611, 722]}, {"isController": false, "data": ["545 /escm/dashboard/index", 2, 0, 0.0, 1045.0, 1186.0, 1186.0, 1186.0, 4.623081762021041E-5, 3.8876325246839046E-4, 0.0, 904, 1186]}, {"isController": true, "data": ["SP_user_login_46_new", 2, 2, 100.0, 52026.5, 56674.0, 56674.0, 56674.0, 4.623563984600388E-5, 0.01566568682124058, 0.0, 47379, 56674]}, {"isController": false, "data": ["650 /escm/customer/setSearchBy", 2, 0, 0.0, 65.5, 100.0, 100.0, 100.0, 4.623197819699908E-5, 2.063282620705916E-5, 0.0, 31, 100]}, {"isController": true, "data": ["List_Organizations_without_cache", 2, 0, 0.0, 7788.0, 10776.0, 10776.0, 10776.0, 4.622057159316949E-5, 0.032261349618793525, 0.0, 4800, 10776]}, {"isController": false, "data": ["673 /escm/messages", 2, 0, 0.0, 23.5, 30.0, 30.0, 30.0, 4.623205300597342E-5, 2.0813453550540765E-5, 0.0, 17, 30]}, {"isController": false, "data": ["541 /escm/login/doAuth?id=loginform", 2, 0, 0.0, 5474.0, 9141.0, 9141.0, 9141.0, 4.622231811812488E-5, 4.327699950757053E-4, 0.0, 1807, 9141]}, {"isController": false, "data": ["652 /escm/images/sidebar-bg.jpg", 2, 0, 0.0, 22.0, 35.0, 35.0, 35.0, 4.623204766246722E-5, 7.688786832927897E-5, 0.0, 9, 35]}, {"isController": false, "data": ["598 /escm/customer/index", 2, 0, 0.0, 1569.0, 2107.0, 2107.0, 2107.0, 4.622983341981009E-5, 7.244630243043871E-4, 0.0, 1031, 2107]}, {"isController": false, "data": ["600 /escm/customer/list", 2, 0, 0.0, 1096.5, 1344.0, 1344.0, 1344.0, 4.6230648775035745E-5, 7.124666682801164E-4, 0.0, 849, 1344]}, {"isController": false, "data": ["658 /escm/customer/renderCustomerOrganizationDetails", 2, 0, 0.0, 2646.0, 4130.0, 4130.0, 4130.0, 4.622767174562391E-5, 0.001814819841806596, 0.0, 1162, 4130]}, {"isController": false, "data": ["546 /escm/dashboard/myAccountInfo", 2, 0, 0.0, 976.5, 1102.0, 1102.0, 1102.0, 4.6230907386501626E-5, 3.811792490861652E-4, 0.0, 851, 1102]}, {"isController": false, "data": ["674 /escm/messages", 2, 0, 0.0, 17.5, 18.0, 18.0, 18.0, 4.623206583039332E-5, 2.0813459324034495E-5, 0.0, 17, 18]}, {"isController": false, "data": ["540 /success.txt", 2, 2, 100.0, 42145.5, 42162.0, 42162.0, 42162.0, 4.625119174867639E-5, 9.963879784919933E-5, 0.0, 42129, 42162]}, {"isController": false, "data": ["653 /escm/customer/listByCriteria", 2, 0, 0.0, 870.5, 1157.0, 1157.0, 1157.0, 4.6230848610914405E-5, 2.0325320356087565E-4, 0.0, 584, 1157]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 30, 2, 6.666666666666667, 3859.1000000000004, 8639.90000000001, 42143.85, 42162.0, 6.933347717718732E-4, 0.005582247692414323, 0.0, 9, 42162]}}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "items": [{"isController": false, "data": ["Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 2, 100.0, 6.666666666666667]}], "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);
    
        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": ["540 /success.txt", 2, 2, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 2, null, null, null, null, null, null, null, null]}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 30, 2, "Non HTTP response code: java.net.ConnectException/Non HTTP response message: Connection timed out: connect", 2, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
