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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "72 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "99 /escm/images/favicon.ico"]}, {"isController": false, "data": [1.0, 500, 1500, "60 /escm/productOffer/offerList"]}, {"isController": false, "data": [1.0, 500, 1500, "59 /escm/productOffer/offerList"]}, {"isController": false, "data": [1.0, 500, 1500, "62 /escm/messages"]}, {"isController": true, "data": [0.0, 500, 1500, "List_offers"]}, {"isController": false, "data": [0.5, 500, 1500, "49 /escm/productOffer/index"]}, {"isController": false, "data": [0.5, 500, 1500, "65 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "66 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "65 /escm/recentItem"]}, {"isController": false, "data": [0.5, 500, 1500, "33 /escm/login/auth"]}, {"isController": false, "data": [1.0, 500, 1500, "61 /escm/productOffer/getAllService"]}, {"isController": true, "data": [0.0, 500, 1500, "Hit_the_portal"]}, {"isController": false, "data": [1.0, 500, 1500, "43 /escm/images/favicon.ico"]}, {"isController": true, "data": [0.0, 500, 1500, "sp_userlogin_46"]}, {"isController": false, "data": [1.0, 500, 1500, "63 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "67 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.7352941176470589, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["72 /escm/recentItem", 1, 0, 0.0, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 37.00086805555556, 0.0, 9, 9]}, {"isController": false, "data": ["99 /escm/images/favicon.ico", 1, 0, 0.0, 5.0, 5.0, 5.0, 5.0, 200.0, 24.4140625, 0.0, 5, 5]}, {"isController": false, "data": ["60 /escm/productOffer/offerList", 1, 0, 0.0, 143.0, 143.0, 143.0, 143.0, 6.993006993006993, 51.47781905594406, 0.0, 143, 143]}, {"isController": false, "data": ["59 /escm/productOffer/offerList", 1, 0, 0.0, 41.0, 41.0, 41.0, 41.0, 24.390243902439025, 133.81288109756096, 0.0, 41, 41]}, {"isController": false, "data": ["62 /escm/messages", 1, 0, 0.0, 12.0, 12.0, 12.0, 12.0, 83.33333333333333, 37.516276041666664, 0.0, 12, 12]}, {"isController": true, "data": ["List_offers", 1, 0, 0.0, 1616.0, 1616.0, 1616.0, 1616.0, 0.6188118811881188, 64.7715955677599, 0.0, 1616, 1616]}, {"isController": false, "data": ["49 /escm/productOffer/index", 1, 0, 0.0, 1177.0, 1177.0, 1177.0, 1177.0, 0.8496176720475787, 10.024492884451996, 0.0, 1177, 1177]}, {"isController": false, "data": ["65 /escm/login/doAuth?id=loginform", 1, 0, 0.0, 1243.0, 1243.0, 1243.0, 1243.0, 0.8045052292839903, 7.45031551689461, 0.0, 1243, 1243]}, {"isController": false, "data": ["66 /escm/recentItem", 1, 0, 0.0, 8.0, 8.0, 8.0, 8.0, 125.0, 41.6259765625, 0.0, 8, 8]}, {"isController": false, "data": ["65 /escm/recentItem", 1, 0, 0.0, 11.0, 11.0, 11.0, 11.0, 90.9090909090909, 30.2734375, 0.0, 11, 11]}, {"isController": false, "data": ["33 /escm/login/auth", 1, 0, 0.0, 543.0, 543.0, 543.0, 543.0, 1.8416206261510129, 9.398739640883978, 0.0, 543, 543]}, {"isController": false, "data": ["61 /escm/productOffer/getAllService", 1, 0, 0.0, 106.0, 106.0, 106.0, 106.0, 9.433962264150942, 4.505085495283019, 0.0, 106, 106]}, {"isController": true, "data": ["Hit_the_portal", 1, 1, 100.0, 850.0, 850.0, 850.0, 850.0, 1.176470588235294, 795.0942095588235, 0.0, 850, 850]}, {"isController": false, "data": ["43 /escm/images/favicon.ico", 1, 0, 0.0, 11.0, 11.0, 11.0, 11.0, 90.9090909090909, 16988.547585227272, 0.0, 11, 11]}, {"isController": true, "data": ["sp_userlogin_46", 1, 0, 0.0, 1907.0, 1907.0, 1907.0, 1907.0, 0.5243838489774515, 235.53898875852124, 0.0, 1907, 1907]}, {"isController": false, "data": ["63 /escm/messages", 1, 0, 0.0, 12.0, 12.0, 12.0, 12.0, 83.33333333333333, 37.516276041666664, 0.0, 12, 12]}, {"isController": false, "data": ["67 /escm/messages", 1, 0, 0.0, 12.0, 12.0, 12.0, 12.0, 83.33333333333333, 37.516276041666664, 0.0, 12, 12]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 14, 0, 0.0, 238.07142857142856, 1210.0, 1243.0, 1243.0, 11.263073209975865, 184.09813706757842, 0.0, 5, 1243]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 14, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
