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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [0.5, 500, 1500, "168 /escm/productOffer/showOfferDetails"]}, {"isController": true, "data": [0.0, 500, 1500, "Offer_search_by_offerid_46_with_cache"]}, {"isController": false, "data": [0.5, 500, 1500, "675 /escm/login/auth"]}, {"isController": false, "data": [1.0, 500, 1500, "170 /escm/recentItem"]}, {"isController": false, "data": [0.0, 500, 1500, "167 /escm/productOffer/productModelSearch/productModelSearch"]}, {"isController": false, "data": [0.5, 500, 1500, "680 /escm/dashboard/myAccountInfo"]}, {"isController": false, "data": [1.0, 500, 1500, "143 /escm/productOffer/index"]}, {"isController": true, "data": [0.0, 500, 1500, "List_offers_46_SP_with_cache"]}, {"isController": false, "data": [1.0, 500, 1500, "144 /escm/productOffer/list"]}, {"isController": false, "data": [0.5, 500, 1500, "676 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "169 /escm/messages"]}, {"isController": true, "data": [0.0, 500, 1500, "SP_user_login_46_with_cache"]}, {"isController": false, "data": [0.0, 500, 1500, "147 /escm/productOffer/getAllService"]}, {"isController": false, "data": [0.0, 500, 1500, "146 /escm/productOffer/offerList"]}, {"isController": false, "data": [0.0, 500, 1500, "149 /escm/recentItem"]}, {"isController": false, "data": [0.0, 500, 1500, "150 /escm/messages"]}, {"isController": false, "data": [0.0, 500, 1500, "151 /escm/recentItem"]}, {"isController": true, "data": [0.5, 500, 1500, "Hit_the_portal_with-cache"]}, {"isController": false, "data": [0.0, 500, 1500, "148 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.34210526315789475, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["168 /escm/productOffer/showOfferDetails", 1, 0, 0.0, 1004.0, 1004.0, 1004.0, 1004.0, 0.9960159362549801, 9.743253548306773, 0.0, 1004, 1004]}, {"isController": true, "data": ["Offer_search_by_offerid_46_with_cache", 1, 0, 0.0, 3057.0, 3057.0, 3057.0, 3057.0, 0.32711808963035655, 10.966761735361466, 0.0, 3057, 3057]}, {"isController": false, "data": ["675 /escm/login/auth", 1, 0, 0.0, 607.0, 607.0, 607.0, 607.0, 1.6474464579901154, 9.61439456342669, 0.0, 607, 607]}, {"isController": false, "data": ["170 /escm/recentItem", 1, 0, 0.0, 17.0, 17.0, 17.0, 17.0, 58.8235294117647, 19.588694852941174, 0.0, 17, 17]}, {"isController": false, "data": ["167 /escm/productOffer/productModelSearch/productModelSearch", 1, 0, 0.0, 2016.0, 2016.0, 2016.0, 2016.0, 0.496031746031746, 11.38886951264881, 0.0, 2016, 2016]}, {"isController": false, "data": ["680 /escm/dashboard/myAccountInfo", 1, 0, 0.0, 806.0, 806.0, 806.0, 806.0, 1.2406947890818858, 10.23694362593052, 0.0, 806, 806]}, {"isController": false, "data": ["143 /escm/productOffer/index", 1, 0, 0.0, 90.0, 90.0, 90.0, 90.0, 11.11111111111111, 21.24565972222222, 0.0, 90, 90]}, {"isController": true, "data": ["List_offers_46_SP_with_cache", 1, 1, 100.0, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 31.591796875, 0.0, 480, 480]}, {"isController": false, "data": ["144 /escm/productOffer/list", 1, 0, 0.0, 81.0, 81.0, 81.0, 81.0, 12.345679012345679, 23.60628858024691, 0.0, 81, 81]}, {"isController": false, "data": ["676 /escm/login/doAuth?id=loginform", 1, 0, 0.0, 1467.0, 1467.0, 1467.0, 1467.0, 0.6816632583503749, 6.386598926380367, 0.0, 1467, 1467]}, {"isController": false, "data": ["169 /escm/messages", 1, 0, 0.0, 20.0, 20.0, 20.0, 20.0, 50.0, 22.509765625, 0.0, 20, 20]}, {"isController": true, "data": ["SP_user_login_46_with_cache", 1, 0, 0.0, 2273.0, 2273.0, 2273.0, 2273.0, 0.4399472063352398, 7.751921331940166, 0.0, 2273, 2273]}, {"isController": false, "data": ["147 /escm/productOffer/getAllService", 1, 1, 100.0, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 34.351014254385966, 0.0, 57, 57]}, {"isController": false, "data": ["146 /escm/productOffer/offerList", 1, 1, 100.0, 59.0, 59.0, 59.0, 59.0, 16.949152542372882, 33.18657309322034, 0.0, 59, 59]}, {"isController": false, "data": ["149 /escm/recentItem", 1, 1, 100.0, 53.0, 53.0, 53.0, 53.0, 18.867924528301884, 37.07252358490566, 0.0, 53, 53]}, {"isController": false, "data": ["150 /escm/messages", 1, 1, 100.0, 46.0, 46.0, 46.0, 46.0, 21.73913043478261, 37.979789402173914, 0.0, 46, 46]}, {"isController": false, "data": ["151 /escm/recentItem", 1, 1, 100.0, 49.0, 49.0, 49.0, 49.0, 20.408163265306122, 40.098852040816325, 0.0, 49, 49]}, {"isController": true, "data": ["Hit_the_portal_with-cache", 1, 0, 0.0, 607.0, 607.0, 607.0, 607.0, 1.6474464579901154, 9.61439456342669, 0.0, 607, 607]}, {"isController": false, "data": ["148 /escm/messages", 1, 1, 100.0, 45.0, 45.0, 45.0, 45.0, 22.22222222222222, 38.82378472222222, 0.0, 45, 45]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 15, 6, 40.0, 427.8, 1686.6000000000001, 2016.0, 2016.0, 7.44047619047619, 35.78646220858135, 0.0, 17, 2016]}}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "items": [{"isController": false, "data": ["500/Internal Server Error", 6, 100.0, 40.0]}], "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);
    
        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": ["147 /escm/productOffer/getAllService", 1, 1, "500/Internal Server Error", 1, null, null, null, null, null, null, null, null]}, {"isController": false, "data": ["146 /escm/productOffer/offerList", 1, 1, "500/Internal Server Error", 1, null, null, null, null, null, null, null, null]}, {"isController": false, "data": ["149 /escm/recentItem", 1, 1, "500/Internal Server Error", 1, null, null, null, null, null, null, null, null]}, {"isController": false, "data": ["150 /escm/messages", 1, 1, "500/Internal Server Error", 1, null, null, null, null, null, null, null, null]}, {"isController": false, "data": ["151 /escm/recentItem", 1, 1, "500/Internal Server Error", 1, null, null, null, null, null, null, null, null]}, {"isController": true, "data": []}, {"isController": false, "data": ["148 /escm/messages", 1, 1, "500/Internal Server Error", 1, null, null, null, null, null, null, null, null]}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 15, 6, "500/Internal Server Error", 6, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
