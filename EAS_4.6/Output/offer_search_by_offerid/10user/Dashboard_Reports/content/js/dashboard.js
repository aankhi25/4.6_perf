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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [0.4, 500, 1500, "168 /escm/productOffer/showOfferDetails"]}, {"isController": true, "data": [0.0, 500, 1500, "Offer_search_by_offerid_46_with_cache"]}, {"isController": false, "data": [0.9, 500, 1500, "675 /escm/login/auth"]}, {"isController": false, "data": [1.0, 500, 1500, "170 /escm/recentItem"]}, {"isController": false, "data": [0.0, 500, 1500, "167 /escm/productOffer/productModelSearch/productModelSearch"]}, {"isController": false, "data": [0.65, 500, 1500, "680 /escm/dashboard/myAccountInfo"]}, {"isController": false, "data": [1.0, 500, 1500, "143 /escm/productOffer/index"]}, {"isController": true, "data": [0.0, 500, 1500, "List_offers_46_SP_with_cache"]}, {"isController": false, "data": [1.0, 500, 1500, "144 /escm/productOffer/list"]}, {"isController": false, "data": [0.4, 500, 1500, "676 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "169 /escm/messages"]}, {"isController": true, "data": [0.2, 500, 1500, "SP_user_login_46_with_cache"]}, {"isController": false, "data": [0.0, 500, 1500, "147 /escm/productOffer/getAllService"]}, {"isController": false, "data": [0.0, 500, 1500, "146 /escm/productOffer/offerList"]}, {"isController": false, "data": [0.0, 500, 1500, "149 /escm/recentItem"]}, {"isController": false, "data": [0.0, 500, 1500, "150 /escm/messages"]}, {"isController": false, "data": [0.0, 500, 1500, "151 /escm/recentItem"]}, {"isController": true, "data": [0.9, 500, 1500, "Hit_the_portal_with-cache"]}, {"isController": false, "data": [0.0, 500, 1500, "148 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.39210526315789473, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["168 /escm/productOffer/showOfferDetails", 10, 0, 0.0, 1068.5, 2319.0, 2321.0, 2321.0, 0.16445745485642863, 1.6088885656843075, 0.0, 589, 2321]}, {"isController": true, "data": ["Offer_search_by_offerid_46_with_cache", 10, 0, 0.0, 3219.1000000000004, 4633.6, 4662.0, 4662.0, 0.15960927649114967, 5.350932168052608, 0.0, 2128, 4662]}, {"isController": false, "data": ["675 /escm/login/auth", 10, 0, 0.0, 215.29999999999995, 1056.9, 1112.0, 1112.0, 8.992805755395683, 52.48145233812949, 0.0, 47, 1112]}, {"isController": false, "data": ["170 /escm/recentItem", 10, 0, 0.0, 21.9, 55.400000000000006, 58.0, 58.0, 0.16650571114589233, 0.05544770263745046, 0.0, 8, 58]}, {"isController": false, "data": ["167 /escm/productOffer/productModelSearch/productModelSearch", 10, 0, 0.0, 2112.7999999999997, 3485.6000000000004, 3614.0, 3614.0, 0.16142571188738944, 3.7061703969458257, 0.0, 1513, 3614]}, {"isController": false, "data": ["680 /escm/dashboard/myAccountInfo", 10, 0, 0.0, 818.0, 2225.7000000000007, 2345.0, 2345.0, 0.16394517673290052, 1.3087916369516033, 0.0, 243, 2345]}, {"isController": false, "data": ["143 /escm/productOffer/index", 10, 0, 0.0, 67.4, 102.8, 103.0, 103.0, 97.08737864077669, 185.64168689320388, 0.0, 48, 103]}, {"isController": true, "data": ["List_offers_46_SP_with_cache", 10, 10, 100.0, 358.6, 502.3, 505.0, 505.0, 19.801980198019802, 300.60914294554453, 0.0, 267, 505]}, {"isController": false, "data": ["144 /escm/productOffer/list", 10, 0, 0.0, 52.2, 66.4, 67.0, 67.0, 149.25373134328356, 285.38945895522386, 0.0, 45, 67]}, {"isController": false, "data": ["676 /escm/login/doAuth?id=loginform", 10, 0, 0.0, 1092.0, 1929.1000000000001, 1956.0, 1956.0, 0.16271274691659346, 1.497036721216115, 0.0, 536, 1956]}, {"isController": false, "data": ["169 /escm/messages", 10, 0, 0.0, 15.899999999999999, 27.1, 28.0, 28.0, 0.16662223407091442, 0.07501254873700347, 0.0, 11, 28]}, {"isController": true, "data": ["SP_user_login_46_with_cache", 10, 0, 0.0, 1910.0, 3495.7000000000003, 3586.0, 3586.0, 0.16030522114105256, 2.7546197960917587, 0.0, 787, 3586]}, {"isController": false, "data": ["147 /escm/productOffer/getAllService", 10, 10, 100.0, 44.1, 58.7, 59.0, 59.0, 0.16654176034640686, 0.32711469002414856, 0.0, 29, 59]}, {"isController": false, "data": ["146 /escm/productOffer/offerList", 10, 10, 100.0, 52.6, 89.9, 90.0, 90.0, 0.16656950112434413, 0.3269577121679021, 0.0, 33, 90]}, {"isController": false, "data": ["149 /escm/recentItem", 10, 10, 100.0, 42.199999999999996, 59.7, 60.0, 60.0, 0.166536213299582, 0.3268273186004297, 0.0, 29, 60]}, {"isController": false, "data": ["150 /escm/messages", 10, 10, 100.0, 28.3, 41.400000000000006, 42.0, 42.0, 0.16658337497917708, 0.2918950680909545, 0.0, 21, 42]}, {"isController": false, "data": ["151 /escm/recentItem", 10, 10, 100.0, 38.50000000000001, 55.400000000000006, 56.0, 56.0, 0.16658892516825483, 0.32689822874325314, 0.0, 28, 56]}, {"isController": true, "data": ["Hit_the_portal_with-cache", 10, 0, 0.0, 215.29999999999995, 1056.9, 1112.0, 1112.0, 8.992805755395683, 52.48145233812949, 0.0, 47, 1112]}, {"isController": false, "data": ["148 /escm/messages", 10, 10, 100.0, 33.300000000000004, 55.60000000000001, 57.0, 57.0, 0.16650848360723977, 0.29179636116522634, 0.0, 22, 57]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 150, 60, 40.0, 380.19999999999993, 1507.5000000000002, 2083.049999999999, 2966.8100000000113, 2.421385678310841, 11.57833800627139, 0.0, 8, 3614]}}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "items": [{"isController": false, "data": ["500/Internal Server Error", 60, 100.0, 40.0]}], "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);
    
        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": ["147 /escm/productOffer/getAllService", 10, 10, "500/Internal Server Error", 10, null, null, null, null, null, null, null, null]}, {"isController": false, "data": ["146 /escm/productOffer/offerList", 10, 10, "500/Internal Server Error", 10, null, null, null, null, null, null, null, null]}, {"isController": false, "data": ["149 /escm/recentItem", 10, 10, "500/Internal Server Error", 10, null, null, null, null, null, null, null, null]}, {"isController": false, "data": ["150 /escm/messages", 10, 10, "500/Internal Server Error", 10, null, null, null, null, null, null, null, null]}, {"isController": false, "data": ["151 /escm/recentItem", 10, 10, "500/Internal Server Error", 10, null, null, null, null, null, null, null, null]}, {"isController": true, "data": []}, {"isController": false, "data": ["148 /escm/messages", 10, 10, "500/Internal Server Error", 10, null, null, null, null, null, null, null, null]}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 150, 60, "500/Internal Server Error", 60, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
