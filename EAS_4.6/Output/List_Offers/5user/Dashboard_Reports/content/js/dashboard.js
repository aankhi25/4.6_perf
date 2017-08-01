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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "72 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "99 /escm/images/favicon.ico"]}, {"isController": false, "data": [1.0, 500, 1500, "60 /escm/productOffer/offerList"]}, {"isController": false, "data": [1.0, 500, 1500, "59 /escm/productOffer/offerList"]}, {"isController": false, "data": [1.0, 500, 1500, "62 /escm/messages"]}, {"isController": true, "data": [0.2, 500, 1500, "List_offers"]}, {"isController": false, "data": [0.5, 500, 1500, "49 /escm/productOffer/index"]}, {"isController": false, "data": [0.4, 500, 1500, "65 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "66 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "65 /escm/recentItem"]}, {"isController": false, "data": [0.9, 500, 1500, "33 /escm/login/auth"]}, {"isController": false, "data": [1.0, 500, 1500, "61 /escm/productOffer/getAllService"]}, {"isController": true, "data": [0.0, 500, 1500, "Hit_the_portal"]}, {"isController": false, "data": [1.0, 500, 1500, "43 /escm/images/favicon.ico"]}, {"isController": true, "data": [0.0, 500, 1500, "sp_userlogin_46"]}, {"isController": false, "data": [1.0, 500, 1500, "63 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "67 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.7647058823529411, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["72 /escm/recentItem", 5, 0, 0.0, 20.6, 68.0, 68.0, 68.0, 0.08331666999933346, 0.027745102021262413, 0.0, 7, 68]}, {"isController": false, "data": ["99 /escm/images/favicon.ico", 5, 0, 0.0, 7.4, 12.0, 12.0, 12.0, 0.08332083520805213, 0.010171000391607926, 0.0, 4, 12]}, {"isController": false, "data": ["60 /escm/productOffer/offerList", 5, 0, 0.0, 189.0, 208.0, 208.0, 208.0, 0.08304544246611746, 0.6113247512788998, 0.0, 165, 208]}, {"isController": false, "data": ["59 /escm/productOffer/offerList", 5, 0, 0.0, 59.0, 91.0, 91.0, 91.0, 0.083236224404861, 0.45666123897120026, 0.0, 29, 91]}, {"isController": false, "data": ["62 /escm/messages", 5, 0, 0.0, 12.2, 17.0, 17.0, 17.0, 0.08330972891014213, 0.03750564944099172, 0.0, 7, 17]}, {"isController": true, "data": ["List_offers", 5, 0, 0.0, 1538.0, 1878.0, 1878.0, 1878.0, 0.08154877432192194, 8.535592344812683, 0.0, 1104, 1878]}, {"isController": false, "data": ["49 /escm/productOffer/index", 5, 0, 0.0, 1025.0, 1346.0, 1346.0, 1346.0, 0.08201292523701736, 0.9674641911065184, 0.0, 776, 1346]}, {"isController": false, "data": ["65 /escm/login/doAuth?id=loginform", 5, 0, 0.0, 1305.4, 1612.0, 1612.0, 1612.0, 3.101736972704715, 28.706212197580644, 0.0, 1123, 1612]}, {"isController": false, "data": ["66 /escm/recentItem", 5, 0, 0.0, 8.6, 10.0, 10.0, 10.0, 0.08331944675887352, 0.02774602670388269, 0.0, 6, 10]}, {"isController": false, "data": ["65 /escm/recentItem", 5, 0, 0.0, 9.8, 15.0, 15.0, 15.0, 0.08332083520805213, 0.027746489068306422, 0.0, 7, 15]}, {"isController": false, "data": ["33 /escm/login/auth", 5, 0, 0.0, 167.4, 588.0, 588.0, 588.0, 8.503401360544219, 43.397241709183675, 0.0, 42, 588]}, {"isController": false, "data": ["61 /escm/productOffer/getAllService", 5, 0, 0.0, 50.0, 147.0, 147.0, 147.0, 0.08327226700419692, 0.03976576031743388, 0.0, 15, 147]}, {"isController": true, "data": ["Hit_the_portal", 5, 5, 100.0, 574.8, 945.0, 945.0, 945.0, 5.291005291005291, 3575.8205191798943, 0.0, 360, 945]}, {"isController": false, "data": ["43 /escm/images/favicon.ico", 5, 0, 0.0, 9.6, 12.0, 12.0, 12.0, 416.6666666666667, 77864.17643229167, 0.0, 6, 12]}, {"isController": true, "data": ["sp_userlogin_46", 5, 0, 0.0, 2116.8, 2476.0, 2476.0, 2476.0, 2.0193861066235863, 907.0415835773425, 0.0, 1911, 2476]}, {"isController": false, "data": ["63 /escm/messages", 5, 0, 0.0, 12.0, 17.0, 17.0, 17.0, 0.0833152816889674, 0.0375081492759902, 0.0, 8, 17]}, {"isController": false, "data": ["67 /escm/messages", 5, 0, 0.0, 15.6, 27.0, 27.0, 27.0, 0.08329862557267805, 0.03750065077051229, 0.0, 8, 27]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 70, 0, 0.0, 206.54285714285714, 1071.2999999999997, 1290.15, 1612.0, 1.1481809533182428, 18.766671689958336, 0.0, 4, 1612]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 70, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
