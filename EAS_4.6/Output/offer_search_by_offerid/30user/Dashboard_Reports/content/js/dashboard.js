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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [0.48333333333333334, 500, 1500, "168 /escm/productOffer/showOfferDetails"]}, {"isController": true, "data": [0.0, 500, 1500, "Offer_search_by_offerid_46_with_cache"]}, {"isController": false, "data": [0.9333333333333333, 500, 1500, "675 /escm/login/auth"]}, {"isController": false, "data": [1.0, 500, 1500, "170 /escm/recentItem"]}, {"isController": false, "data": [0.016666666666666666, 500, 1500, "167 /escm/productOffer/productModelSearch/productModelSearch"]}, {"isController": false, "data": [0.65, 500, 1500, "680 /escm/dashboard/myAccountInfo"]}, {"isController": false, "data": [1.0, 500, 1500, "143 /escm/productOffer/index"]}, {"isController": true, "data": [0.0, 500, 1500, "List_offers_46_SP_with_cache"]}, {"isController": false, "data": [1.0, 500, 1500, "144 /escm/productOffer/list"]}, {"isController": false, "data": [0.36666666666666664, 500, 1500, "676 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "169 /escm/messages"]}, {"isController": true, "data": [0.16666666666666666, 500, 1500, "SP_user_login_46_with_cache"]}, {"isController": false, "data": [0.0, 500, 1500, "147 /escm/productOffer/getAllService"]}, {"isController": false, "data": [0.0, 500, 1500, "146 /escm/productOffer/offerList"]}, {"isController": false, "data": [0.0, 500, 1500, "149 /escm/recentItem"]}, {"isController": false, "data": [0.0, 500, 1500, "150 /escm/messages"]}, {"isController": false, "data": [0.0, 500, 1500, "151 /escm/recentItem"]}, {"isController": true, "data": [0.9333333333333333, 500, 1500, "Hit_the_portal_with-cache"]}, {"isController": false, "data": [0.0, 500, 1500, "148 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.3973684210526316, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["168 /escm/productOffer/showOfferDetails", 30, 0, 0.0, 956.4666666666665, 1263.1000000000001, 1378.4499999999998, 1511.0, 19.85440105890139, 194.23640697385838, 0.0, 628, 1511]}, {"isController": true, "data": ["Offer_search_by_offerid_46_with_cache", 30, 0, 0.0, 3365.366666666667, 4115.1, 4154.55, 4187.0, 7.165034631000717, 240.17513285168377, 0.0, 2172, 4187]}, {"isController": false, "data": ["675 /escm/login/auth", 30, 0, 0.0, 157.3, 577.7000000000002, 641.05, 679.0, 44.18262150220913, 257.8470176730486, 0.0, 36, 679]}, {"isController": false, "data": ["170 /escm/recentItem", 30, 0, 0.0, 15.233333333333334, 33.0, 49.59999999999998, 65.0, 461.53846153846155, 153.69591346153845, 0.0, 7, 65]}, {"isController": false, "data": ["167 /escm/productOffer/productModelSearch/productModelSearch", 30, 0, 0.0, 2373.5333333333338, 2991.6, 3012.4, 3030.0, 9.900990099009901, 227.26929919554456, 0.0, 1285, 3030]}, {"isController": false, "data": ["680 /escm/dashboard/myAccountInfo", 30, 0, 0.0, 881.2333333333333, 1542.9, 1883.35, 1951.0, 15.376729882111738, 126.41654119682214, 0.0, 309, 1951]}, {"isController": false, "data": ["143 /escm/productOffer/index", 30, 0, 0.0, 63.96666666666667, 85.60000000000001, 100.29999999999998, 108.0, 277.77777777777777, 531.1414930555555, 0.0, 41, 108]}, {"isController": true, "data": ["List_offers_46_SP_with_cache", 30, 30, 100.0, 368.56666666666655, 438.70000000000005, 468.4, 497.0, 60.36217303822938, 916.0922566649899, 0.0, 260, 497]}, {"isController": false, "data": ["144 /escm/productOffer/list", 30, 0, 0.0, 62.39999999999999, 85.80000000000001, 112.05, 117.0, 256.4102564102564, 490.2844551282051, 0.0, 38, 117]}, {"isController": false, "data": ["676 /escm/login/doAuth?id=loginform", 30, 0, 0.0, 1202.166666666667, 1804.0, 2126.6499999999996, 2301.0, 13.03780964797914, 121.1361907866145, 0.0, 644, 2301]}, {"isController": false, "data": ["169 /escm/messages", 30, 0, 0.0, 20.1, 36.40000000000001, 56.39999999999998, 74.0, 405.4054054054054, 182.51161317567568, 0.0, 8, 74]}, {"isController": true, "data": ["SP_user_login_46_with_cache", 30, 0, 0.0, 2083.4000000000005, 3297.5, 3412.2, 3498.0, 8.576329331046313, 150.19240905517438, 0.0, 984, 3498]}, {"isController": false, "data": ["147 /escm/productOffer/getAllService", 30, 30, 100.0, 49.333333333333336, 99.80000000000007, 116.94999999999999, 123.0, 243.90243902439025, 478.6664761178862, 0.0, 25, 123]}, {"isController": false, "data": ["146 /escm/productOffer/offerList", 30, 30, 100.0, 44.96666666666666, 60.30000000000001, 103.49999999999994, 142.0, 211.26760563380282, 414.63330765845075, 0.0, 32, 142]}, {"isController": false, "data": ["149 /escm/recentItem", 30, 30, 100.0, 42.466666666666676, 72.90000000000002, 84.25, 87.0, 344.82758620689657, 676.6455639367816, 0.0, 29, 87]}, {"isController": false, "data": ["150 /escm/messages", 30, 30, 100.0, 31.1, 44.900000000000006, 56.0, 56.0, 535.7142857142857, 938.2847377232142, 0.0, 21, 56]}, {"isController": false, "data": ["151 /escm/recentItem", 30, 30, 100.0, 44.33333333333333, 68.80000000000001, 74.85, 82.0, 365.8536585365854, 717.725800304878, 0.0, 29, 82]}, {"isController": true, "data": ["Hit_the_portal_with-cache", 30, 0, 0.0, 157.3, 577.7000000000002, 641.05, 679.0, 44.18262150220913, 257.8470176730486, 0.0, 36, 679]}, {"isController": false, "data": ["148 /escm/messages", 30, 30, 100.0, 30.000000000000007, 46.70000000000003, 63.29999999999999, 71.0, 422.53521126760563, 740.1656029929578, 0.0, 22, 71]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 450, 180, 40.0, 398.30666666666656, 1439.8000000000002, 2140.2, 2916.4500000000007, 148.5148514851485, 713.3208926361386, 0.0, 7, 3030]}}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "items": [{"isController": false, "data": ["500/Internal Server Error", 180, 100.0, 40.0]}], "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);
    
        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": ["147 /escm/productOffer/getAllService", 30, 30, "500/Internal Server Error", 30, null, null, null, null, null, null, null, null]}, {"isController": false, "data": ["146 /escm/productOffer/offerList", 30, 30, "500/Internal Server Error", 30, null, null, null, null, null, null, null, null]}, {"isController": false, "data": ["149 /escm/recentItem", 30, 30, "500/Internal Server Error", 30, null, null, null, null, null, null, null, null]}, {"isController": false, "data": ["150 /escm/messages", 30, 30, "500/Internal Server Error", 30, null, null, null, null, null, null, null, null]}, {"isController": false, "data": ["151 /escm/recentItem", 30, 30, "500/Internal Server Error", 30, null, null, null, null, null, null, null, null]}, {"isController": true, "data": []}, {"isController": false, "data": ["148 /escm/messages", 30, 30, "500/Internal Server Error", 30, null, null, null, null, null, null, null, null]}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 450, 180, "500/Internal Server Error", 180, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
