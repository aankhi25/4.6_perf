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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "684 /escm/customer/setSearchBy"]}, {"isController": false, "data": [0.5, 500, 1500, "681 /escm/customer/index"]}, {"isController": false, "data": [0.5, 500, 1500, "675 /escm/login/auth"]}, {"isController": true, "data": [0.0, 500, 1500, "46_Org_search_by_orgname_withcache"]}, {"isController": false, "data": [1.0, 500, 1500, "229 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "688 /escm/messages"]}, {"isController": false, "data": [0.5, 500, 1500, "680 /escm/dashboard/myAccountInfo"]}, {"isController": true, "data": [0.0, 500, 1500, "List_organizations_with_cache"]}, {"isController": false, "data": [0.5, 500, 1500, "227 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": false, "data": [1.0, 500, 1500, "685 /escm/customer/listByCriteria"]}, {"isController": false, "data": [0.5, 500, 1500, "676 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [0.5, 500, 1500, "682 /escm/customer/list"]}, {"isController": false, "data": [1.0, 500, 1500, "686 /escm/messages"]}, {"isController": false, "data": [0.0, 500, 1500, "226 /escm/customer/listByCriteria"]}, {"isController": false, "data": [1.0, 500, 1500, "689 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "228 /escm/messages"]}, {"isController": true, "data": [0.0, 500, 1500, "SP_user_login_46_with_cache"]}, {"isController": false, "data": [0.5, 500, 1500, "687 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": true, "data": [0.5, 500, 1500, "Hit_the_portal_with-cache"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.5789473684210527, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["684 /escm/customer/setSearchBy", 1, 0, 0.0, 24.0, 24.0, 24.0, 24.0, 41.666666666666664, 18.595377604166668, 0.0, 24, 24]}, {"isController": false, "data": ["681 /escm/customer/index", 1, 0, 0.0, 766.0, 766.0, 766.0, 766.0, 1.3054830287206267, 20.458091954960835, 0.0, 766, 766]}, {"isController": false, "data": ["675 /escm/login/auth", 1, 0, 0.0, 565.0, 565.0, 565.0, 565.0, 1.7699115044247788, 10.329092920353983, 0.0, 565, 565]}, {"isController": true, "data": ["46_Org_search_by_orgname_withcache", 1, 0, 0.0, 2866.0, 2866.0, 2866.0, 2866.0, 0.34891835310537334, 15.229400187543614, 0.0, 2866, 2866]}, {"isController": false, "data": ["229 /escm/messages", 1, 0, 0.0, 16.0, 16.0, 16.0, 16.0, 62.5, 28.13720703125, 0.0, 16, 16]}, {"isController": false, "data": ["688 /escm/messages", 1, 0, 0.0, 21.0, 21.0, 21.0, 21.0, 47.61904761904761, 21.437872023809522, 0.0, 21, 21]}, {"isController": false, "data": ["680 /escm/dashboard/myAccountInfo", 1, 0, 0.0, 725.0, 725.0, 725.0, 725.0, 1.379310344827586, 11.372575431034484, 0.0, 725, 725]}, {"isController": true, "data": ["List_organizations_with_cache", 1, 0, 0.0, 2815.0, 2815.0, 2815.0, 2815.0, 0.3552397868561279, 27.138723912078152, 0.0, 2815, 2815]}, {"isController": false, "data": ["227 /escm/customer/renderCustomerOrganizationDetails", 1, 0, 0.0, 756.0, 756.0, 756.0, 756.0, 1.3227513227513228, 51.693225033068785, 0.0, 756, 756]}, {"isController": false, "data": ["685 /escm/customer/listByCriteria", 1, 0, 0.0, 360.0, 360.0, 360.0, 360.0, 2.7777777777777777, 11.971028645833334, 0.0, 360, 360]}, {"isController": false, "data": ["676 /escm/login/doAuth?id=loginform", 1, 0, 0.0, 1290.0, 1290.0, 1290.0, 1290.0, 0.7751937984496124, 7.259114583333333, 0.0, 1290, 1290]}, {"isController": false, "data": ["682 /escm/customer/list", 1, 0, 0.0, 758.0, 758.0, 758.0, 758.0, 1.3192612137203166, 20.331309779023748, 0.0, 758, 758]}, {"isController": false, "data": ["686 /escm/messages", 1, 0, 0.0, 18.0, 18.0, 18.0, 18.0, 55.55555555555555, 25.010850694444446, 0.0, 18, 18]}, {"isController": false, "data": ["226 /escm/customer/listByCriteria", 1, 0, 0.0, 2079.0, 2079.0, 2079.0, 2079.0, 0.48100048100048104, 1.7638250060125058, 0.0, 2079, 2079]}, {"isController": false, "data": ["689 /escm/messages", 1, 0, 0.0, 15.0, 15.0, 15.0, 15.0, 66.66666666666667, 30.013020833333336, 0.0, 15, 15]}, {"isController": false, "data": ["228 /escm/messages", 1, 0, 0.0, 15.0, 15.0, 15.0, 15.0, 66.66666666666667, 30.013020833333336, 0.0, 15, 15]}, {"isController": true, "data": ["SP_user_login_46_with_cache", 1, 0, 0.0, 2015.0, 2015.0, 2015.0, 2015.0, 0.49627791563275436, 8.739143920595533, 0.0, 2015, 2015]}, {"isController": false, "data": ["687 /escm/customer/renderCustomerOrganizationDetails", 1, 0, 0.0, 853.0, 853.0, 853.0, 853.0, 1.1723329425556857, 45.96369431418523, 0.0, 853, 853]}, {"isController": true, "data": ["Hit_the_portal_with-cache", 1, 0, 0.0, 565.0, 565.0, 565.0, 565.0, 1.7699115044247788, 10.329092920353983, 0.0, 565, 565]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 15, 0, 0.0, 550.7333333333332, 1605.6000000000004, 2079.0, 2079.0, 7.215007215007215, 69.01793229918229, 0.0, 15, 2079]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 15, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
