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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "99 /escm/images/favicon.ico"]}, {"isController": false, "data": [0.5, 500, 1500, "385 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": false, "data": [1.0, 500, 1500, "130 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "131 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "374 /escm/images/favicon.ico"]}, {"isController": false, "data": [1.0, 500, 1500, "406 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "128 /escm/customer/listByCriteria"]}, {"isController": false, "data": [1.0, 500, 1500, "381 /escm/customer/setSearchBy"]}, {"isController": false, "data": [0.0, 500, 1500, "65 /escm/login/doAuth?id=loginform"]}, {"isController": true, "data": [0.0, 500, 1500, "org_search_by_orgid"]}, {"isController": false, "data": [0.5, 500, 1500, "33 /escm/login/auth"]}, {"isController": true, "data": [0.0, 500, 1500, "Hit_the_portal"]}, {"isController": false, "data": [1.0, 500, 1500, "43 /escm/images/favicon.ico"]}, {"isController": true, "data": [0.0, 500, 1500, "sp_userlogin_46"]}, {"isController": false, "data": [0.5, 500, 1500, "129 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": false, "data": [1.0, 500, 1500, "382 /escm/customer/listByCriteria"]}, {"isController": false, "data": [1.0, 500, 1500, "384 /escm/messages"]}, {"isController": false, "data": [0.0, 500, 1500, "324 /escm/customer/index"]}, {"isController": true, "data": [0.0, 500, 1500, "List_Organizations"]}, {"isController": false, "data": [1.0, 500, 1500, "405 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.625, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["99 /escm/images/favicon.ico", 1, 0, 0.0, 5.0, 5.0, 5.0, 5.0, 200.0, 24.4140625, 0.0, 5, 5]}, {"isController": false, "data": ["385 /escm/customer/renderCustomerOrganizationDetails", 1, 0, 0.0, 603.0, 603.0, 603.0, 603.0, 1.658374792703151, 64.28631581674959, 0.0, 603, 603]}, {"isController": false, "data": ["130 /escm/messages", 1, 0, 0.0, 8.0, 8.0, 8.0, 8.0, 125.0, 56.2744140625, 0.0, 8, 8]}, {"isController": false, "data": ["131 /escm/messages", 1, 0, 0.0, 7.0, 7.0, 7.0, 7.0, 142.85714285714286, 64.31361607142857, 0.0, 7, 7]}, {"isController": false, "data": ["374 /escm/images/favicon.ico", 1, 0, 0.0, 4.0, 4.0, 4.0, 4.0, 250.0, 30.517578125, 0.0, 4, 4]}, {"isController": false, "data": ["406 /escm/messages", 1, 0, 0.0, 8.0, 8.0, 8.0, 8.0, 125.0, 56.2744140625, 0.0, 8, 8]}, {"isController": false, "data": ["128 /escm/customer/listByCriteria", 1, 0, 0.0, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 7.904941595873787, 0.0, 412, 412]}, {"isController": false, "data": ["381 /escm/customer/setSearchBy", 1, 0, 0.0, 15.0, 15.0, 15.0, 15.0, 66.66666666666667, 29.752604166666668, 0.0, 15, 15]}, {"isController": false, "data": ["65 /escm/login/doAuth?id=loginform", 1, 0, 0.0, 6939.0, 6939.0, 6939.0, 6939.0, 0.14411298457991067, 1.3488074650526012, 0.0, 6939, 6939]}, {"isController": true, "data": ["org_search_by_orgid", 1, 0, 0.0, 1633.0, 1633.0, 1633.0, 1633.0, 0.612369871402327, 90.40110226576853, 0.0, 1633, 1633]}, {"isController": false, "data": ["33 /escm/login/auth", 1, 0, 0.0, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 9.684090370018975, 0.0, 527, 527]}, {"isController": true, "data": ["Hit_the_portal", 1, 1, 100.0, 842.0, 842.0, 842.0, 842.0, 1.187648456057007, 802.6485488420428, 0.0, 842, 842]}, {"isController": false, "data": ["43 /escm/images/favicon.ico", 1, 0, 0.0, 10.0, 10.0, 10.0, 10.0, 100.0, 18687.40234375, 0.0, 10, 10]}, {"isController": true, "data": ["sp_userlogin_46", 1, 0, 0.0, 7559.0, 7559.0, 7559.0, 7559.0, 0.13229263130043656, 59.43530683622172, 0.0, 7559, 7559]}, {"isController": false, "data": ["129 /escm/customer/renderCustomerOrganizationDetails", 1, 0, 0.0, 1201.0, 1201.0, 1201.0, 1201.0, 0.8326394671107411, 119.35691611157368, 0.0, 1201, 1201]}, {"isController": false, "data": ["382 /escm/customer/listByCriteria", 1, 0, 0.0, 339.0, 339.0, 339.0, 339.0, 2.949852507374631, 12.0413901179941, 0.0, 339, 339]}, {"isController": false, "data": ["384 /escm/messages", 1, 0, 0.0, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 50.02170138888889, 0.0, 9, 9]}, {"isController": false, "data": ["324 /escm/customer/index", 1, 0, 0.0, 2759.0, 2759.0, 2759.0, 2759.0, 0.3624501631025734, 3.67157767760058, 0.0, 2759, 2759]}, {"isController": true, "data": ["List_Organizations", 1, 0, 0.0, 4503.0, 4503.0, 4503.0, 4503.0, 0.22207417277370642, 135.60122244892293, 0.0, 4503, 4503]}, {"isController": false, "data": ["405 /escm/messages", 1, 0, 0.0, 13.0, 13.0, 13.0, 13.0, 76.92307692307693, 34.63040865384615, 0.0, 13, 13]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 16, 0, 0.0, 803.6875, 4013.0000000000027, 6939.0, 6939.0, 0.25494351407766214, 6.435083015981771, 0.0, 4, 6939]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 16, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
