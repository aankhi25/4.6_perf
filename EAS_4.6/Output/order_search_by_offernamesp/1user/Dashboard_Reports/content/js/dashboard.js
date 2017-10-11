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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": [0.5, 500, 1500, "675 /escm/login/auth"]}, {"isController": false, "data": [0.5, 500, 1500, "821 /escm/order/showOrderDetail"]}, {"isController": false, "data": [1.0, 500, 1500, "825 /escm/recentItem"]}, {"isController": false, "data": [0.5, 500, 1500, "814 /escm/order/index"]}, {"isController": false, "data": [1.0, 500, 1500, "824 /escm/messages"]}, {"isController": false, "data": [0.5, 500, 1500, "680 /escm/dashboard/myAccountInfo"]}, {"isController": true, "data": [0.0, 500, 1500, "order_search_by_offername_with_cache"]}, {"isController": false, "data": [0.5, 500, 1500, "676 /escm/login/doAuth?id=loginform"]}, {"isController": false, "data": [1.0, 500, 1500, "823 /escm/recentItem"]}, {"isController": false, "data": [0.0, 500, 1500, "817 /escm/order/showOrderDetail"]}, {"isController": false, "data": [1.0, 500, 1500, "820 /escm/order/searchOrder"]}, {"isController": true, "data": [0.0, 500, 1500, "SP_user_login_46_with_cache"]}, {"isController": false, "data": [1.0, 500, 1500, "819 /escm/recentItem"]}, {"isController": true, "data": [0.5, 500, 1500, "Hit_the_portal_with-cache"]}, {"isController": false, "data": [1.0, 500, 1500, "818 /escm/messages"]}, {"isController": true, "data": [0.0, 500, 1500, "List_orders_with_cache"]}, {"isController": false, "data": [1.0, 500, 1500, "822 /escm/messages"]}, {"isController": false, "data": [0.5, 500, 1500, "816 /escm/order/list"]}], "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "overall": {"isController": false, "data": [0.5833333333333334, 500, 1500, "Total"]}}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": ["675 /escm/login/auth", 1, 0, 0.0, 552.0, 552.0, 552.0, 552.0, 1.8115942028985508, 10.57235054347826, 0.0, 552, 552]}, {"isController": false, "data": ["821 /escm/order/showOrderDetail", 1, 0, 0.0, 1443.0, 1443.0, 1443.0, 1443.0, 0.693000693000693, 15.148562023562024, 0.0, 1443, 1443]}, {"isController": false, "data": ["825 /escm/recentItem", 1, 0, 0.0, 23.0, 23.0, 23.0, 23.0, 43.47826086956522, 14.478600543478262, 0.0, 23, 23]}, {"isController": false, "data": ["814 /escm/order/index", 1, 0, 0.0, 1155.0, 1155.0, 1155.0, 1155.0, 0.8658008658008658, 18.782974837662337, 0.0, 1155, 1155]}, {"isController": false, "data": ["824 /escm/messages", 1, 0, 0.0, 17.0, 17.0, 17.0, 17.0, 58.8235294117647, 26.48207720588235, 0.0, 17, 17]}, {"isController": false, "data": ["680 /escm/dashboard/myAccountInfo", 1, 0, 0.0, 699.0, 699.0, 699.0, 699.0, 1.4306151645207439, 11.799780937052933, 0.0, 699, 699]}, {"isController": true, "data": ["order_search_by_offername_with_cache", 1, 0, 0.0, 1795.0, 1795.0, 1795.0, 1795.0, 0.5571030640668524, 15.372562674094707, 0.0, 1795, 1795]}, {"isController": false, "data": ["676 /escm/login/doAuth?id=loginform", 1, 0, 0.0, 1398.0, 1398.0, 1398.0, 1398.0, 0.7153075822603719, 6.699721700643777, 0.0, 1398, 1398]}, {"isController": false, "data": ["823 /escm/recentItem", 1, 0, 0.0, 14.0, 14.0, 14.0, 14.0, 71.42857142857143, 23.78627232142857, 0.0, 14, 14]}, {"isController": false, "data": ["817 /escm/order/showOrderDetail", 1, 0, 0.0, 1754.0, 1754.0, 1754.0, 1754.0, 0.5701254275940707, 12.460915229475484, 0.0, 1754, 1754]}, {"isController": false, "data": ["820 /escm/order/searchOrder", 1, 0, 0.0, 280.0, 280.0, 280.0, 280.0, 3.571428571428571, 14.885602678571427, 0.0, 280, 280]}, {"isController": true, "data": ["SP_user_login_46_with_cache", 1, 0, 0.0, 2097.0, 2097.0, 2097.0, 2097.0, 0.47687172150691465, 8.399741446113495, 0.0, 2097, 2097]}, {"isController": false, "data": ["819 /escm/recentItem", 1, 0, 0.0, 18.0, 18.0, 18.0, 18.0, 55.55555555555555, 18.50043402777778, 0.0, 18, 18]}, {"isController": true, "data": ["Hit_the_portal_with-cache", 1, 0, 0.0, 552.0, 552.0, 552.0, 552.0, 1.8115942028985508, 10.57235054347826, 0.0, 552, 552]}, {"isController": false, "data": ["818 /escm/messages", 1, 0, 0.0, 23.0, 23.0, 23.0, 23.0, 43.47826086956522, 19.573709239130434, 0.0, 23, 23]}, {"isController": true, "data": ["List_orders_with_cache", 1, 0, 0.0, 4159.0, 4159.0, 4159.0, 4159.0, 0.24044241404183697, 15.839613639095937, 0.0, 4159, 4159]}, {"isController": false, "data": ["822 /escm/messages", 1, 0, 0.0, 18.0, 18.0, 18.0, 18.0, 55.55555555555555, 25.010850694444446, 0.0, 18, 18]}, {"isController": false, "data": ["816 /escm/order/list", 1, 0, 0.0, 1209.0, 1209.0, 1209.0, 1209.0, 0.8271298593879239, 17.818832712985937, 0.0, 1209, 1209]}], "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "overall": {"isController": false, "data": ["Total", 14, 0, 0.0, 614.4999999999999, 1598.5, 1754.0, 1754.0, 7.98175598631699, 66.6595772163626, 0.0, 14, 1754]}}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "items": [{"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": true, "data": []}, {"isController": false, "data": []}, {"isController": false, "data": []}], "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "overall": {"isController": false, "data": ["Total", 14, 0, null, null, null, null, null, null, null, null, null, null]}}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
