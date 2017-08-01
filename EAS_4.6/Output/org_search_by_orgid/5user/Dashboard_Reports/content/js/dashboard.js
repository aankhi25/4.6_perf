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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "99 /escm/images/favicon.ico"]}, {"isController": false, "data": [0.8, 500, 1500, "385 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": false, "data": [1.0, 500, 1500, "130 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "131 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "374 /escm/images/favicon.ico"]}, {"isController": false, "data": [1.0, 500, 1500, "406 /escm/messages"]}, {"isController": false, "data": [0.9, 500, 1500, "128 /escm/customer/listByCriteria"]}, {"isController": false, "data": [1.0, 500, 1500, "381 /escm/customer/setSearchBy"]}, {"isController": false, "data": [0.5, 500, 1500, "65 /escm/login/doAuth?id=loginform"]}, {"isController": true, "data": [0.0, 500, 1500, "org_search_by_orgid"]}, {"isController": false, "data": [0.9, 500, 1500, "33 /escm/login/auth"]}, {"isController": true, "data": [0.0, 500, 1500, "Hit_the_portal"]}, {"isController": false, "data": [1.0, 500, 1500, "43 /escm/images/favicon.ico"]}, {"isController": true, "data": [0.0, 500, 1500, "sp_userlogin_46"]}, {"isController": false, "data": [0.5, 500, 1500, "129 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": false, "data": [1.0, 500, 1500, "382 /escm/customer/listByCriteria"]}, {"isController": false, "data": [1.0, 500, 1500, "384 /escm/messages"]}, {"isController": false, "data": [0.5, 500, 1500, "324 /escm/customer/index"]}, {"isController": true, "data": [0.0, 500, 1500, "List_Organizations"]}, {"isController": false, "data": [1.0, 500, 1500, "405 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.705, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["99 /escm/images/favicon.ico", 5, 0, 0.0, 5.4, 8.0, 8.0, 8.0, 625.0, 76.2939453125, 0.0, 4, 8]}, {"isController": false, "data": ["385 /escm/customer/renderCustomerOrganizationDetails", 5, 0, 0.0, 534.0, 732.0, 732.0, 732.0, 6.830601092896175, 264.78051357581967, 0.0, 361, 732]}, {"isController": false, "data": ["130 /escm/messages", 5, 0, 0.0, 8.2, 10.0, 10.0, 10.0, 500.0, 225.09765625, 0.0, 7, 10]}, {"isController": false, "data": ["131 /escm/messages", 5, 0, 0.0, 8.0, 11.0, 11.0, 11.0, 454.5454545454545, 204.63423295454547, 0.0, 6, 11]}, {"isController": false, "data": ["374 /escm/images/favicon.ico", 5, 0, 0.0, 3.6, 4.0, 4.0, 4.0, 1250.0, 152.587890625, 0.0, 3, 4]}, {"isController": false, "data": ["406 /escm/messages", 5, 0, 0.0, 7.4, 8.0, 8.0, 8.0, 625.0, 281.3720703125, 0.0, 7, 8]}, {"isController": false, "data": ["128 /escm/customer/listByCriteria", 5, 0, 0.0, 432.4, 501.0, 501.0, 501.0, 9.980039920159681, 32.50335266966068, 0.0, 402, 501]}, {"isController": false, "data": ["381 /escm/customer/setSearchBy", 5, 0, 0.0, 13.6, 19.0, 19.0, 19.0, 263.1578947368421, 117.44449013157895, 0.0, 8, 19]}, {"isController": false, "data": ["65 /escm/login/doAuth?id=loginform", 5, 0, 0.0, 1090.8, 1386.0, 1386.0, 1386.0, 3.6075036075036073, 33.76397907647908, 0.0, 982, 1386]}, {"isController": true, "data": ["org_search_by_orgid", 5, 0, 0.0, 1764.4, 1885.0, 1885.0, 1885.0, 2.6525198938992043, 391.5818758289125, 0.0, 1548, 1885]}, {"isController": false, "data": ["33 /escm/login/auth", 5, 0, 0.0, 142.2, 550.0, 550.0, 550.0, 9.09090909090909, 46.395596590909086, 0.0, 34, 550]}, {"isController": true, "data": ["Hit_the_portal", 5, 5, 100.0, 423.8, 861.0, 861.0, 861.0, 5.807200929152149, 3924.681057636469, 0.0, 293, 861]}, {"isController": false, "data": ["43 /escm/images/favicon.ico", 5, 0, 0.0, 7.2, 10.0, 10.0, 10.0, 500.0, 93437.01171875, 0.0, 6, 10]}, {"isController": true, "data": ["sp_userlogin_46", 5, 0, 0.0, 1692.2, 2029.0, 2029.0, 2029.0, 2.464268112370626, 1107.1253927427304, 0.0, 1520, 2029]}, {"isController": false, "data": ["129 /escm/customer/renderCustomerOrganizationDetails", 5, 0, 0.0, 1312.0, 1451.0, 1451.0, 1451.0, 3.445899379738112, 493.96631094934526, 0.0, 1125, 1451]}, {"isController": false, "data": ["382 /escm/customer/listByCriteria", 5, 0, 0.0, 285.4, 406.0, 406.0, 406.0, 12.315270935960593, 50.27132081280788, 0.0, 206, 406]}, {"isController": false, "data": ["384 /escm/messages", 5, 0, 0.0, 15.0, 37.0, 37.0, 37.0, 135.13513513513513, 60.837204391891895, 0.0, 9, 37]}, {"isController": false, "data": ["324 /escm/customer/index", 5, 0, 0.0, 640.2, 778.0, 778.0, 778.0, 6.426735218508997, 65.09454330012854, 0.0, 517, 778]}, {"isController": true, "data": ["List_Organizations", 5, 0, 0.0, 2272.8, 2730.0, 2730.0, 2730.0, 1.8315018315018314, 1118.333977220696, 0.0, 1786, 2730]}, {"isController": false, "data": ["405 /escm/messages", 5, 0, 0.0, 8.2, 11.0, 11.0, 11.0, 454.5454545454545, 204.63423295454547, 0.0, 6, 11]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 80, 0, 0.0, 282.1, 1033.0000000000002, 1301.4, 1451.0, 55.13439007580979, 1391.6567507322536, 0.0, 3, 1451]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 80, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
