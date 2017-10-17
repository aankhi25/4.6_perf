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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [0.5, 500, 1500, "675 /escm/login/auth"]}, {"isController": true, "data": [0.0, 500, 1500, "List_offers_46_SP_with_cache"]}, {"isController": false, "data": [0.5, 500, 1500, "680 /escm/dashboard/myAccountInfo"]}, {"isController": false, "data": [0.5, 500, 1500, "143 /escm/productOffer/index"]}, {"isController": false, "data": [0.5, 500, 1500, "676 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [0.5, 500, 1500, "144 /escm/productOffer/list"]}, {"isController": true, "data": [0.0, 500, 1500, "SP_user_login_46_with_cache"]}, {"isController": false, "data": [1.0, 500, 1500, "147 /escm/productOffer/getAllService"]}, {"isController": false, "data": [1.0, 500, 1500, "146 /escm/productOffer/offerList"]}, {"isController": false, "data": [1.0, 500, 1500, "149 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "150 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "151 /escm/recentItem"]}, {"isController": true, "data": [0.5, 500, 1500, "Hit_the_portal_with-cache"]}, {"isController": false, "data": [1.0, 500, 1500, "148 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.6428571428571429, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["675 /escm/login/auth", 1, 0, 0.0, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 10.256480667838314, 0.0, 569, 569]}, {"isController": true, "data": ["List_offers_46_SP_with_cache", 1, 0, 0.0, 1712.0, 1712.0, 1712.0, 1712.0, 0.5841121495327103, 20.90539664865654, 0.0, 1712, 1712]}, {"isController": false, "data": ["680 /escm/dashboard/myAccountInfo", 1, 0, 0.0, 681.0, 681.0, 681.0, 681.0, 1.4684287812041115, 12.11453744493392, 0.0, 681, 681]}, {"isController": false, "data": ["143 /escm/productOffer/index", 1, 0, 0.0, 702.0, 702.0, 702.0, 702.0, 1.4245014245014245, 17.466835826210826, 0.0, 702, 702]}, {"isController": false, "data": ["676 /escm/login/doAuth?id=loginform", 1, 0, 0.0, 1103.0, 1103.0, 1103.0, 1103.0, 0.9066183136899365, 8.493349104714415, 0.0, 1103, 1103]}, {"isController": false, "data": ["144 /escm/productOffer/list", 1, 0, 0.0, 667.0, 667.0, 667.0, 667.0, 1.4992503748125936, 18.146200337331333, 0.0, 667, 667]}, {"isController": true, "data": ["SP_user_login_46_with_cache", 1, 0, 0.0, 1784.0, 1784.0, 1784.0, 1784.0, 0.5605381165919282, 9.875652501401346, 0.0, 1784, 1784]}, {"isController": false, "data": ["147 /escm/productOffer/getAllService", 1, 0, 0.0, 142.0, 142.0, 142.0, 142.0, 7.042253521126761, 3.3629511443661975, 0.0, 142, 142]}, {"isController": false, "data": ["146 /escm/productOffer/offerList", 1, 0, 0.0, 152.0, 152.0, 152.0, 152.0, 6.578947368421052, 61.71618009868421, 0.0, 152, 152]}, {"isController": false, "data": ["149 /escm/recentItem", 1, 0, 0.0, 13.0, 13.0, 13.0, 13.0, 76.92307692307693, 25.615985576923077, 0.0, 13, 13]}, {"isController": false, "data": ["150 /escm/messages", 1, 0, 0.0, 13.0, 13.0, 13.0, 13.0, 76.92307692307693, 34.63040865384615, 0.0, 13, 13]}, {"isController": false, "data": ["151 /escm/recentItem", 1, 0, 0.0, 10.0, 10.0, 10.0, 10.0, 100.0, 33.30078125, 0.0, 10, 10]}, {"isController": true, "data": ["Hit_the_portal_with-cache", 1, 0, 0.0, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 10.256480667838314, 0.0, 569, 569]}, {"isController": false, "data": ["148 /escm/messages", 1, 0, 0.0, 13.0, 13.0, 13.0, 13.0, 76.92307692307693, 34.63040865384615, 0.0, 13, 13]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 11, 0, 0.0, 369.54545454545456, 1022.8000000000003, 1103.0, 1103.0, 9.972801450589301, 53.71182286944696, 0.0, 10, 1103]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 11, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
