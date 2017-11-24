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

    var data = {"KoPercent": 40.0, "OkPercent": 60.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [0.45, 500, 1500, "168 /escm/productOffer/showOfferDetails"]}, {"isController": true, "data": [0.0, 500, 1500, "Offer_search_by_offerid_46_with_cache"]}, {"isController": false, "data": [0.975, 500, 1500, "675 /escm/login/auth"]}, {"isController": false, "data": [1.0, 500, 1500, "170 /escm/recentItem"]}, {"isController": false, "data": [0.0, 500, 1500, "167 /escm/productOffer/productModelSearch/productModelSearch"]}, {"isController": false, "data": [0.7, 500, 1500, "680 /escm/dashboard/myAccountInfo"]}, {"isController": false, "data": [0.975, 500, 1500, "143 /escm/productOffer/index"]}, {"isController": true, "data": [0.0, 500, 1500, "List_offers_46_SP_with_cache"]}, {"isController": false, "data": [1.0, 500, 1500, "144 /escm/productOffer/list"]}, {"isController": false, "data": [0.35, 500, 1500, "676 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "169 /escm/messages"]}, {"isController": true, "data": [0.2, 500, 1500, "SP_user_login_46_with_cache"]}, {"isController": false, "data": [0.0, 500, 1500, "147 /escm/productOffer/getAllService"]}, {"isController": false, "data": [0.0, 500, 1500, "146 /escm/productOffer/offerList"]}, {"isController": false, "data": [0.0, 500, 1500, "149 /escm/recentItem"]}, {"isController": false, "data": [0.0, 500, 1500, "150 /escm/messages"]}, {"isController": false, "data": [0.0, 500, 1500, "151 /escm/recentItem"]}, {"isController": true, "data": [0.975, 500, 1500, "Hit_the_portal_with-cache"]}, {"isController": false, "data": [0.0, 500, 1500, "148 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.40131578947368424, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["168 /escm/productOffer/showOfferDetails", 20, 0, 0.0, 1065.3, 1843.400000000001, 1964.0, 1968.0, 10.16260162601626, 99.4163451155996, 0.0, 585, 1968]}, {"isController": true, "data": ["Offer_search_by_offerid_46_with_cache", 20, 0, 0.0, 3490.85, 4411.8, 4798.15, 4817.0, 0.3085610256568493, 10.34191695465696, 0.0, 2177, 4817]}, {"isController": false, "data": ["675 /escm/login/auth", 20, 0, 0.0, 141.3, 388.6000000000002, 654.4499999999998, 668.0, 0.3311422752785735, 1.9325256221335498, 0.0, 45, 668]}, {"isController": false, "data": ["170 /escm/recentItem", 20, 0, 0.0, 15.049999999999997, 27.0, 29.849999999999998, 30.0, 666.6666666666666, 222.00520833333334, 0.0, 8, 30]}, {"isController": false, "data": ["167 /escm/productOffer/productModelSearch/productModelSearch", 20, 0, 0.0, 2395.6000000000004, 3019.7000000000003, 3384.6499999999996, 3403.0, 0.31544248694856714, 7.239666917377726, 0.0, 1543, 3403]}, {"isController": false, "data": ["680 /escm/dashboard/myAccountInfo", 20, 0, 0.0, 902.9, 1452.0, 2119.8499999999995, 2155.0, 0.32177620464966616, 2.644063983187193, 0.0, 313, 2155]}, {"isController": false, "data": ["143 /escm/productOffer/index", 20, 0, 0.0, 110.05, 146.40000000000003, 559.3499999999997, 581.0, 0.3301365114474835, 0.6312571185685281, 0.0, 48, 581]}, {"isController": true, "data": ["List_offers_46_SP_with_cache", 20, 20, 100.0, 453.95, 635.1000000000004, 854.2999999999998, 865.0, 0.32859607327692436, 4.986750261849996, 0.0, 316, 865]}, {"isController": false, "data": ["144 /escm/productOffer/list", 20, 0, 0.0, 79.00000000000001, 122.80000000000003, 132.54999999999998, 133.0, 0.3325960786922322, 0.635960080155655, 0.0, 52, 133]}, {"isController": false, "data": ["676 /escm/login/doAuth?id=loginform", 20, 0, 0.0, 1280.35, 2213.4000000000005, 2503.2999999999997, 2517.0, 0.3199129836684422, 2.965162225874562, 0.0, 619, 2517]}, {"isController": false, "data": ["169 /escm/messages", 20, 0, 0.0, 14.849999999999998, 28.00000000000002, 35.64999999999999, 36.0, 555.5555555555555, 250.10850694444446, 0.0, 8, 36]}, {"isController": true, "data": ["SP_user_login_46_with_cache", 20, 0, 0.0, 2183.25, 3690.3, 3955.2999999999997, 3969.0, 0.3126514405415123, 5.466942483859369, 0.0, 959, 3969]}, {"isController": false, "data": ["147 /escm/productOffer/getAllService", 20, 20, 100.0, 45.0, 79.40000000000008, 99.14999999999999, 100.0, 0.33277870216306155, 0.6529969581946755, 0.0, 34, 100]}, {"isController": false, "data": ["146 /escm/productOffer/offerList", 20, 20, 100.0, 55.75, 79.7, 85.69999999999999, 86.0, 0.33285623939020736, 0.6529865786123223, 0.0, 37, 86]}, {"isController": false, "data": ["149 /escm/recentItem", 20, 20, 100.0, 48.050000000000004, 77.20000000000005, 95.14999999999999, 96.0, 0.33280085197018106, 0.6533491725738818, 0.0, 34, 96]}, {"isController": false, "data": ["150 /escm/messages", 20, 20, 100.0, 35.70000000000001, 57.60000000000003, 111.24999999999996, 114.0, 0.3327012010513358, 0.5826819667631501, 0.0, 25, 114]}, {"isController": false, "data": ["151 /escm/recentItem", 20, 20, 100.0, 43.35, 66.30000000000001, 81.24999999999999, 82.0, 0.3328783995206551, 0.6530463054658633, 0.0, 29, 82]}, {"isController": true, "data": ["Hit_the_portal_with-cache", 20, 0, 0.0, 141.3, 388.6000000000002, 654.4499999999998, 668.0, 0.3311422752785735, 1.9325256221335498, 0.0, 45, 668]}, {"isController": false, "data": ["148 /escm/messages", 20, 20, 100.0, 37.05000000000001, 57.20000000000002, 70.35, 71.0, 0.3329393550964692, 0.583082805138919, 0.0, 24, 71]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 300, 120, 40.0, 417.9533333333336, 1488.9000000000015, 2283.8499999999995, 2872.5400000000004, 4.7316373042285065, 22.716341177665097, 0.0, 8, 3403]}}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "items": [{"isController": false, "data": ["500/Internal Server Error", 120, 100.0, 40.0]}], "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);
    
        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": ["147 /escm/productOffer/getAllService", 20, 20, "500/Internal Server Error", 20, null, null, null, null, null, null, null, null]}, {"isController": false, "data": ["146 /escm/productOffer/offerList", 20, 20, "500/Internal Server Error", 20, null, null, null, null, null, null, null, null]}, {"isController": false, "data": ["149 /escm/recentItem", 20, 20, "500/Internal Server Error", 20, null, null, null, null, null, null, null, null]}, {"isController": false, "data": ["150 /escm/messages", 20, 20, "500/Internal Server Error", 20, null, null, null, null, null, null, null, null]}, {"isController": false, "data": ["151 /escm/recentItem", 20, 20, "500/Internal Server Error", 20, null, null, null, null, null, null, null, null]}, {"isController": true, "data": []}, {"isController": false, "data": ["148 /escm/messages", 20, 20, "500/Internal Server Error", 20, null, null, null, null, null, null, null, null]}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 300, 120, "500/Internal Server Error", 120, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
