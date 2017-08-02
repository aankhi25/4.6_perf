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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [1.0, 500, 1500, "186 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "72 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "99 /escm/images/favicon.ico"]}, {"isController": false, "data": [1.0, 500, 1500, "60 /escm/productOffer/offerList"]}, {"isController": false, "data": [1.0, 500, 1500, "178 /escm/images/favicon.ico"]}, {"isController": false, "data": [1.0, 500, 1500, "59 /escm/productOffer/offerList"]}, {"isController": false, "data": [1.0, 500, 1500, "62 /escm/messages"]}, {"isController": false, "data": [0.0, 500, 1500, "133 /escm/productOffer/productModelSearch/productModelSearch"]}, {"isController": true, "data": [0.0, 500, 1500, "List_offers"]}, {"isController": false, "data": [0.0, 500, 1500, "49 /escm/productOffer/index"]}, {"isController": false, "data": [0.0, 500, 1500, "65 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "66 /escm/recentItem"]}, {"isController": false, "data": [1.0, 500, 1500, "65 /escm/recentItem"]}, {"isController": false, "data": [0.9, 500, 1500, "33 /escm/login/auth"]}, {"isController": false, "data": [1.0, 500, 1500, "61 /escm/productOffer/getAllService"]}, {"isController": true, "data": [0.0, 500, 1500, "Hit_the_portal"]}, {"isController": false, "data": [1.0, 500, 1500, "43 /escm/images/favicon.ico"]}, {"isController": true, "data": [0.0, 500, 1500, "sp_userlogin_46"]}, {"isController": false, "data": [0.5, 500, 1500, "184 /escm/productOffer/showOfferDetails"]}, {"isController": false, "data": [1.0, 500, 1500, "63 /escm/messages"]}, {"isController": true, "data": [0.0, 500, 1500, "Offer_search_by_id"]}, {"isController": false, "data": [1.0, 500, 1500, "67 /escm/messages"]}, {"isController": false, "data": [1.0, 500, 1500, "185 /escm/messages"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.6695652173913044, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["186 /escm/recentItem", 5, 0, 0.0, 9.0, 11.0, 11.0, 11.0, 454.5454545454545, 151.3671875, 0.0, 7, 11]}, {"isController": false, "data": ["72 /escm/recentItem", 5, 0, 0.0, 8.4, 12.0, 12.0, 12.0, 416.6666666666667, 138.75325520833334, 0.0, 7, 12]}, {"isController": false, "data": ["99 /escm/images/favicon.ico", 5, 0, 0.0, 10.2, 27.0, 27.0, 27.0, 185.18518518518516, 22.605613425925927, 0.0, 3, 27]}, {"isController": false, "data": ["60 /escm/productOffer/offerList", 5, 0, 0.0, 157.4, 172.0, 172.0, 172.0, 29.069767441860463, 213.99209665697677, 0.0, 144, 172]}, {"isController": false, "data": ["178 /escm/images/favicon.ico", 5, 0, 0.0, 4.4, 5.0, 5.0, 5.0, 1000.0, 122.0703125, 0.0, 3, 5]}, {"isController": false, "data": ["59 /escm/productOffer/offerList", 5, 0, 0.0, 41.2, 65.0, 65.0, 65.0, 76.92307692307693, 422.02524038461536, 0.0, 31, 65]}, {"isController": false, "data": ["62 /escm/messages", 5, 0, 0.0, 14.0, 19.0, 19.0, 19.0, 263.1578947368421, 118.47245065789474, 0.0, 8, 19]}, {"isController": false, "data": ["133 /escm/productOffer/productModelSearch/productModelSearch", 5, 0, 0.0, 2348.2, 4056.0, 4056.0, 4056.0, 1.232741617357002, 25.725776627218934, 0.0, 1543, 4056]}, {"isController": true, "data": ["List_offers", 5, 0, 0.0, 4668.2, 6242.0, 6242.0, 6242.0, 0.8010253123998718, 83.84826327699456, 0.0, 2482, 6242]}, {"isController": false, "data": ["49 /escm/productOffer/index", 5, 0, 0.0, 4279.2, 5877.0, 5877.0, 5877.0, 0.8507742045261188, 10.042625116981453, 0.0, 2185, 5877]}, {"isController": false, "data": ["65 /escm/login/doAuth?id=loginform", 5, 0, 0.0, 8176.4, 10473.0, 10473.0, 10473.0, 0.4774181227919412, 4.360170199560775, 0.0, 5657, 10473]}, {"isController": false, "data": ["66 /escm/recentItem", 5, 0, 0.0, 8.0, 12.0, 12.0, 12.0, 416.6666666666667, 138.75325520833334, 0.0, 6, 12]}, {"isController": false, "data": ["65 /escm/recentItem", 5, 0, 0.0, 9.0, 11.0, 11.0, 11.0, 454.5454545454545, 151.3671875, 0.0, 8, 11]}, {"isController": false, "data": ["33 /escm/login/auth", 5, 0, 0.0, 141.6, 546.0, 546.0, 546.0, 9.157509157509159, 46.73549107142857, 0.0, 34, 546]}, {"isController": false, "data": ["61 /escm/productOffer/getAllService", 5, 0, 0.0, 54.4, 207.0, 207.0, 207.0, 24.154589371980677, 11.534759963768117, 0.0, 14, 207]}, {"isController": true, "data": ["Hit_the_portal", 5, 5, 100.0, 431.2, 878.0, 878.0, 878.0, 5.694760820045558, 3848.6906499145784, 0.0, 296, 878]}, {"isController": false, "data": ["43 /escm/images/favicon.ico", 5, 0, 0.0, 8.6, 14.0, 14.0, 14.0, 357.14285714285717, 66740.72265625, 0.0, 5, 14]}, {"isController": true, "data": ["sp_userlogin_46", 5, 0, 0.0, 8796.4, 11035.0, 11035.0, 11035.0, 0.45310376076121434, 203.46394285228817, 0.0, 6274, 11035]}, {"isController": false, "data": ["184 /escm/productOffer/showOfferDetails", 5, 0, 0.0, 783.0, 924.0, 924.0, 924.0, 5.411255411255411, 49.47810978084415, 0.0, 699, 924]}, {"isController": false, "data": ["63 /escm/messages", 5, 0, 0.0, 9.0, 15.0, 15.0, 15.0, 333.3333333333333, 150.06510416666669, 0.0, 6, 15]}, {"isController": true, "data": ["Offer_search_by_id", 5, 0, 0.0, 3842.6, 5614.0, 5614.0, 5614.0, 0.8906305664410402, 429.11746164722126, 0.0, 2907, 5614]}, {"isController": false, "data": ["67 /escm/messages", 5, 0, 0.0, 8.8, 11.0, 11.0, 11.0, 454.5454545454545, 204.63423295454547, 0.0, 8, 11]}, {"isController": false, "data": ["185 /escm/messages", 5, 0, 0.0, 8.0, 11.0, 11.0, 11.0, 454.5454545454545, 204.63423295454547, 0.0, 7, 11]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 95, 0, 0.0, 846.2526315789473, 3646.800000000004, 5911.399999999998, 10473.0, 9.070944333046883, 123.95154504439988, 0.0, 3, 10473]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 95, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
