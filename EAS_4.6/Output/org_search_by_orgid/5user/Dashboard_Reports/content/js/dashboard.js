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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "684 /escm/customer/setSearchBy"]}, {"isController": false, "data": [0.5, 500, 1500, "681 /escm/customer/index"]}, {"isController": false, "data": [0.8, 500, 1500, "11 /escm/customer/listByCriteria"]}, {"isController": false, "data": [0.9, 500, 1500, "675 /escm/login/auth"]}, {"isController": false, "data": [1.0, 500, 1500, "688 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "14 /escm/messages"]}, {"isController": false, "data": [0.5, 500, 1500, "680 /escm/dashboard/myAccountInfo"]}, {"isController": true, "data": [0.0, 500, 1500, "List_organizations_with_cache"]}, {"isController": false, "data": [1.0, 500, 1500, "685 /escm/customer/listByCriteria"]}, {"isController": false, "data": [0.0, 500, 1500, "12 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": false, "data": [0.5, 500, 1500, "676 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [0.5, 500, 1500, "682 /escm/customer/list"]}, {"isController": false, "data": [1.0, 500, 1500, "13 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "686 /escm/messages"]}, {"isController": true, "data": [0.0, 500, 1500, "organization_search_by_organization_id_with_cache"]}, {"isController": false, "data": [1.0, 500, 1500, "689 /escm/messages"]}, {"isController": true, "data": [0.0, 500, 1500, "SP_user_login_46_with_cache"]}, {"isController": false, "data": [0.5, 500, 1500, "687 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": true, "data": [0.9, 500, 1500, "Hit_the_portal_with-cache"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.6368421052631579, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["684 /escm/customer/setSearchBy", 5, 0, 0.0, 15.4, 19.0, 19.0, 19.0, 263.1578947368421, 117.44449013157895, 0.0, 12, 19]}, {"isController": false, "data": ["681 /escm/customer/index", 5, 0, 0.0, 964.8, 1122.0, 1122.0, 1122.0, 4.45632798573975, 69.83466326871657, 0.0, 844, 1122]}, {"isController": false, "data": ["11 /escm/customer/listByCriteria", 5, 0, 0.0, 504.6, 531.0, 531.0, 531.0, 9.416195856873822, 30.694591572504706, 0.0, 475, 531]}, {"isController": false, "data": ["675 /escm/login/auth", 5, 0, 0.0, 153.2, 539.0, 539.0, 539.0, 9.27643784786642, 54.13671150278293, 0.0, 40, 539]}, {"isController": false, "data": ["688 /escm/messages", 5, 0, 0.0, 16.4, 28.0, 28.0, 28.0, 178.57142857142858, 80.39202008928571, 0.0, 10, 28]}, {"isController": false, "data": ["14 /escm/messages", 5, 0, 0.0, 12.2, 17.0, 17.0, 17.0, 294.11764705882354, 132.41038602941177, 0.0, 8, 17]}, {"isController": false, "data": ["680 /escm/dashboard/myAccountInfo", 5, 0, 0.0, 899.0, 989.0, 989.0, 989.0, 5.055611729019211, 41.682136311931245, 0.0, 787, 989]}, {"isController": true, "data": ["List_organizations_with_cache", 5, 0, 0.0, 2819.2, 2898.0, 2898.0, 2898.0, 1.725327812284334, 131.80426155969633, 0.0, 2681, 2898]}, {"isController": false, "data": ["685 /escm/customer/listByCriteria", 5, 0, 0.0, 284.0, 391.0, 391.0, 391.0, 12.78772378516624, 55.10959478900256, 0.0, 209, 391]}, {"isController": false, "data": ["12 /escm/customer/renderCustomerOrganizationDetails", 5, 0, 0.0, 1762.8, 1971.0, 1971.0, 1971.0, 2.536783358701167, 365.2398251204972, 0.0, 1544, 1971]}, {"isController": false, "data": ["676 /escm/login/doAuth?id=loginform", 5, 0, 0.0, 1183.6, 1334.0, 1334.0, 1334.0, 3.7481259370314843, 35.09475730884557, 0.0, 1056, 1334]}, {"isController": false, "data": ["682 /escm/customer/list", 5, 0, 0.0, 936.2, 1001.0, 1001.0, 1001.0, 4.995004995004995, 76.97868537712289, 0.0, 854, 1001]}, {"isController": false, "data": ["13 /escm/messages", 5, 0, 0.0, 24.0, 61.0, 61.0, 61.0, 81.96721311475409, 36.90125512295082, 0.0, 10, 61]}, {"isController": false, "data": ["686 /escm/messages", 5, 0, 0.0, 12.4, 17.0, 17.0, 17.0, 294.11764705882354, 132.41038602941177, 0.0, 9, 17]}, {"isController": true, "data": ["organization_search_by_organization_id_with_cache", 5, 0, 0.0, 2303.6, 2491.0, 2491.0, 2491.0, 2.007226013649137, 297.3458356332798, 0.0, 2052, 2491]}, {"isController": false, "data": ["689 /escm/messages", 5, 0, 0.0, 13.6, 23.0, 23.0, 23.0, 217.3913043478261, 97.86854619565217, 0.0, 9, 23]}, {"isController": true, "data": ["SP_user_login_46_with_cache", 5, 0, 0.0, 2082.6, 2307.0, 2307.0, 2307.0, 2.167316861725184, 38.162132233420024, 0.0, 1867, 2307]}, {"isController": false, "data": ["687 /escm/customer/renderCustomerOrganizationDetails", 5, 0, 0.0, 576.2, 617.0, 617.0, 617.0, 8.103727714748784, 317.7088609197731, 0.0, 505, 617]}, {"isController": true, "data": ["Hit_the_portal_with-cache", 5, 0, 0.0, 153.2, 539.0, 539.0, 539.0, 9.27643784786642, 54.13671150278293, 0.0, 40, 539]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 75, 0, 0.0, 490.5599999999999, 1181.2, 1629.0000000000007, 1971.0, 38.051750380517504, 629.0598443049213, 0.0, 8, 1971]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 75, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
