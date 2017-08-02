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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "186 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "72 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "99 /escm/images/favicon.ico"]}, {"isController": false, "data": [0.7, 500, 1500, "60 /escm/productOffer/offerList"]}, {"isController": false, "data": [1.0, 500, 1500, "178 /escm/images/favicon.ico"]}, {"isController": false, "data": [1.0, 500, 1500, "59 /escm/productOffer/offerList"]}, {"isController": false, "data": [1.0, 500, 1500, "62 /escm/messages"]}, {"isController": false, "data": [0.0, 500, 1500, "133 /escm/productOffer/productModelSearch/productModelSearch"]}, {"isController": true, "data": [0.0, 500, 1500, "List_offers"]}, {"isController": false, "data": [0.0, 500, 1500, "49 /escm/productOffer/index"]}, {"isController": false, "data": [0.05, 500, 1500, "65 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "66 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "65 /escm/recentItem"]}, {"isController": false, "data": [0.95, 500, 1500, "33 /escm/login/auth"]}, {"isController": false, "data": [1.0, 500, 1500, "61 /escm/productOffer/getAllService"]}, {"isController": true, "data": [0.0, 500, 1500, "Hit_the_portal"]}, {"isController": false, "data": [1.0, 500, 1500, "43 /escm/images/favicon.ico"]}, {"isController": true, "data": [0.0, 500, 1500, "sp_userlogin_46"]}, {"isController": false, "data": [0.425, 500, 1500, "184 /escm/productOffer/showOfferDetails"]}, {"isController": false, "data": [1.0, 500, 1500, "63 /escm/messages"]}, {"isController": true, "data": [0.0, 500, 1500, "Offer_search_by_id"]}, {"isController": false, "data": [1.0, 500, 1500, "67 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "185 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.657608695652174, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["186 /escm/recentItem", 20, 0, 0.0, 15.0, 43.20000000000004, 52.599999999999994, 53.0, 0.3332389156405685, 0.11097116233733775, 0.0, 6, 53]}, {"isController": false, "data": ["72 /escm/recentItem", 20, 0, 0.0, 10.700000000000001, 17.900000000000002, 23.699999999999996, 24.0, 833.3333333333334, 277.5065104166667, 0.0, 5, 24]}, {"isController": false, "data": ["99 /escm/images/favicon.ico", 20, 0, 0.0, 12.9, 35.900000000000006, 39.8, 40.0, 500.0, 61.03515625, 0.0, 3, 40]}, {"isController": false, "data": ["60 /escm/productOffer/offerList", 20, 0, 0.0, 616.0499999999998, 1178.5, 1641.6999999999996, 1666.0, 12.004801920768308, 88.37128601440577, 0.0, 154, 1666]}, {"isController": false, "data": ["178 /escm/images/favicon.ico", 20, 0, 0.0, 7.149999999999999, 17.0, 17.95, 18.0, 0.3332389156405685, 0.040678578569405335, 0.0, 2, 18]}, {"isController": false, "data": ["59 /escm/productOffer/offerList", 20, 0, 0.0, 101.35, 230.60000000000005, 243.45, 244.0, 81.96721311475409, 449.69902663934425, 0.0, 27, 244]}, {"isController": false, "data": ["62 /escm/messages", 20, 0, 0.0, 26.650000000000002, 90.80000000000011, 162.49999999999994, 166.0, 120.48192771084338, 54.24039909638554, 0.0, 7, 166]}, {"isController": false, "data": ["133 /escm/productOffer/productModelSearch/productModelSearch", 20, 0, 0.0, 6935.549999999999, 12643.700000000003, 13371.0, 13403.0, 1.4922032380810266, 31.138157618630157, 0.0, 2236, 13403]}, {"isController": true, "data": ["List_offers", 20, 0, 0.0, 4350.0, 6638.400000000001, 7221.45, 7250.0, 2.758620689655172, 288.7602370689655, 0.0, 2436, 7250]}, {"isController": false, "data": ["49 /escm/productOffer/index", 20, 0, 0.0, 3276.8, 5071.5, 5578.75, 5605.0, 3.568242640499554, 42.11780776092774, 0.0, 1809, 5605]}, {"isController": false, "data": ["65 /escm/login/doAuth?id=loginform", 20, 0, 0.0, 3204.3, 4825.1, 5801.049999999999, 5852.0, 3.417634996582365, 30.18933163875598, 0.0, 1201, 5852]}, {"isController": false, "data": ["66 /escm/recentItem", 20, 0, 0.0, 18.700000000000003, 60.20000000000006, 70.6, 71.0, 281.69014084507046, 93.80501760563381, 0.0, 5, 71]}, {"isController": false, "data": ["65 /escm/recentItem", 20, 0, 0.0, 25.65, 79.90000000000002, 95.24999999999999, 96.0, 208.33333333333334, 69.37662760416667, 0.0, 6, 96]}, {"isController": false, "data": ["33 /escm/login/auth", 20, 0, 0.0, 169.59999999999997, 507.6, 667.6999999999998, 676.0, 29.585798816568047, 150.99158653846152, 0.0, 32, 676]}, {"isController": false, "data": ["61 /escm/productOffer/getAllService", 20, 0, 0.0, 111.15, 354.6000000000002, 368.7, 369.0, 54.200542005420054, 25.882876016260163, 0.0, 12, 369]}, {"isController": true, "data": ["Hit_the_portal", 20, 20, 100.0, 578.85, 1087.2000000000003, 1517.8499999999997, 1540.0, 12.987012987012989, 8777.014001623376, 0.0, 279, 1540]}, {"isController": false, "data": ["43 /escm/images/favicon.ico", 20, 0, 0.0, 12.15, 32.800000000000026, 40.64999999999999, 41.0, 487.8048780487805, 91158.06021341463, 0.0, 5, 41]}, {"isController": true, "data": ["sp_userlogin_46", 20, 0, 0.0, 4305.049999999999, 6096.5, 6667.5, 6697.0, 2.986411826190832, 1340.1388914812603, 0.0, 1756, 6697]}, {"isController": false, "data": ["184 /escm/productOffer/showOfferDetails", 20, 0, 0.0, 2214.2000000000007, 9438.000000000007, 10334.55, 10362.0, 0.3258496529701196, 2.9794718537179445, 0.0, 729, 10362]}, {"isController": false, "data": ["63 /escm/messages", 20, 0, 0.0, 11.1, 30.800000000000047, 33.95, 34.0, 588.2352941176471, 264.82077205882354, 0.0, 6, 34]}, {"isController": true, "data": ["Offer_search_by_id", 20, 0, 0.0, 10377.449999999999, 16022.6, 16854.399999999998, 16896.0, 1.1837121212121213, 570.3263716264204, 0.0, 4967, 16896]}, {"isController": false, "data": ["67 /escm/messages", 20, 0, 0.0, 12.65, 20.0, 31.39999999999999, 32.0, 625.0, 281.3720703125, 0.0, 7, 32]}, {"isController": false, "data": ["185 /escm/messages", 20, 0, 0.0, 26.250000000000004, 57.70000000000003, 134.99999999999994, 139.0, 0.3330058775537388, 0.14991768510964218, 0.0, 8, 139]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 380, 0, 0.0, 884.6263157894737, 3328.8, 4986.899999999998, 10728.409999999998, 6.191143406432272, 84.50178860911076, 0.0, 2, 13403]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 380, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
