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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "99 /escm/images/favicon.ico"]}, {"isController": false, "data": [0.5, 500, 1500, "385 /escm/customer/renderCustomerOrganizationDetails"]}, {"isController": false, "data": [1.0, 500, 1500, "374 /escm/images/favicon.ico"]}, {"isController": false, "data": [1.0, 500, 1500, "406 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "381 /escm/customer/setSearchBy"]}, {"isController": false, "data": [0.0, 500, 1500, "65 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [0.5, 500, 1500, "33 /escm/login/auth"]}, {"isController": true, "data": [0.0, 500, 1500, "Hit_the_portal"]}, {"isController": false, "data": [1.0, 500, 1500, "43 /escm/images/favicon.ico"]}, {"isController": true, "data": [0.0, 500, 1500, "sp_userlogin_46"]}, {"isController": false, "data": [1.0, 500, 1500, "382 /escm/customer/listByCriteria"]}, {"isController": false, "data": [1.0, 500, 1500, "384 /escm/messages"]}, {"isController": false, "data": [0.25, 500, 1500, "324 /escm/customer/index"]}, {"isController": true, "data": [0.0, 500, 1500, "List_Organizations"]}, {"isController": false, "data": [1.0, 500, 1500, "405 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.6166666666666667, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["99 /escm/images/favicon.ico", 2, 0, 0.0, 7.0, 9.0, 9.0, 9.0, 0.002564086127653028, 3.1299879487952E-4, 0.0, 5, 9]}, {"isController": false, "data": ["385 /escm/customer/renderCustomerOrganizationDetails", 2, 0, 0.0, 1053.5, 1324.0, 1324.0, 1324.0, 0.0025597575397658333, 0.09922810111426246, 0.0, 783, 1324]}, {"isController": false, "data": ["374 /escm/images/favicon.ico", 2, 0, 0.0, 5.5, 6.0, 6.0, 6.0, 0.002564082840388407, 3.129983936021005E-4, 0.0, 5, 6]}, {"isController": false, "data": ["406 /escm/messages", 2, 0, 0.0, 15.5, 18.0, 18.0, 18.0, 0.002564059829772068, 0.0011543277163329328, 0.0, 13, 18]}, {"isController": false, "data": ["381 /escm/customer/setSearchBy", 2, 0, 0.0, 24.0, 27.0, 27.0, 27.0, 0.002564033532430537, 0.0011443001214069878, 0.0, 21, 27]}, {"isController": false, "data": ["65 /escm/login/doAuth?id=loginform", 2, 0, 0.0, 1693.5, 1858.0, 1858.0, 1858.0, 0.0023756975641972874, 0.02198796256316386, 0.0, 1529, 1858]}, {"isController": false, "data": ["33 /escm/login/auth", 2, 0, 0.0, 593.0, 601.0, 601.0, 601.0, 0.002379250084165972, 0.012142539980323603, 0.0, 585, 601]}, {"isController": true, "data": ["Hit_the_portal", 2, 2, 100.0, 1027.5, 1117.0, 1117.0, 1117.0, 0.0023777904857469295, 1.606982329747229, 0.0, 938, 1117]}, {"isController": false, "data": ["43 /escm/images/favicon.ico", 2, 0, 0.0, 12.5, 15.0, 15.0, 15.0, 0.002380909864704797, 0.44493020585941917, 0.0, 10, 15]}, {"isController": true, "data": ["sp_userlogin_46", 2, 0, 0.0, 2441.0, 2594.0, 2594.0, 2594.0, 0.002373622408894438, 1.0661539969872798, 0.0, 2288, 2594]}, {"isController": false, "data": ["382 /escm/customer/listByCriteria", 2, 0, 0.0, 427.5, 488.0, 488.0, 488.0, 0.00256249935937516, 0.010460202463074383, 0.0, 367, 488]}, {"isController": false, "data": ["384 /escm/messages", 2, 0, 0.0, 14.0, 14.0, 14.0, 14.0, 0.002564056542574877, 0.0011543262364521662, 0.0, 14, 14]}, {"isController": false, "data": ["324 /escm/customer/index", 2, 0, 0.0, 1346.5, 2025.0, 2025.0, 2025.0, 0.002557462996707266, 0.025906800453949684, 0.0, 668, 2025]}, {"isController": true, "data": ["List_Organizations", 2, 0, 0.0, 3983.0, 5036.0, 5036.0, 5036.0, 0.0025476538655552104, 1.5556287983926853, 0.0, 2930, 5036]}, {"isController": false, "data": ["405 /escm/messages", 2, 0, 0.0, 14.0, 17.0, 17.0, 17.0, 0.0025640466810338746, 0.0011543217968326331, 0.0, 11, 17]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 24, 0, 0.0, 433.87500000000006, 1693.5, 1983.25, 2025.0, 0.02850271666518215, 0.6086529218995873, 0.0, 5, 2025]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 24, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
