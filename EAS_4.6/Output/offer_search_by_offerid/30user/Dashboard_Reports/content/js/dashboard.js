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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "186 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "72 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "99 /escm/images/favicon.ico"]}, {"isController": false, "data": [0.7166666666666667, 500, 1500, "60 /escm/productOffer/offerList"]}, {"isController": false, "data": [1.0, 500, 1500, "178 /escm/images/favicon.ico"]}, {"isController": false, "data": [0.9333333333333333, 500, 1500, "59 /escm/productOffer/offerList"]}, {"isController": false, "data": [1.0, 500, 1500, "62 /escm/messages"]}, {"isController": false, "data": [0.0, 500, 1500, "133 /escm/productOffer/productModelSearch/productModelSearch"]}, {"isController": true, "data": [0.0, 500, 1500, "List_offers"]}, {"isController": false, "data": [0.0, 500, 1500, "49 /escm/productOffer/index"]}, {"isController": false, "data": [0.0, 500, 1500, "65 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "66 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "65 /escm/recentItem"]}, {"isController": false, "data": [0.8166666666666667, 500, 1500, "33 /escm/login/auth"]}, {"isController": false, "data": [0.9833333333333333, 500, 1500, "61 /escm/productOffer/getAllService"]}, {"isController": true, "data": [0.0, 500, 1500, "Hit_the_portal"]}, {"isController": false, "data": [1.0, 500, 1500, "43 /escm/images/favicon.ico"]}, {"isController": true, "data": [0.0, 500, 1500, "sp_userlogin_46"]}, {"isController": false, "data": [0.15, 500, 1500, "184 /escm/productOffer/showOfferDetails"]}, {"isController": false, "data": [1.0, 500, 1500, "63 /escm/messages"]}, {"isController": true, "data": [0.0, 500, 1500, "Offer_search_by_id"]}, {"isController": false, "data": [1.0, 500, 1500, "67 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "185 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.6347826086956522, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["186 /escm/recentItem", 30, 0, 0.0, 12.5, 18.900000000000002, 38.64999999999998, 59.0, 0.4998167338642498, 0.16644287719502848, 0.0, 6, 59]}, {"isController": false, "data": ["72 /escm/recentItem", 30, 0, 0.0, 12.199999999999998, 19.800000000000004, 40.64999999999999, 50.0, 0.49995000499950004, 0.16648725752424756, 0.0, 6, 50]}, {"isController": false, "data": ["99 /escm/images/favicon.ico", 30, 0, 0.0, 7.5, 12.900000000000002, 22.19999999999999, 31.0, 967.741935483871, 118.13256048387098, 0.0, 3, 31]}, {"isController": false, "data": ["60 /escm/productOffer/offerList", 30, 0, 0.0, 747.3000000000002, 2193.8, 2403.3999999999996, 2509.0, 0.4983968235509112, 3.6688625546159854, 0.0, 170, 2509]}, {"isController": false, "data": ["178 /escm/images/favicon.ico", 30, 0, 0.0, 10.46666666666667, 23.800000000000004, 26.349999999999998, 28.0, 0.4999583368052662, 0.061030070410799095, 0.0, 3, 28]}, {"isController": false, "data": ["59 /escm/productOffer/offerList", 30, 0, 0.0, 172.53333333333336, 640.7000000000002, 779.8999999999999, 913.0, 0.4993840929520258, 2.739784994340314, 0.0, 32, 913]}, {"isController": false, "data": ["62 /escm/messages", 30, 0, 0.0, 15.76666666666667, 24.400000000000013, 89.09999999999994, 132.0, 0.4999166805532411, 0.22506014622562906, 0.0, 6, 132]}, {"isController": false, "data": ["133 /escm/productOffer/productModelSearch/productModelSearch", 30, 0, 0.0, 8690.066666666668, 20991.200000000004, 22927.6, 23955.0, 0.4798617998016571, 10.012163371948878, 0.0, 2518, 23955]}, {"isController": true, "data": ["List_offers", 30, 0, 0.0, 7633.333333333334, 13994.7, 14200.45, 14278.0, 2.101134612690853, 219.93127265285753, 0.0, 2711, 14278]}, {"isController": false, "data": ["49 /escm/productOffer/index", 30, 0, 0.0, 6356.633333333335, 13555.2, 13742.4, 13848.0, 2.166377816291161, 25.564457074126228, 0.0, 2206, 13848]}, {"isController": false, "data": ["65 /escm/login/doAuth?id=loginform", 30, 0, 0.0, 8465.1, 15536.7, 19374.049999999996, 21282.0, 1.40964195094446, 12.47569836011653, 0.0, 1624, 21282]}, {"isController": false, "data": ["66 /escm/recentItem", 30, 0, 0.0, 13.733333333333334, 19.800000000000004, 61.199999999999974, 81.0, 0.4999416734714283, 0.16648448306030963, 0.0, 5, 81]}, {"isController": false, "data": ["65 /escm/recentItem", 30, 0, 0.0, 14.566666666666666, 29.10000000000002, 76.14999999999998, 91.0, 0.49993334222103725, 0.1664817086888415, 0.0, 5, 91]}, {"isController": false, "data": ["33 /escm/login/auth", 30, 0, 0.0, 365.4666666666667, 961.7000000000003, 1298.7999999999997, 1554.0, 19.305019305019304, 98.52346766409266, 0.0, 34, 1554]}, {"isController": false, "data": ["61 /escm/productOffer/getAllService", 30, 0, 0.0, 105.63333333333331, 241.80000000000007, 449.44999999999993, 527.0, 0.4982892070557752, 0.23795256079128324, 0.0, 11, 527]}, {"isController": true, "data": ["Hit_the_portal", 30, 30, 100.0, 812.5999999999999, 1363.8000000000002, 1973.6999999999996, 2241.0, 13.386880856760374, 9047.25673527443, 0.0, 312, 2241]}, {"isController": false, "data": ["43 /escm/images/favicon.ico", 30, 0, 0.0, 17.633333333333336, 45.20000000000002, 69.44999999999997, 92.0, 326.0869565217391, 60937.18155570652, 0.0, 5, 92]}, {"isController": true, "data": ["sp_userlogin_46", 30, 0, 0.0, 9444.233333333335, 16267.5, 20163.199999999997, 22053.0, 1.3603591348115902, 610.4779891057906, 0.0, 2289, 22053]}, {"isController": false, "data": ["184 /escm/productOffer/showOfferDetails", 30, 0, 0.0, 2989.5333333333333, 11397.70000000002, 13768.599999999999, 14543.0, 0.4862551867219917, 4.446195863589212, 0.0, 794, 14543]}, {"isController": false, "data": ["63 /escm/messages", 30, 0, 0.0, 10.3, 13.0, 24.649999999999988, 34.0, 0.49992501124831273, 0.22506389666550017, 0.0, 6, 34]}, {"isController": true, "data": ["Offer_search_by_id", 30, 0, 0.0, 12986.500000000002, 24601.900000000005, 26212.0, 27114.0, 0.46771955535460935, 225.3515905144525, 0.0, 4141, 27114]}, {"isController": false, "data": ["67 /escm/messages", 30, 0, 0.0, 19.5, 24.700000000000006, 115.19999999999987, 212.0, 0.49995000499950004, 0.2250751487351265, 0.0, 6, 212]}, {"isController": false, "data": ["185 /escm/messages", 30, 0, 0.0, 46.23333333333334, 115.30000000000008, 288.5499999999997, 486.0, 0.4993175992809827, 0.22479044264505177, 0.0, 7, 486]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 570, 0, 0.0, 1477.5087719298253, 4847.699999999999, 10667.449999999984, 18197.53999999995, 9.117374196231486, 124.44684680811926, 0.0, 3, 23955]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 570, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
