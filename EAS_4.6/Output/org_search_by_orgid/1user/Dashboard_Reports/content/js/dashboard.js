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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "684 /escm/customer/setSearchBy"]}, {"isController": false, "data": [0.5, 500, 1500, "681 /escm/customer/index"]}, {"isController": false, "data": [0.5, 500, 1500, "11 /escm/customer/listByCriteria"]}, {"isController": false, "data": [0.5, 500, 1500, "675 /escm/login/auth"]}, {"isController": false, "data": [1.0, 500, 1500, "688 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "14 /escm/messages"]}, {"isController": false, "data": [0.5, 500, 1500, "680 /escm/dashboard/myAccountInfo"]}, {"isController": true, "data": [0.0, 500, 1500, "List_organizations_with_cache"]}, {"isController": false, "data": [1.0, 500, 1500, "685 /escm/customer/listByCriteria"]}, {"isController": false, "data": [0.5, 500, 1500, "12 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": false, "data": [0.5, 500, 1500, "676 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [0.5, 500, 1500, "682 /escm/customer/list"]}, {"isController": false, "data": [1.0, 500, 1500, "13 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "686 /escm/messages"]}, {"isController": true, "data": [0.0, 500, 1500, "organization_search_by_organization_id_with_cache"]}, {"isController": false, "data": [1.0, 500, 1500, "689 /escm/messages"]}, {"isController": true, "data": [0.0, 500, 1500, "SP_user_login_46_with_cache"]}, {"isController": false, "data": [0.5, 500, 1500, "687 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": true, "data": [0.5, 500, 1500, "Hit_the_portal_with-cache"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.6052631578947368, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["684 /escm/customer/setSearchBy", 1, 0, 0.0, 22.0, 22.0, 22.0, 22.0, 45.45454545454545, 20.28586647727273, 0.0, 22, 22]}, {"isController": false, "data": ["681 /escm/customer/index", 1, 0, 0.0, 704.0, 704.0, 704.0, 704.0, 1.4204545454545454, 22.25979891690341, 0.0, 704, 704]}, {"isController": false, "data": ["11 /escm/customer/listByCriteria", 1, 0, 0.0, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 6.185513519924099, 0.0, 527, 527]}, {"isController": false, "data": ["675 /escm/login/auth", 1, 0, 0.0, 629.0, 629.0, 629.0, 629.0, 1.589825119236884, 9.278120031796503, 0.0, 629, 629]}, {"isController": false, "data": ["688 /escm/messages", 1, 0, 0.0, 11.0, 11.0, 11.0, 11.0, 90.9090909090909, 40.92684659090909, 0.0, 11, 11]}, {"isController": false, "data": ["14 /escm/messages", 1, 0, 0.0, 10.0, 10.0, 10.0, 10.0, 100.0, 45.01953125, 0.0, 10, 10]}, {"isController": false, "data": ["680 /escm/dashboard/myAccountInfo", 1, 0, 0.0, 755.0, 755.0, 755.0, 755.0, 1.3245033112582782, 10.91809809602649, 0.0, 755, 755]}, {"isController": true, "data": ["List_organizations_with_cache", 1, 0, 0.0, 2293.0, 2293.0, 2293.0, 2293.0, 0.4361098996947231, 33.31641136066288, 0.0, 2293, 2293]}, {"isController": false, "data": ["685 /escm/customer/listByCriteria", 1, 0, 0.0, 344.0, 344.0, 344.0, 344.0, 2.9069767441860463, 12.527820675872094, 0.0, 344, 344]}, {"isController": false, "data": ["12 /escm/customer/renderCustomerOrganizationDetails", 1, 0, 0.0, 1288.0, 1288.0, 1288.0, 1288.0, 0.7763975155279502, 111.78456182065217, 0.0, 1288, 1288]}, {"isController": false, "data": ["676 /escm/login/doAuth?id=loginform", 1, 0, 0.0, 1234.0, 1234.0, 1234.0, 1234.0, 0.8103727714748784, 7.587748176661265, 0.0, 1234, 1234]}, {"isController": false, "data": ["682 /escm/customer/list", 1, 0, 0.0, 686.0, 686.0, 686.0, 686.0, 1.4577259475218658, 22.46520818148688, 0.0, 686, 686]}, {"isController": false, "data": ["13 /escm/messages", 1, 0, 0.0, 10.0, 10.0, 10.0, 10.0, 100.0, 45.01953125, 0.0, 10, 10]}, {"isController": false, "data": ["686 /escm/messages", 1, 0, 0.0, 13.0, 13.0, 13.0, 13.0, 76.92307692307693, 34.63040865384615, 0.0, 13, 13]}, {"isController": true, "data": ["organization_search_by_organization_id_with_cache", 1, 0, 0.0, 1835.0, 1835.0, 1835.0, 1835.0, 0.5449591280653951, 80.72952145776567, 0.0, 1835, 1835]}, {"isController": false, "data": ["689 /escm/messages", 1, 0, 0.0, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 50.02170138888889, 0.0, 9, 9]}, {"isController": true, "data": ["SP_user_login_46_with_cache", 1, 0, 0.0, 1989.0, 1989.0, 1989.0, 1989.0, 0.5027652086475616, 8.851908151080945, 0.0, 1989, 1989]}, {"isController": false, "data": ["687 /escm/customer/renderCustomerOrganizationDetails", 1, 0, 0.0, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 77.78979104662699, 0.0, 504, 504]}, {"isController": true, "data": ["Hit_the_portal_with-cache", 1, 0, 0.0, 629.0, 629.0, 629.0, 629.0, 1.589825119236884, 9.278120031796503, 0.0, 629, 629]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 15, 0, 0.0, 449.7333333333334, 1255.6, 1288.0, 1288.0, 11.645962732919253, 192.52762883346273, 0.0, 9, 1288]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 15, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
