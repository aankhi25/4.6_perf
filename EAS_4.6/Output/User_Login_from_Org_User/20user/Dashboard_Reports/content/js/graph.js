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
$(document).ready(function() {

    $(".click-title").mouseenter( function(    e){
        e.preventDefault();
        this.style.cursor="pointer";
    });
    $(".click-title").mousedown( function(event){
        event.preventDefault();
    });

    // Ugly code while this script is shared among several pages
    try{
        refreshHitsPerSecond(true);
    } catch(e){}
    try{
        refreshResponseTimeOverTime(true);
    } catch(e){}
    try{
        refreshResponseTimePercentiles();
    } catch(e){}
    $(".portlet-header").css("cursor", "auto");
});

var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

// Fixes time stamps
function fixTimeStamps(series, offset){
    $.each(series, function(index, item) {
        $.each(item.data, function(index, coord) {
            coord[0] += offset;
        });
    });
}

// Check if the specified jquery object is a graph
function isGraph(object){
    return object.data('plot') !== undefined;
}

/**
 * Export graph to a PNG
 */
function exportToPNG(graphName, target) {
    var plot = $("#"+graphName).data('plot');
    var flotCanvas = plot.getCanvas();
    var image = flotCanvas.toDataURL();
    image = image.replace("image/png", "image/octet-stream");
    
    var downloadAttrSupported = ("download" in document.createElement("a"));
    if(downloadAttrSupported === true) {
        target.download = graphName + ".png";
        target.href = image;
    }
    else {
        document.location.href = image;
    }
    
}

// Override the specified graph options to fit the requirements of an overview
function prepareOverviewOptions(graphOptions){
    var overviewOptions = {
        series: {
            shadowSize: 0,
            lines: {
                lineWidth: 1
            },
            points: {
                // Show points on overview only when linked graph does not show
                // lines
                show: getProperty('series.lines.show', graphOptions) == false,
                radius : 1
            }
        },
        xaxis: {
            ticks: 2,
            axisLabel: null
        },
        yaxis: {
            ticks: 2,
            axisLabel: null
        },
        legend: {
            show: false,
            container: null
        },
        grid: {
            hoverable: false
        },
        tooltip: false
    };
    return $.extend(true, {}, graphOptions, overviewOptions);
}

// Force axes boundaries using graph extra options
function prepareOptions(options, data) {
    options.canvas = true;
    var extraOptions = data.extraOptions;
    if(extraOptions !== undefined){
        var xOffset = options.xaxis.mode === "time" ? 19800000 : 0;
        var yOffset = options.yaxis.mode === "time" ? 19800000 : 0;

        if(!isNaN(extraOptions.minX))
        	options.xaxis.min = parseFloat(extraOptions.minX) + xOffset;
        
        if(!isNaN(extraOptions.maxX))
        	options.xaxis.max = parseFloat(extraOptions.maxX) + xOffset;
        
        if(!isNaN(extraOptions.minY))
        	options.yaxis.min = parseFloat(extraOptions.minY) + yOffset;
        
        if(!isNaN(extraOptions.maxY))
        	options.yaxis.max = parseFloat(extraOptions.maxY) + yOffset;
    }
}

// Filter, mark series and sort data
/**
 * @param data
 * @param noMatchColor if defined and true, series.color are not matched with index
 */
function prepareSeries(data, noMatchColor){
    var result = data.result;

    // Keep only series when needed
    if(seriesFilter && (!filtersOnlySampleSeries || result.supportsControllersDiscrimination)){
        // Insensitive case matching
        var regexp = new RegExp(seriesFilter, 'i');
        result.series = $.grep(result.series, function(series, index){
            return regexp.test(series.label);
        });
    }

    // Keep only controllers series when supported and needed
    if(result.supportsControllersDiscrimination && showControllersOnly){
        result.series = $.grep(result.series, function(series, index){
            return series.isController;
        });
    }

    // Sort data and mark series
    $.each(result.series, function(index, series) {
        series.data.sort(compareByXCoordinate);
        if(!(noMatchColor && noMatchColor===true)) {
	        series.color = index;
	    }
    });
}

// Set the zoom on the specified plot object
function zoomPlot(plot, xmin, xmax, ymin, ymax){
    var axes = plot.getAxes();
    // Override axes min and max options
    $.extend(true, axes, {
        xaxis: {
            options : { min: xmin, max: xmax }
        },
        yaxis: {
            options : { min: ymin, max: ymax }
        }
    });

    // Redraw the plot
    plot.setupGrid();
    plot.draw();
}

// Prepares DOM items to add zoom function on the specified graph
function setGraphZoomable(graphSelector, overviewSelector){
    var graph = $(graphSelector);
    var overview = $(overviewSelector);

    // Ignore mouse down event
    graph.bind("mousedown", function() { return false; });
    overview.bind("mousedown", function() { return false; });

    // Zoom on selection
    graph.bind("plotselected", function (event, ranges) {
        // clamp the zooming to prevent infinite zoom
        if (ranges.xaxis.to - ranges.xaxis.from < 0.00001) {
            ranges.xaxis.to = ranges.xaxis.from + 0.00001;
        }
        if (ranges.yaxis.to - ranges.yaxis.from < 0.00001) {
            ranges.yaxis.to = ranges.yaxis.from + 0.00001;
        }

        // Do the zooming
        var plot = graph.data('plot');
        zoomPlot(plot, ranges.xaxis.from, ranges.xaxis.to, ranges.yaxis.from, ranges.yaxis.to);
        plot.clearSelection();

        // Synchronize overview selection
        overview.data('plot').setSelection(ranges, true);
    });

    // Zoom linked graph on overview selection
    overview.bind("plotselected", function (event, ranges) {
        graph.data('plot').setSelection(ranges);
    });

    // Reset linked graph zoom when reseting overview selection
    overview.bind("plotunselected", function () {
        var overviewAxes = overview.data('plot').getAxes();
        zoomPlot(graph.data('plot'), overviewAxes.xaxis.min, overviewAxes.xaxis.max, overviewAxes.yaxis.min, overviewAxes.yaxis.max);
    });
}

var responseTimePercentilesInfos = {
        getOptions: function() {
            return {
                series: {
                    points: { show: false }
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentiles'
                },
                xaxis: {
                    tickDecimals: 1,
                    axisLabel: "Percentiles",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Percentile value in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : %x.2 percentile was %y ms"
                },
                selection: { mode: "xy" },
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentiles"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesPercentiles"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesPercentiles"), dataset, prepareOverviewOptions(options));
        }
};

// Response times percentiles
function refreshResponseTimePercentiles() {
    var infos = responseTimePercentilesInfos;
    prepareSeries(infos.data);
    if (isGraph($("#flotResponseTimesPercentiles"))){
        infos.createGraph();
    } else {
        var choiceContainer = $("#choicesResponseTimePercentiles");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesPercentiles", "#overviewResponseTimesPercentiles");
        $('#bodyResponseTimePercentiles .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimeDistributionInfos = {
        data: {"result": {"supportsControllersDiscrimination": true, "series": [{"isController": false, "data": [[0.0, 20.0]], "label": "26 /escm/js/usageGraphJS/jqplot.canvasAxisTickRenderer.min.js", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "85 /escm/images/cancelicon.png", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "108 /escm/images/BB-ajax-loader-round.gif", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "101 /escm/images/order-icon-custom-fields.png", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "16 /escm/js/jquery.blockUI.js", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "94 /escm/images/warn.png", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "58 /escm/css/theme/images/ui-icons_ededed_256x240.png", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "91 /escm/images/view_mail.png", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "51 /escm/images/orders.png", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "105 /escm/images/order-icon-quote.png", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "79 /escm/images/icon14.gif", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "56 /escm/images/_loading.gif", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "71 /escm/js/jquery.alerts.js", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "32 /escm/js/usageGraphJS/jquery.jqplot.min.js", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "54 /escm/css/modern_ui/images/CP_login.png", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "106 /escm/images/order-icon-ticket.png", "isOverall": false}, {"isController": false, "data": [[0.0, 40.0]], "label": "98 /escm/messages", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "115 /escm/images/help.png", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "57 /escm/images/bubble.png", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "30 /escm/js/usageGraphJS/jqplot.canvasAxisLabelRenderer.min.js", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "68 /escmnull/css/merchant.css", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "120 /escm/images/order-icon-usage.png", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "39 /escm/js/jquery.ui.timepicker.js", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "9 /escm/css/modern_ui/usageGraph/jquery.jqplot.min.css", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "87 /escm/images/ticket/order_ticket.png", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "31 /escm/js/usageGraphJS/jqplot.canvasTextRenderer.min.js", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "103 /escm/images/order-icon-provisioned.png", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "84 /escm/images/express_order.png", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "11 /escm/css/modern_ui/usageGraph/jquery.jqplot.css", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "100 /escm/images/order-icon-adjust.png", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "74 /escm/css/fonts/Roboto-Light.woff", "isOverall": false}, {"isController": false, "data": [[0.0, 38.0], [500.0, 2.0]], "label": "62 /escm/login/auth", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "15 /escm/js/jquery.qtip-1.0.0-rc3.min.js", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "29 /escm/js/usageGraphJS/jqplot.dateAxisRenderer.min.js", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "82 /escm/images/orderstatusicon/provisioningfailed.png", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "25 /escm/js/jquery.ba-dotimeout.min.js", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "89 /escm/images/previous.png", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "37 /escm/js/jquery.slimscroll.min.js", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "53 /escm/images/settings.png", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "67 /escm/css/jquery.alerts.css", "isOverall": false}, {"isController": false, "data": [[0.0, 40.0]], "label": "111 /escm/messages", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "41 /escm/js/jquery.flexslider.js", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "52 /escm/images/ticket/39x39ticket.png", "isOverall": false}, {"isController": false, "data": [[0.0, 40.0]], "label": "118 /escm/recentItem", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "75 /escm/css/fonts/Roboto-Bold.woff", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "47 /escm/js/panels.js", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "23 /escm/js/jquery-validate/jquery.metadata.js", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "97 /escm/images/slider-arrow-right.png", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "44 /escm/js/jquery.scrollToTop.min.js", "isOverall": false}, {"isController": true, "data": [[0.0, 38.0], [500.0, 2.0]], "label": "Login Page Request", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "114 /escm/images/icon20.gif", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "45 /escm/js/payment/jquery.dataTables.js", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "80 /escm/images/loading.gif", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "93 /escm/images/summary_edit_pencil.png", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "95 /escm/images/order-icon-email.png", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "42 /escm/js/usageGraphJS/jqplot.pointLabels.min.js", "isOverall": false}, {"isController": false, "data": [[8500.0, 1.0], [6500.0, 5.0], [10500.0, 1.0], [4500.0, 1.0], [6000.0, 5.0], [7500.0, 6.0], [11000.0, 1.0], [9500.0, 1.0], [7000.0, 5.0], [9000.0, 4.0], [5000.0, 2.0], [8000.0, 4.0], [5500.0, 4.0]], "label": "77 /escm/order/index", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "46 /escm/js/payment/jquery.tzCheckbox.js", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "13 /escm/css/tablesorter.css", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "76 /escm/css/fonts/Roboto-Regular.ttf", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "38 /escm/js/jquery.leanModal.min.js", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "116 /escm/css/theme/images/ui-icons_bbbbbb_256x240.png", "isOverall": false}, {"isController": false, "data": [[1500.0, 6.0], [4500.0, 3.0], [3000.0, 4.0], [3500.0, 5.0], [2000.0, 11.0], [500.0, 1.0], [4000.0, 2.0], [2500.0, 8.0]], "label": "110 /escm/order/showOrderDetail", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "22 /escm/js/slideBlock.js", "isOverall": false}, {"isController": false, "data": [[0.0, 40.0]], "label": "99 /escm/recentItem", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "21 /escm/js/clearinput.js", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "119 /escm/images/order-icon-stop-billing.png", "isOverall": false}, {"isController": true, "data": [[14500.0, 1.0], [11500.0, 3.0], [14000.0, 3.0], [10500.0, 1.0], [16000.0, 1.0], [11000.0, 1.0], [12500.0, 9.0], [13000.0, 10.0], [15000.0, 1.0], [12000.0, 6.0], [13500.0, 4.0]], "label": "Order Selection", "isOverall": false}, {"isController": false, "data": [[0.0, 40.0]], "label": "117 /escm/messages", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "18 /escm/js/main.js", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "34 /escm/js/placeholders.min.js", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "55 /escm/css/modern_ui/images/dropDown.png", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "102 /escm/images/order-icon-subscription.png", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "10 /escm/css/modern_ui/usageGraph/examples.css", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "66 /escm/css/jquery.ui.timepicker.css", "isOverall": false}, {"isController": false, "data": [[0.0, 40.0]], "label": "112 /escm/recentItem", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "59 /escm/css/theme/images/ui-icons_ffffff_256x240.png", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "65 /escm/css/logintypedialog.css", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "28 /escm/js/usageGraphJS/jqplot.highlighter.min.js", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "69 /escm/js/jquery-1.5.2.min.js", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "43 /escm/js/usageGraphJS/jqplot.cursor.min.js", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "49 /escm/images/myAccount.png", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "19 /escm/js/jquery-validate/additional-methods.min.js", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "14 /escm/css/modern_ui/jquery.multiselect.css", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "35 /escm/js/jquery.elastic.source.js", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "72 /escm/js/validator.js", "isOverall": false}, {"isController": true, "data": [[8500.0, 2.0], [16500.0, 2.0], [16000.0, 1.0], [12500.0, 3.0], [9500.0, 3.0], [13000.0, 4.0], [7000.0, 1.0], [9000.0, 1.0], [12000.0, 2.0], [13500.0, 4.0], [14500.0, 3.0], [11500.0, 2.0], [14000.0, 3.0], [6000.0, 1.0], [10000.0, 1.0], [15500.0, 4.0], [15000.0, 2.0], [8000.0, 1.0]], "label": "Login Page Credentials and Dashboard Display", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "73 /escm/js/jquery.bpopup.min.js", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "48 /escm/css/modern_ui/images/myDashboard.png", "isOverall": false}, {"isController": true, "data": [[4500.0, 4.0], [3000.0, 9.0], [3500.0, 6.0], [2000.0, 3.0], [1000.0, 1.0], [4000.0, 4.0], [2500.0, 9.0], [5000.0, 3.0], [5500.0, 1.0]], "label": "Order_Search", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "33 /escm/js/usageGraphJS/excanvas.min.js", "isOverall": false}, {"isController": false, "data": [[8500.0, 2.0], [7500.0, 1.0], [16000.0, 1.0], [12500.0, 1.0], [9500.0, 1.0], [7000.0, 1.0], [9000.0, 1.0], [12000.0, 7.0], [13500.0, 5.0], [5500.0, 1.0], [14500.0, 3.0], [11500.0, 5.0], [14000.0, 1.0], [6500.0, 2.0], [11000.0, 2.0], [15500.0, 2.0], [15000.0, 3.0], [8000.0, 1.0]], "label": "5 /escm/login/doAuth?id=loginform", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "92 /escm/css/theme/images/ui-icons_blue_256x240.png", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "40 /escm/js/escm_alert.js", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "83 /escm/images/hourglass.png", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "90 /escm/images/next.png", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "81 /escm/images/recent.png", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "113 /escm/images/trash.png", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "24 /escm/js/datatable.js", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "70 /escm/js/jquery-ui-1.8.17.custom.min.js", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "17 /escm/js/jquery.tablesorter.js", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "12 /escm/css/payment/jquery.tzCheckbox.css", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "36 /escm/js/MonthPicker.min.js", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "27 /escm/js/usageGraphJS/jqplot.enhancedLegendRenderer.min.js", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "50 /escm/css/modern_ui/images/myCatalog.png", "isOverall": false}, {"isController": false, "data": [[6500.0, 3.0], [6000.0, 3.0], [4500.0, 2.0], [3500.0, 2.0], [4000.0, 9.0], [5000.0, 11.0], [5500.0, 10.0]], "label": "88 /escm/order/showOrderDetail", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "63 /escm/css/theme/jquery-ui-1.8.17.custom.css", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "107 /escm/css/theme/images/ui-icons_222222_256x240.png", "isOverall": false}, {"isController": false, "data": [[0.0, 6.0], [500.0, 34.0]], "label": "109 /escm/order/searchOrder", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "96 /escm/images/slider-arrow-left.png", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "104 /escm/images/order-icon-installment.png", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "64 /escm/css/merchant.css", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "20 /escm/js/jquery-validate/jquery.validate.min.js", "isOverall": false}, {"isController": false, "data": [[0.0, 20.0]], "label": "86 /escm/images/bb_ajax_loader.gif", "isOverall": false}], "title": "Response Time Distribution", "granularity": 500, "maxY": 40.0, "maxX": 16500.0, "minX": 0.0, "minY": 1.0}},
        getOptions: function() {
            var granularity = this.data.result.granularity;
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    barWidth: this.data.result.granularity
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " responses for " + label + " were between " + xval + " and " + (xval + granularity) + " ms";
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimeDistribution"), prepareData(data.result.series, $("#choicesResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshResponseTimeDistribution() {
    var infos = responseTimeDistributionInfos;
    prepareSeries(infos.data);
    if (isGraph($("#flotResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var syntheticResponseTimeDistributionInfos = {
        data: {"result": {"supportsControllersDiscrimination": false, "series": [{"isController": false, "data": [[1.0, 37.0]], "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isOverall": false}, {"isController": false, "data": [[0.0, 2224.0]], "label": "Requests having \nresponse time <= 500ms", "isOverall": false}, {"isController": false, "data": [[3.0, 20.0]], "label": "Requests in error", "isOverall": false}, {"isController": false, "data": [[2.0, 159.0]], "label": "Requests having \nresponse time > 1,500ms", "isOverall": false}], "title": "Synthetic Response Times Distribution", "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 2224.0, "maxX": 3.0, "minX": 0.0, "minY": 20.0}},
        getOptions: function() {
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendSyntheticResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times ranges",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                    tickLength:0,
                    min:-0.5,
                    max:3.5
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    align: "center",
                    barWidth: 0.25,
                    fill:.75
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " " + label;
                    }
                },
                colors: ["#9ACD32", "yellow", "orange", "#FF6347"]                
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            options.xaxis.ticks = data.result.ticks;
            $.plot($("#flotSyntheticResponseTimeDistribution"), prepareData(data.result.series, $("#choicesSyntheticResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshSyntheticResponseTimeDistribution() {
    var infos = syntheticResponseTimeDistributionInfos;
    prepareSeries(infos.data, true);
    if (isGraph($("#flotSyntheticResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerSyntheticResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var activeThreadsOverTimeInfos = {
        data: {"result": {"supportsControllersDiscrimination": false, "series": [{"isController": false, "data": [[1.49727288E12, 988.7041646720905], [1.49727282E12, 2668.2356020942416], [1.49727276E12, 16.580419580419584], [1.4972727E12, 10.5]], "label": "Thread Group", "isOverall": false}], "title": "Active Threads Over Time", "granularity": 60000, "maxY": 2668.2356020942416, "maxX": 1.49727288E12, "minX": 1.4972727E12, "minY": 10.5}},
        getOptions: function() {
            return {
                series: {
                    stack: true,
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: "%H:%M:%S",
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 6,
                    show: true,
                    container: '#legendActiveThreadsOverTime'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                selection: {
                    mode: 'xy'
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : At %x there were %y active threads"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesActiveThreadsOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotActiveThreadsOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewActiveThreadsOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Active Threads Over Time
function refreshActiveThreadsOverTime(fixTimestamps) {
    var infos = activeThreadsOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 19800000);
    }
    if(isGraph($("#flotActiveThreadsOverTime"))) {
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesActiveThreadsOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotActiveThreadsOverTime", "#overviewActiveThreadsOverTime");
        $('#footerActiveThreadsOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var timeVsThreadsInfos = {
        data: {"result": {"supportsControllersDiscrimination": true, "series": [{"isController": false, "data": [[20.0, 8.5]], "label": "26 /escm/js/usageGraphJS/jqplot.canvasAxisTickRenderer.min.js", "isOverall": false}, {"isController": false, "data": [[20.0, 8.5]], "label": "26 /escm/js/usageGraphJS/jqplot.canvasAxisTickRenderer.min.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 13.75]], "label": "85 /escm/images/cancelicon.png", "isOverall": false}, {"isController": false, "data": [[20.0, 13.75]], "label": "85 /escm/images/cancelicon.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[14.0, 5.0], [12.0, 5.4], [20.0, 9.625], [10.0, 2.75], [17.0, 3.0], [18.0, 3.0]], "label": "108 /escm/images/BB-ajax-loader-round.gif", "isOverall": false}, {"isController": false, "data": [[15.449999999999998, 6.3]], "label": "108 /escm/images/BB-ajax-loader-round.gif-Aggregated", "isOverall": false}, {"isController": false, "data": [[14.0, 10.0], [13.0, 14.0], [12.0, 7.0], [20.0, 6.375], [10.0, 2.5], [18.0, 6.0]], "label": "101 /escm/images/order-icon-custom-fields.png", "isOverall": false}, {"isController": false, "data": [[15.55, 6.25]], "label": "101 /escm/images/order-icon-custom-fields.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 19.100000000000005]], "label": "16 /escm/js/jquery.blockUI.js", "isOverall": false}, {"isController": false, "data": [[20.0, 19.100000000000005]], "label": "16 /escm/js/jquery.blockUI.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[14.0, 8.0], [13.0, 5.0], [12.0, 13.0], [20.0, 12.125000000000002], [10.0, 4.25], [18.0, 20.0]], "label": "94 /escm/images/warn.png", "isOverall": false}, {"isController": false, "data": [[15.55, 10.950000000000001]], "label": "94 /escm/images/warn.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 7.5]], "label": "58 /escm/css/theme/images/ui-icons_ededed_256x240.png", "isOverall": false}, {"isController": false, "data": [[20.0, 7.5]], "label": "58 /escm/css/theme/images/ui-icons_ededed_256x240.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 12.999999999999996]], "label": "91 /escm/images/view_mail.png", "isOverall": false}, {"isController": false, "data": [[20.0, 12.999999999999996]], "label": "91 /escm/images/view_mail.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 10.900000000000002]], "label": "51 /escm/images/orders.png", "isOverall": false}, {"isController": false, "data": [[20.0, 10.900000000000002]], "label": "51 /escm/images/orders.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[14.0, 7.0], [12.0, 6.8], [20.0, 6.25], [10.0, 3.0], [18.0, 19.0]], "label": "105 /escm/images/order-icon-quote.png", "isOverall": false}, {"isController": false, "data": [[15.500000000000005, 7.049999999999999]], "label": "105 /escm/images/order-icon-quote.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 15.999999999999998]], "label": "79 /escm/images/icon14.gif", "isOverall": false}, {"isController": false, "data": [[20.0, 15.999999999999998]], "label": "79 /escm/images/icon14.gif-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 6.699999999999999]], "label": "56 /escm/images/_loading.gif", "isOverall": false}, {"isController": false, "data": [[20.0, 6.699999999999999]], "label": "56 /escm/images/_loading.gif-Aggregated", "isOverall": false}, {"isController": false, "data": [[15.0, 7.0], [3.0, 7.0], [14.0, 5.0], [13.0, 5.0], [12.0, 7.0], [2.0, 6.0], [11.0, 6.0], [1.0, 8.0], [10.0, 5.0], [17.0, 6.0], [9.0, 6.0], [19.0, 6.0], [8.0, 6.0], [6.0, 6.0], [7.0, 8.0], [20.0, 6.0], [4.0, 6.0], [16.0, 7.0], [18.0, 6.0], [5.0, 6.0]], "label": "71 /escm/js/jquery.alerts.js", "isOverall": false}, {"isController": false, "data": [[10.5, 6.249999999999999]], "label": "71 /escm/js/jquery.alerts.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 84.95]], "label": "32 /escm/js/usageGraphJS/jquery.jqplot.min.js", "isOverall": false}, {"isController": false, "data": [[20.0, 84.95]], "label": "32 /escm/js/usageGraphJS/jquery.jqplot.min.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 5.700000000000001]], "label": "54 /escm/css/modern_ui/images/CP_login.png", "isOverall": false}, {"isController": false, "data": [[20.0, 5.700000000000001]], "label": "54 /escm/css/modern_ui/images/CP_login.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[14.0, 15.0], [13.0, 70.0], [12.0, 6.75], [20.0, 7.875], [10.0, 2.5], [18.0, 6.0]], "label": "106 /escm/images/order-icon-ticket.png", "isOverall": false}, {"isController": false, "data": [[15.55, 9.849999999999998]], "label": "106 /escm/images/order-icon-ticket.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[14.0, 11.0], [13.0, 11.0], [12.0, 7.75], [20.0, 23.642857142857146], [10.0, 6.0], [19.0, 33.57142857142858], [18.0, 53.99999999999999]], "label": "98 /escm/messages", "isOverall": false}, {"isController": false, "data": [[17.25, 28.224999999999998]], "label": "98 /escm/messages-Aggregated", "isOverall": false}, {"isController": false, "data": [[3.0, 3.0], [15.0, 14.0], [14.0, 3.0], [13.0, 25.0], [12.0, 3.0], [2.0, 3.0], [1.0, 3.0], [10.0, 7.0], [17.0, 9.5], [9.0, 25.0], [19.0, 4.0], [8.0, 5.0], [6.0, 7.0], [7.0, 2.0], [20.0, 8.0], [5.0, 4.5], [18.0, 5.0]], "label": "115 /escm/images/help.png", "isOverall": false}, {"isController": false, "data": [[10.649999999999999, 7.400000000000001]], "label": "115 /escm/images/help.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 8.6]], "label": "57 /escm/images/bubble.png", "isOverall": false}, {"isController": false, "data": [[20.0, 8.6]], "label": "57 /escm/images/bubble.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 10.55]], "label": "30 /escm/js/usageGraphJS/jqplot.canvasAxisLabelRenderer.min.js", "isOverall": false}, {"isController": false, "data": [[20.0, 10.55]], "label": "30 /escm/js/usageGraphJS/jqplot.canvasAxisLabelRenderer.min.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[15.0, 2.0], [3.0, 3.0], [14.0, 3.0], [13.0, 3.0], [12.0, 4.0], [2.0, 3.0], [11.0, 2.0], [1.0, 4.0], [10.0, 3.0], [17.0, 2.0], [9.0, 3.0], [19.0, 4.0], [8.0, 3.0], [6.0, 3.0], [7.0, 3.0], [20.0, 2.0], [4.0, 3.0], [16.0, 2.0], [18.0, 2.0], [5.0, 3.0]], "label": "68 /escmnull/css/merchant.css", "isOverall": false}, {"isController": false, "data": [[10.5, 2.8500000000000005]], "label": "68 /escmnull/css/merchant.css-Aggregated", "isOverall": false}, {"isController": false, "data": [[3.0, 3.0], [15.0, 4.0], [14.0, 8.0], [13.0, 26.0], [12.0, 3.0], [2.0, 3.0], [1.0, 3.0], [10.0, 11.0], [17.0, 5.0], [9.0, 17.0], [19.0, 4.0], [8.0, 4.0], [6.0, 4.0], [7.0, 3.0], [20.0, 10.0], [4.0, 3.0], [5.0, 3.0], [18.0, 4.0]], "label": "120 /escm/images/order-icon-usage.png", "isOverall": false}, {"isController": false, "data": [[10.6, 6.3]], "label": "120 /escm/images/order-icon-usage.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 23.099999999999998]], "label": "39 /escm/js/jquery.ui.timepicker.js", "isOverall": false}, {"isController": false, "data": [[20.0, 23.099999999999998]], "label": "39 /escm/js/jquery.ui.timepicker.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 8.55]], "label": "9 /escm/css/modern_ui/usageGraph/jquery.jqplot.min.css", "isOverall": false}, {"isController": false, "data": [[20.0, 8.55]], "label": "9 /escm/css/modern_ui/usageGraph/jquery.jqplot.min.css-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 11.45]], "label": "87 /escm/images/ticket/order_ticket.png", "isOverall": false}, {"isController": false, "data": [[20.0, 11.45]], "label": "87 /escm/images/ticket/order_ticket.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 15.499999999999998]], "label": "31 /escm/js/usageGraphJS/jqplot.canvasTextRenderer.min.js", "isOverall": false}, {"isController": false, "data": [[20.0, 15.499999999999998]], "label": "31 /escm/js/usageGraphJS/jqplot.canvasTextRenderer.min.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[14.0, 12.0], [13.0, 3.0], [12.0, 7.75], [20.0, 10.5], [10.0, 2.75], [18.0, 5.0]], "label": "103 /escm/images/order-icon-provisioned.png", "isOverall": false}, {"isController": false, "data": [[15.55, 7.55]], "label": "103 /escm/images/order-icon-provisioned.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 14.5]], "label": "84 /escm/images/express_order.png", "isOverall": false}, {"isController": false, "data": [[20.0, 14.5]], "label": "84 /escm/images/express_order.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 11.549999999999999]], "label": "11 /escm/css/modern_ui/usageGraph/jquery.jqplot.css", "isOverall": false}, {"isController": false, "data": [[20.0, 11.549999999999999]], "label": "11 /escm/css/modern_ui/usageGraph/jquery.jqplot.css-Aggregated", "isOverall": false}, {"isController": false, "data": [[14.0, 6.0], [13.0, 4.0], [12.0, 4.75], [20.0, 6.75], [10.0, 3.75], [18.0, 24.5]], "label": "100 /escm/images/order-icon-adjust.png", "isOverall": false}, {"isController": false, "data": [[15.55, 7.3500000000000005]], "label": "100 /escm/images/order-icon-adjust.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[15.0, 5.0], [3.0, 5.0], [14.0, 4.0], [13.0, 4.0], [12.0, 6.0], [2.0, 7.0], [11.0, 5.0], [10.0, 7.0], [17.0, 6.0], [9.0, 5.0], [19.0, 5.0], [8.0, 6.0], [6.0, 9.0], [7.0, 7.0], [20.0, 4.0], [4.0, 5.0], [16.0, 5.0], [18.0, 5.0], [5.0, 5.0]], "label": "74 /escm/css/fonts/Roboto-Light.woff", "isOverall": false}, {"isController": false, "data": [[10.549999999999999, 5.599999999999999]], "label": "74 /escm/css/fonts/Roboto-Light.woff-Aggregated", "isOverall": false}, {"isController": false, "data": [[15.0, 37.0], [3.0, 38.0], [14.0, 40.0], [13.0, 38.0], [12.0, 104.5], [2.0, 57.0], [11.0, 49.5], [1.0, 563.5], [10.0, 38.0], [17.0, 82.0], [9.0, 51.0], [19.0, 52.0], [8.0, 37.0], [6.0, 43.0], [7.0, 92.0], [20.0, 41.0], [4.0, 42.0], [16.0, 36.5], [18.0, 39.0], [5.0, 36.5]], "label": "62 /escm/login/auth", "isOverall": false}, {"isController": false, "data": [[10.5, 75.87500000000001]], "label": "62 /escm/login/auth-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 18.750000000000004]], "label": "15 /escm/js/jquery.qtip-1.0.0-rc3.min.js", "isOverall": false}, {"isController": false, "data": [[20.0, 18.750000000000004]], "label": "15 /escm/js/jquery.qtip-1.0.0-rc3.min.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 13.05]], "label": "29 /escm/js/usageGraphJS/jqplot.dateAxisRenderer.min.js", "isOverall": false}, {"isController": false, "data": [[20.0, 13.05]], "label": "29 /escm/js/usageGraphJS/jqplot.dateAxisRenderer.min.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 11.3]], "label": "82 /escm/images/orderstatusicon/provisioningfailed.png", "isOverall": false}, {"isController": false, "data": [[20.0, 11.3]], "label": "82 /escm/images/orderstatusicon/provisioningfailed.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 6.050000000000001]], "label": "25 /escm/js/jquery.ba-dotimeout.min.js", "isOverall": false}, {"isController": false, "data": [[20.0, 6.050000000000001]], "label": "25 /escm/js/jquery.ba-dotimeout.min.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 11.7]], "label": "89 /escm/images/previous.png", "isOverall": false}, {"isController": false, "data": [[20.0, 11.7]], "label": "89 /escm/images/previous.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 11.799999999999999]], "label": "37 /escm/js/jquery.slimscroll.min.js", "isOverall": false}, {"isController": false, "data": [[20.0, 11.799999999999999]], "label": "37 /escm/js/jquery.slimscroll.min.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 9.4]], "label": "53 /escm/images/settings.png", "isOverall": false}, {"isController": false, "data": [[20.0, 9.4]], "label": "53 /escm/images/settings.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[15.0, 5.0], [3.0, 5.0], [14.0, 6.0], [13.0, 5.0], [12.0, 7.0], [2.0, 7.0], [11.0, 7.0], [1.0, 9.0], [10.0, 6.0], [17.0, 6.0], [9.0, 5.0], [19.0, 8.0], [8.0, 7.0], [6.0, 6.0], [7.0, 6.0], [20.0, 5.0], [4.0, 6.0], [16.0, 6.0], [18.0, 5.0], [5.0, 9.0]], "label": "67 /escm/css/jquery.alerts.css", "isOverall": false}, {"isController": false, "data": [[10.5, 6.3]], "label": "67 /escm/css/jquery.alerts.css-Aggregated", "isOverall": false}, {"isController": false, "data": [[14.0, 10.0], [12.0, 9.0], [20.0, 21.200000000000003], [10.0, 8.444444444444443], [17.0, 84.5], [19.0, 44.666666666666664], [18.0, 25.0]], "label": "111 /escm/messages", "isOverall": false}, {"isController": false, "data": [[16.525, 32.90000000000001]], "label": "111 /escm/messages-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 20.55]], "label": "41 /escm/js/jquery.flexslider.js", "isOverall": false}, {"isController": false, "data": [[20.0, 20.55]], "label": "41 /escm/js/jquery.flexslider.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 7.55]], "label": "52 /escm/images/ticket/39x39ticket.png", "isOverall": false}, {"isController": false, "data": [[20.0, 7.55]], "label": "52 /escm/images/ticket/39x39ticket.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[15.0, 18.0], [3.0, 7.0], [14.0, 13.0], [13.0, 19.5], [12.0, 71.66666666666666], [2.0, 8.0], [11.0, 22.0], [1.0, 6.5], [10.0, 81.0], [9.0, 8.0], [17.0, 15.333333333333334], [19.0, 15.5], [8.0, 8.0], [6.0, 14.0], [7.0, 8.0], [20.0, 14.5], [4.0, 9.5], [16.0, 19.0], [5.0, 7.5], [18.0, 8.5]], "label": "118 /escm/recentItem", "isOverall": false}, {"isController": false, "data": [[10.6, 21.725]], "label": "118 /escm/recentItem-Aggregated", "isOverall": false}, {"isController": false, "data": [[15.0, 5.0], [3.0, 5.0], [14.0, 4.0], [13.0, 5.0], [12.0, 6.0], [2.0, 7.0], [11.0, 5.0], [10.0, 6.0], [17.0, 6.0], [9.0, 4.0], [19.0, 4.0], [8.0, 6.0], [6.0, 5.0], [7.0, 6.0], [20.0, 4.0], [4.0, 5.0], [16.0, 5.0], [18.0, 5.0], [5.0, 5.0]], "label": "75 /escm/css/fonts/Roboto-Bold.woff", "isOverall": false}, {"isController": false, "data": [[10.549999999999999, 5.249999999999999]], "label": "75 /escm/css/fonts/Roboto-Bold.woff-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 8.750000000000002]], "label": "47 /escm/js/panels.js", "isOverall": false}, {"isController": false, "data": [[20.0, 8.750000000000002]], "label": "47 /escm/js/panels.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 8.55]], "label": "23 /escm/js/jquery-validate/jquery.metadata.js", "isOverall": false}, {"isController": false, "data": [[20.0, 8.55]], "label": "23 /escm/js/jquery-validate/jquery.metadata.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[14.0, 28.0], [13.0, 11.0], [12.0, 4.75], [20.0, 7.5], [10.0, 2.5], [18.0, 3.5]], "label": "97 /escm/images/slider-arrow-right.png", "isOverall": false}, {"isController": false, "data": [[15.55, 6.75]], "label": "97 /escm/images/slider-arrow-right.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 6.949999999999999]], "label": "44 /escm/js/jquery.scrollToTop.min.js", "isOverall": false}, {"isController": false, "data": [[20.0, 6.949999999999999]], "label": "44 /escm/js/jquery.scrollToTop.min.js-Aggregated", "isOverall": false}, {"isController": true, "data": [[15.0, 296.5], [3.0, 305.0], [14.0, 297.0], [13.0, 292.5], [12.0, 369.0], [2.0, 608.0], [11.0, 363.5], [10.0, 324.0], [17.0, 353.0], [9.0, 320.0], [19.0, 311.0], [8.0, 290.5], [6.0, 306.0], [7.0, 378.0], [20.0, 292.5], [4.0, 313.0], [16.0, 250.5], [18.0, 295.5], [5.0, 304.0]], "label": "Login Page Request", "isOverall": false}, {"isController": true, "data": [[10.55, 343.87500000000006]], "label": "Login Page Request-Aggregated", "isOverall": false}, {"isController": false, "data": [[3.0, 5.0], [15.0, 15.0], [14.0, 8.0], [13.0, 6.0], [12.0, 8.0], [2.0, 4.0], [1.0, 5.0], [10.0, 5.0], [17.0, 24.0], [9.0, 7.0], [19.0, 8.0], [8.0, 7.0], [6.0, 6.0], [7.0, 5.0], [20.0, 17.0], [5.0, 5.0], [18.0, 26.0]], "label": "114 /escm/images/icon20.gif", "isOverall": false}, {"isController": false, "data": [[10.649999999999999, 9.899999999999999]], "label": "114 /escm/images/icon20.gif-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 134.15000000000003]], "label": "45 /escm/js/payment/jquery.dataTables.js", "isOverall": false}, {"isController": false, "data": [[20.0, 134.15000000000003]], "label": "45 /escm/js/payment/jquery.dataTables.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 7.7]], "label": "80 /escm/images/loading.gif", "isOverall": false}, {"isController": false, "data": [[20.0, 7.7]], "label": "80 /escm/images/loading.gif-Aggregated", "isOverall": false}, {"isController": false, "data": [[14.0, 8.0], [13.0, 6.0], [12.0, 7.0], [20.0, 7.375], [10.0, 2.75], [18.0, 6.5]], "label": "93 /escm/images/summary_edit_pencil.png", "isOverall": false}, {"isController": false, "data": [[15.55, 6.25]], "label": "93 /escm/images/summary_edit_pencil.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[14.0, 5.0], [13.0, 25.0], [12.0, 4.25], [20.0, 7.5], [10.0, 2.75], [18.0, 19.0]], "label": "95 /escm/images/order-icon-email.png", "isOverall": false}, {"isController": false, "data": [[15.55, 7.8]], "label": "95 /escm/images/order-icon-email.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 7.7]], "label": "42 /escm/js/usageGraphJS/jqplot.pointLabels.min.js", "isOverall": false}, {"isController": false, "data": [[20.0, 7.7]], "label": "42 /escm/js/usageGraphJS/jqplot.pointLabels.min.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 7467.15]], "label": "77 /escm/order/index", "isOverall": false}, {"isController": false, "data": [[20.0, 7467.15]], "label": "77 /escm/order/index-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 7.700000000000001]], "label": "46 /escm/js/payment/jquery.tzCheckbox.js", "isOverall": false}, {"isController": false, "data": [[20.0, 7.700000000000001]], "label": "46 /escm/js/payment/jquery.tzCheckbox.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 7.749999999999997]], "label": "13 /escm/css/tablesorter.css", "isOverall": false}, {"isController": false, "data": [[20.0, 7.749999999999997]], "label": "13 /escm/css/tablesorter.css-Aggregated", "isOverall": false}, {"isController": false, "data": [[15.0, 7.0], [3.0, 6.0], [14.0, 4.0], [13.0, 6.0], [12.0, 7.0], [2.0, 7.0], [11.0, 5.0], [10.0, 6.0], [17.0, 6.0], [9.0, 6.0], [19.0, 7.0], [8.0, 6.0], [6.0, 6.0], [7.0, 8.0], [20.0, 6.0], [4.0, 6.0], [16.0, 5.0], [18.0, 5.0], [5.0, 6.0]], "label": "76 /escm/css/fonts/Roboto-Regular.ttf", "isOverall": false}, {"isController": false, "data": [[10.549999999999999, 6.1000000000000005]], "label": "76 /escm/css/fonts/Roboto-Regular.ttf-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 8.35]], "label": "38 /escm/js/jquery.leanModal.min.js", "isOverall": false}, {"isController": false, "data": [[20.0, 8.35]], "label": "38 /escm/js/jquery.leanModal.min.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[3.0, 3.0], [15.0, 13.0], [14.0, 3.0], [13.0, 62.0], [12.0, 2.5], [2.0, 3.0], [1.0, 3.0], [10.0, 36.0], [17.0, 47.5], [9.0, 15.0], [19.0, 14.0], [8.0, 4.0], [6.0, 6.0], [7.0, 3.0], [20.0, 10.0], [5.0, 3.5], [18.0, 4.0]], "label": "116 /escm/css/theme/images/ui-icons_bbbbbb_256x240.png", "isOverall": false}, {"isController": false, "data": [[10.649999999999999, 14.3]], "label": "116 /escm/css/theme/images/ui-icons_bbbbbb_256x240.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[3.0, 1903.0], [15.0, 4531.0], [14.0, 3614.0], [13.0, 2921.3333333333335], [12.0, 1987.5], [2.0, 2304.0], [11.0, 3482.5], [1.0, 2785.0], [10.0, 2432.0], [9.0, 2359.0], [17.0, 2820.5], [19.0, 2860.0], [8.0, 2295.5], [6.0, 2467.5], [7.0, 2675.6666666666665], [20.0, 2169.0], [4.0, 3857.0], [5.0, 2212.0], [18.0, 2974.3333333333335]], "label": "110 /escm/order/showOrderDetail", "isOverall": false}, {"isController": false, "data": [[10.825, 2768.0249999999996]], "label": "110 /escm/order/showOrderDetail-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 13.199999999999998]], "label": "22 /escm/js/slideBlock.js", "isOverall": false}, {"isController": false, "data": [[20.0, 13.199999999999998]], "label": "22 /escm/js/slideBlock.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[14.0, 10.0], [13.0, 42.0], [12.0, 9.5], [20.0, 25.857142857142858], [10.0, 6.75], [19.0, 19.71428571428571], [18.0, 43.888888888888886]], "label": "99 /escm/recentItem", "isOverall": false}, {"isController": false, "data": [[17.25, 25.299999999999997]], "label": "99 /escm/recentItem-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 11.949999999999998]], "label": "21 /escm/js/clearinput.js", "isOverall": false}, {"isController": false, "data": [[20.0, 11.949999999999998]], "label": "21 /escm/js/clearinput.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[3.0, 3.0], [15.0, 5.0], [14.0, 4.0], [13.0, 26.0], [12.0, 3.0], [2.0, 7.0], [11.0, 2.0], [1.0, 4.0], [10.0, 13.0], [17.0, 5.0], [9.0, 13.0], [8.0, 3.0], [19.0, 7.0], [6.0, 4.0], [7.0, 9.0], [20.0, 11.0], [4.0, 3.0], [16.0, 11.0], [5.0, 6.0], [18.0, 10.0]], "label": "119 /escm/images/order-icon-stop-billing.png", "isOverall": false}, {"isController": false, "data": [[10.5, 7.449999999999998]], "label": "119 /escm/images/order-icon-stop-billing.png-Aggregated", "isOverall": false}, {"isController": true, "data": [[14.0, 13873.0], [12.0, 13129.0], [20.0, 13457.916666666668], [10.0, 13623.5], [19.0, 12392.88888888889], [18.0, 12933.666666666668]], "label": "Order Selection", "isOverall": false}, {"isController": true, "data": [[17.174999999999997, 13086.150000000001]], "label": "Order Selection-Aggregated", "isOverall": false}, {"isController": false, "data": [[15.0, 8.0], [3.0, 8.5], [14.0, 50.0], [13.0, 22.333333333333332], [12.0, 6.0], [2.0, 12.0], [11.0, 8.0], [1.0, 7.5], [10.0, 14.333333333333334], [9.0, 23.0], [17.0, 12.666666666666666], [19.0, 43.0], [8.0, 13.0], [6.0, 10.0], [7.0, 10.666666666666666], [20.0, 12.5], [4.0, 12.0], [16.0, 21.5], [18.0, 7.5], [5.0, 14.666666666666666]], "label": "117 /escm/messages", "isOverall": false}, {"isController": false, "data": [[10.674999999999999, 16.2]], "label": "117 /escm/messages-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 12.350000000000001]], "label": "18 /escm/js/main.js", "isOverall": false}, {"isController": false, "data": [[20.0, 12.350000000000001]], "label": "18 /escm/js/main.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 11.0]], "label": "34 /escm/js/placeholders.min.js", "isOverall": false}, {"isController": false, "data": [[20.0, 11.0]], "label": "34 /escm/js/placeholders.min.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 5.1000000000000005]], "label": "55 /escm/css/modern_ui/images/dropDown.png", "isOverall": false}, {"isController": false, "data": [[20.0, 5.1000000000000005]], "label": "55 /escm/css/modern_ui/images/dropDown.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[14.0, 11.0], [12.0, 7.4], [20.0, 8.75], [10.0, 2.5], [18.0, 16.5]], "label": "102 /escm/images/order-icon-subscription.png", "isOverall": false}, {"isController": false, "data": [[15.500000000000005, 8.05]], "label": "102 /escm/images/order-icon-subscription.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 16.5]], "label": "10 /escm/css/modern_ui/usageGraph/examples.css", "isOverall": false}, {"isController": false, "data": [[20.0, 16.5]], "label": "10 /escm/css/modern_ui/usageGraph/examples.css-Aggregated", "isOverall": false}, {"isController": false, "data": [[15.0, 4.0], [3.0, 5.0], [14.0, 5.0], [13.0, 4.0], [12.0, 5.0], [2.0, 5.0], [11.0, 4.0], [1.0, 17.0], [10.0, 4.0], [17.0, 5.0], [9.0, 5.0], [19.0, 4.0], [8.0, 4.0], [6.0, 5.0], [7.0, 5.0], [20.0, 5.0], [4.0, 5.0], [16.0, 4.0], [18.0, 4.0], [5.0, 4.0]], "label": "66 /escm/css/jquery.ui.timepicker.css", "isOverall": false}, {"isController": false, "data": [[10.5, 5.15]], "label": "66 /escm/css/jquery.ui.timepicker.css-Aggregated", "isOverall": false}, {"isController": false, "data": [[14.0, 8.0], [12.0, 8.0], [20.0, 32.099999999999994], [10.0, 10.0], [9.0, 14.0], [17.0, 18.333333333333332], [19.0, 31.555555555555557], [18.0, 24.0]], "label": "112 /escm/recentItem", "isOverall": false}, {"isController": false, "data": [[16.499999999999996, 23.025000000000002]], "label": "112 /escm/recentItem-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 6.799999999999999]], "label": "59 /escm/css/theme/images/ui-icons_ffffff_256x240.png", "isOverall": false}, {"isController": false, "data": [[20.0, 6.799999999999999]], "label": "59 /escm/css/theme/images/ui-icons_ffffff_256x240.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[15.0, 5.0], [3.0, 5.0], [14.0, 5.0], [13.0, 5.0], [12.0, 6.0], [2.0, 6.5], [11.0, 5.0], [10.0, 5.0], [17.0, 6.0], [9.0, 5.0], [19.0, 6.0], [8.0, 5.0], [6.0, 5.0], [7.0, 8.0], [20.0, 5.0], [4.0, 5.0], [16.0, 5.0], [18.0, 5.0], [5.0, 5.0]], "label": "65 /escm/css/logintypedialog.css", "isOverall": false}, {"isController": false, "data": [[10.549999999999999, 5.450000000000001]], "label": "65 /escm/css/logintypedialog.css-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 9.75]], "label": "28 /escm/js/usageGraphJS/jqplot.highlighter.min.js", "isOverall": false}, {"isController": false, "data": [[20.0, 9.75]], "label": "28 /escm/js/usageGraphJS/jqplot.highlighter.min.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[15.0, 71.0], [3.0, 76.0], [14.0, 73.0], [13.0, 71.0], [12.0, 68.0], [2.0, 71.0], [11.0, 74.0], [10.0, 69.0], [17.0, 71.0], [9.0, 75.0], [19.0, 68.0], [8.0, 72.0], [6.0, 71.0], [7.0, 72.0], [20.0, 70.0], [4.0, 76.0], [16.0, 69.0], [18.0, 72.0], [5.0, 75.0]], "label": "69 /escm/js/jquery-1.5.2.min.js", "isOverall": false}, {"isController": false, "data": [[10.549999999999999, 71.75000000000001]], "label": "69 /escm/js/jquery-1.5.2.min.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 19.050000000000004]], "label": "43 /escm/js/usageGraphJS/jqplot.cursor.min.js", "isOverall": false}, {"isController": false, "data": [[20.0, 19.050000000000004]], "label": "43 /escm/js/usageGraphJS/jqplot.cursor.min.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 11.2]], "label": "49 /escm/images/myAccount.png", "isOverall": false}, {"isController": false, "data": [[20.0, 11.2]], "label": "49 /escm/images/myAccount.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 11.35]], "label": "19 /escm/js/jquery-validate/additional-methods.min.js", "isOverall": false}, {"isController": false, "data": [[20.0, 11.35]], "label": "19 /escm/js/jquery-validate/additional-methods.min.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 16.750000000000004]], "label": "14 /escm/css/modern_ui/jquery.multiselect.css", "isOverall": false}, {"isController": false, "data": [[20.0, 16.750000000000004]], "label": "14 /escm/css/modern_ui/jquery.multiselect.css-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 10.05]], "label": "35 /escm/js/jquery.elastic.source.js", "isOverall": false}, {"isController": false, "data": [[20.0, 10.05]], "label": "35 /escm/js/jquery.elastic.source.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[15.0, 10.0], [3.0, 14.0], [14.0, 8.0], [13.0, 8.0], [12.0, 9.0], [2.0, 10.0], [11.0, 114.0], [1.0, 11.0], [10.0, 7.0], [17.0, 9.0], [9.0, 7.0], [19.0, 9.0], [8.0, 8.0], [6.0, 8.0], [7.0, 10.0], [20.0, 8.0], [4.0, 8.0], [16.0, 7.0], [18.0, 8.0], [5.0, 8.0]], "label": "72 /escm/js/validator.js", "isOverall": false}, {"isController": false, "data": [[10.5, 14.049999999999999]], "label": "72 /escm/js/validator.js-Aggregated", "isOverall": false}, {"isController": true, "data": [[20.0, 12804.850000000002]], "label": "Login Page Credentials and Dashboard Display", "isOverall": false}, {"isController": true, "data": [[20.0, 12804.850000000002]], "label": "Login Page Credentials and Dashboard Display-Aggregated", "isOverall": false}, {"isController": false, "data": [[15.0, 5.0], [3.0, 7.0], [14.0, 5.0], [13.0, 5.0], [12.0, 5.0], [2.0, 6.0], [11.0, 5.0], [1.0, 8.0], [10.0, 6.0], [17.0, 6.0], [9.0, 7.0], [19.0, 5.0], [8.0, 6.0], [6.0, 5.0], [7.0, 7.0], [20.0, 5.0], [4.0, 6.0], [16.0, 7.0], [18.0, 6.0], [5.0, 6.0]], "label": "73 /escm/js/jquery.bpopup.min.js", "isOverall": false}, {"isController": false, "data": [[10.5, 5.9]], "label": "73 /escm/js/jquery.bpopup.min.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 9.450000000000001]], "label": "48 /escm/css/modern_ui/images/myDashboard.png", "isOverall": false}, {"isController": false, "data": [[20.0, 9.450000000000001]], "label": "48 /escm/css/modern_ui/images/myDashboard.png-Aggregated", "isOverall": false}, {"isController": true, "data": [[3.0, 3747.0], [15.0, 4207.5], [14.0, 4411.5], [13.0, 4050.5], [12.0, 3204.5], [2.0, 3294.0], [11.0, 3339.0], [1.0, 3499.5], [10.0, 3164.0], [17.0, 3933.0], [9.0, 3727.0], [8.0, 2894.5], [19.0, 3623.5], [6.0, 3193.5], [7.0, 3216.0], [20.0, 2843.5], [4.0, 3787.5], [16.0, 3977.5], [5.0, 3229.5], [18.0, 3381.0]], "label": "Order_Search", "isOverall": false}, {"isController": true, "data": [[10.5, 3536.2]], "label": "Order_Search-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 14.700000000000001]], "label": "33 /escm/js/usageGraphJS/excanvas.min.js", "isOverall": false}, {"isController": false, "data": [[20.0, 14.700000000000001]], "label": "33 /escm/js/usageGraphJS/excanvas.min.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 11986.349999999997]], "label": "5 /escm/login/doAuth?id=loginform", "isOverall": false}, {"isController": false, "data": [[20.0, 11986.349999999997]], "label": "5 /escm/login/doAuth?id=loginform-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 10.999999999999998]], "label": "92 /escm/css/theme/images/ui-icons_blue_256x240.png", "isOverall": false}, {"isController": false, "data": [[20.0, 10.999999999999998]], "label": "92 /escm/css/theme/images/ui-icons_blue_256x240.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 10.600000000000001]], "label": "40 /escm/js/escm_alert.js", "isOverall": false}, {"isController": false, "data": [[20.0, 10.600000000000001]], "label": "40 /escm/js/escm_alert.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 13.25]], "label": "83 /escm/images/hourglass.png", "isOverall": false}, {"isController": false, "data": [[20.0, 13.25]], "label": "83 /escm/images/hourglass.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 25.149999999999995]], "label": "90 /escm/images/next.png", "isOverall": false}, {"isController": false, "data": [[20.0, 25.149999999999995]], "label": "90 /escm/images/next.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 15.5]], "label": "81 /escm/images/recent.png", "isOverall": false}, {"isController": false, "data": [[20.0, 15.5]], "label": "81 /escm/images/recent.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[3.0, 4.0], [15.0, 4.0], [14.0, 4.0], [13.0, 4.0], [12.0, 4.0], [2.0, 3.0], [1.0, 2.0], [10.0, 9.0], [17.0, 7.0], [9.0, 13.0], [19.0, 4.0], [8.0, 4.0], [6.0, 3.0], [7.0, 3.0], [20.0, 6.0], [5.0, 4.5], [18.0, 3.0]], "label": "113 /escm/images/trash.png", "isOverall": false}, {"isController": false, "data": [[10.649999999999999, 4.85]], "label": "113 /escm/images/trash.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 8.299999999999999]], "label": "24 /escm/js/datatable.js", "isOverall": false}, {"isController": false, "data": [[20.0, 8.299999999999999]], "label": "24 /escm/js/datatable.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[15.0, 46.0], [3.0, 46.0], [14.0, 48.0], [13.0, 43.0], [12.0, 48.0], [2.0, 62.0], [11.0, 53.0], [1.0, 55.0], [10.0, 46.0], [17.0, 52.0], [9.0, 53.0], [19.0, 50.0], [8.0, 54.0], [6.0, 43.0], [7.0, 44.0], [20.0, 47.0], [4.0, 55.0], [16.0, 49.0], [18.0, 56.0], [5.0, 52.0]], "label": "70 /escm/js/jquery-ui-1.8.17.custom.min.js", "isOverall": false}, {"isController": false, "data": [[10.5, 50.099999999999994]], "label": "70 /escm/js/jquery-ui-1.8.17.custom.min.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 25.350000000000005]], "label": "17 /escm/js/jquery.tablesorter.js", "isOverall": false}, {"isController": false, "data": [[20.0, 25.350000000000005]], "label": "17 /escm/js/jquery.tablesorter.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 8.649999999999999]], "label": "12 /escm/css/payment/jquery.tzCheckbox.css", "isOverall": false}, {"isController": false, "data": [[20.0, 8.649999999999999]], "label": "12 /escm/css/payment/jquery.tzCheckbox.css-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 9.6]], "label": "36 /escm/js/MonthPicker.min.js", "isOverall": false}, {"isController": false, "data": [[20.0, 9.6]], "label": "36 /escm/js/MonthPicker.min.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 12.649999999999999]], "label": "27 /escm/js/usageGraphJS/jqplot.enhancedLegendRenderer.min.js", "isOverall": false}, {"isController": false, "data": [[20.0, 12.649999999999999]], "label": "27 /escm/js/usageGraphJS/jqplot.enhancedLegendRenderer.min.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 7.15]], "label": "50 /escm/css/modern_ui/images/myCatalog.png", "isOverall": false}, {"isController": false, "data": [[20.0, 7.15]], "label": "50 /escm/css/modern_ui/images/myCatalog.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[14.0, 5287.0], [13.0, 5497.5], [12.0, 5375.666666666667], [20.0, 4647.374999999999], [10.0, 5563.5], [19.0, 5624.75], [18.0, 5768.0]], "label": "88 /escm/order/showOrderDetail", "isOverall": false}, {"isController": false, "data": [[17.400000000000006, 5215.675000000001]], "label": "88 /escm/order/showOrderDetail-Aggregated", "isOverall": false}, {"isController": false, "data": [[15.0, 10.0], [3.0, 11.0], [14.0, 9.0], [13.0, 9.0], [12.0, 11.0], [2.0, 13.0], [11.0, 14.0], [1.0, 14.0], [10.0, 13.0], [17.0, 11.0], [9.0, 12.0], [19.0, 9.0], [8.0, 10.0], [6.0, 10.0], [7.0, 12.0], [20.0, 12.0], [4.0, 11.0], [16.0, 9.0], [18.0, 10.0], [5.0, 10.0]], "label": "63 /escm/css/theme/jquery-ui-1.8.17.custom.css", "isOverall": false}, {"isController": false, "data": [[10.5, 11.0]], "label": "63 /escm/css/theme/jquery-ui-1.8.17.custom.css-Aggregated", "isOverall": false}, {"isController": false, "data": [[14.0, 4.0], [12.0, 5.2], [20.0, 10.375], [10.0, 4.5], [17.0, 46.0], [18.0, 27.0]], "label": "107 /escm/css/theme/images/ui-icons_222222_256x240.png", "isOverall": false}, {"isController": false, "data": [[15.449999999999998, 10.200000000000001]], "label": "107 /escm/css/theme/images/ui-icons_222222_256x240.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[14.0, 560.0], [12.0, 545.0], [20.0, 599.3], [10.0, 625.0], [17.0, 600.5], [19.0, 534.3333333333334], [18.0, 531.0]], "label": "109 /escm/order/searchOrder", "isOverall": false}, {"isController": false, "data": [[16.525, 581.4749999999999]], "label": "109 /escm/order/searchOrder-Aggregated", "isOverall": false}, {"isController": false, "data": [[14.0, 10.0], [13.0, 7.0], [12.0, 3.5], [20.0, 7.125], [10.0, 2.0], [18.0, 3.5]], "label": "96 /escm/images/slider-arrow-left.png", "isOverall": false}, {"isController": false, "data": [[15.55, 5.15]], "label": "96 /escm/images/slider-arrow-left.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[14.0, 5.0], [12.0, 6.4], [20.0, 9.625], [10.0, 2.75], [18.0, 5.0]], "label": "104 /escm/images/order-icon-installment.png", "isOverall": false}, {"isController": false, "data": [[15.500000000000005, 6.75]], "label": "104 /escm/images/order-icon-installment.png-Aggregated", "isOverall": false}, {"isController": false, "data": [[15.0, 69.0], [3.0, 72.0], [14.0, 68.0], [13.0, 78.0], [12.0, 70.0], [2.0, 81.5], [11.0, 78.0], [10.0, 67.0], [17.0, 79.0], [9.0, 81.0], [19.0, 71.0], [8.0, 70.0], [6.0, 78.0], [7.0, 81.0], [20.0, 67.0], [4.0, 79.0], [16.0, 68.0], [18.0, 72.0], [5.0, 72.0]], "label": "64 /escm/css/merchant.css", "isOverall": false}, {"isController": false, "data": [[10.549999999999999, 74.14999999999999]], "label": "64 /escm/css/merchant.css-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 14.549999999999997]], "label": "20 /escm/js/jquery-validate/jquery.validate.min.js", "isOverall": false}, {"isController": false, "data": [[20.0, 14.549999999999997]], "label": "20 /escm/js/jquery-validate/jquery.validate.min.js-Aggregated", "isOverall": false}, {"isController": false, "data": [[20.0, 10.5]], "label": "86 /escm/images/bb_ajax_loader.gif", "isOverall": false}, {"isController": false, "data": [[20.0, 10.5]], "label": "86 /escm/images/bb_ajax_loader.gif-Aggregated", "isOverall": false}], "title": "Time VS Threads", "maxY": 13873.0, "maxX": 20.0, "minX": 1.0, "minY": 2.0}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: { noColumns: 2,show: true, container: '#legendTimeVsThreads' },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s: At %x.2 active threads, Average response time was %y.2 ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesTimeVsThreads"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotTimesVsThreads"), dataset, options);
            // setup overview
            $.plot($("#overviewTimesVsThreads"), dataset, prepareOverviewOptions(options));
        }
};

// Time vs threads
function refreshTimeVsThreads(){
    var infos = timeVsThreadsInfos;
    prepareSeries(infos.data);
    if(isGraph($("#flotTimesVsThreads"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTimeVsThreads");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTimesVsThreads", "#overviewTimesVsThreads");
        $('#footerTimeVsThreads .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var bytesThroughputOverTimeInfos = {
        data : {"result": {"supportsControllersDiscrimination": false, "series": [{"isController": false, "data": [[1.49727288E12, 265639.26666666666], [1.49727282E12, 92012.1], [1.49727276E12, 27463.0], [1.4972727E12, 1045.2]], "label": "Bytes received per second", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727282E12, 0.0], [1.49727276E12, 0.0], [1.4972727E12, 0.0]], "label": "Bytes sent per second", "isOverall": false}], "title": "Bytes Throughput Over Time", "granularity": 60000, "maxY": 265639.26666666666, "maxX": 1.49727288E12, "minX": 1.4972727E12, "minY": 0.0}},
        getOptions : function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: "%H:%M:%S",
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity) ,
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Bytes/sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendBytesThroughputOverTime'
                },
                selection: {
                    mode: "xy"
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y"
                }
            };
        },
        createGraph : function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesBytesThroughputOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotBytesThroughputOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewBytesThroughputOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Bytes throughput Over Time
function refreshBytesThroughputOverTime(fixTimestamps) {
    var infos = bytesThroughputOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 19800000);
    }
    if(isGraph($("#flotBytesThroughputOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesBytesThroughputOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotBytesThroughputOverTime", "#overviewBytesThroughputOverTime");
        $('#footerBytesThroughputOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimesOverTimeInfos = {
        data: {"result": {"supportsControllersDiscrimination": true, "series": [{"isController": false, "data": [[1.49727288E12, 8.5]], "label": "26 /escm/js/usageGraphJS/jqplot.canvasAxisTickRenderer.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 13.75]], "label": "85 /escm/images/cancelicon.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 6.3]], "label": "108 /escm/images/BB-ajax-loader-round.gif", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 6.25]], "label": "101 /escm/images/order-icon-custom-fields.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 19.100000000000005]], "label": "16 /escm/js/jquery.blockUI.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 10.950000000000001]], "label": "94 /escm/images/warn.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 7.5]], "label": "58 /escm/css/theme/images/ui-icons_ededed_256x240.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 12.999999999999996]], "label": "91 /escm/images/view_mail.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 10.900000000000002]], "label": "51 /escm/images/orders.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 7.049999999999999]], "label": "105 /escm/images/order-icon-quote.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 15.999999999999998]], "label": "79 /escm/images/icon14.gif", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 6.699999999999999]], "label": "56 /escm/images/_loading.gif", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 6.111111111111111], [1.49727282E12, 6.363636363636363]], "label": "71 /escm/js/jquery.alerts.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 84.95]], "label": "32 /escm/js/usageGraphJS/jquery.jqplot.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 5.700000000000001]], "label": "54 /escm/css/modern_ui/images/CP_login.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 9.849999999999998]], "label": "106 /escm/images/order-icon-ticket.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 10.749999999999998], [1.49727276E12, 45.69999999999999]], "label": "98 /escm/messages", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 7.400000000000001]], "label": "115 /escm/images/help.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 8.6]], "label": "57 /escm/images/bubble.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 10.55]], "label": "30 /escm/js/usageGraphJS/jqplot.canvasAxisLabelRenderer.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 2.6666666666666665], [1.49727282E12, 3.0000000000000004]], "label": "68 /escmnull/css/merchant.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 6.3]], "label": "120 /escm/images/order-icon-usage.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 23.099999999999998]], "label": "39 /escm/js/jquery.ui.timepicker.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 8.55]], "label": "9 /escm/css/modern_ui/usageGraph/jquery.jqplot.min.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 11.45]], "label": "87 /escm/images/ticket/order_ticket.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 15.499999999999998]], "label": "31 /escm/js/usageGraphJS/jqplot.canvasTextRenderer.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 7.55]], "label": "103 /escm/images/order-icon-provisioned.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 14.5]], "label": "84 /escm/images/express_order.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 11.549999999999999]], "label": "11 /escm/css/modern_ui/usageGraph/jquery.jqplot.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 7.3500000000000005]], "label": "100 /escm/images/order-icon-adjust.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 4.888888888888889], [1.49727282E12, 6.181818181818181]], "label": "74 /escm/css/fonts/Roboto-Light.woff", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 47.25], [1.49727282E12, 92.08333333333333], [1.49727276E12, 44.125], [1.4972727E12, 99.91666666666666]], "label": "62 /escm/login/auth", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 18.750000000000004]], "label": "15 /escm/js/jquery.qtip-1.0.0-rc3.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 13.05]], "label": "29 /escm/js/usageGraphJS/jqplot.dateAxisRenderer.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 11.3]], "label": "82 /escm/images/orderstatusicon/provisioningfailed.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 6.050000000000001]], "label": "25 /escm/js/jquery.ba-dotimeout.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 11.7]], "label": "89 /escm/images/previous.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 11.799999999999999]], "label": "37 /escm/js/jquery.slimscroll.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 9.4]], "label": "53 /escm/images/settings.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 5.75], [1.49727282E12, 6.666666666666667]], "label": "67 /escm/css/jquery.alerts.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 15.299999999999997], [1.49727276E12, 50.50000000000001]], "label": "111 /escm/messages", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 20.55]], "label": "41 /escm/js/jquery.flexslider.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 7.55]], "label": "52 /escm/images/ticket/39x39ticket.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 10.35], [1.49727276E12, 33.1]], "label": "118 /escm/recentItem", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 4.888888888888889], [1.49727282E12, 5.545454545454544]], "label": "75 /escm/css/fonts/Roboto-Bold.woff", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 8.750000000000002]], "label": "47 /escm/js/panels.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 8.55]], "label": "23 /escm/js/jquery-validate/jquery.metadata.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 6.75]], "label": "97 /escm/images/slider-arrow-right.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 6.949999999999999]], "label": "44 /escm/js/jquery.scrollToTop.min.js", "isOverall": false}, {"isController": true, "data": [[1.49727288E12, 301.125], [1.49727282E12, 372.66666666666663], [1.49727276E12, 296.0], [1.4972727E12, 375.5]], "label": "Login Page Request", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 9.899999999999999]], "label": "114 /escm/images/icon20.gif", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 134.15000000000003]], "label": "45 /escm/js/payment/jquery.dataTables.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 7.7]], "label": "80 /escm/images/loading.gif", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 6.25]], "label": "93 /escm/images/summary_edit_pencil.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 7.8]], "label": "95 /escm/images/order-icon-email.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 7.7]], "label": "42 /escm/js/usageGraphJS/jqplot.pointLabels.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 8482.35], [1.49727276E12, 6451.950000000001]], "label": "77 /escm/order/index", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 7.700000000000001]], "label": "46 /escm/js/payment/jquery.tzCheckbox.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 7.749999999999997]], "label": "13 /escm/css/tablesorter.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 5.888888888888889], [1.49727282E12, 6.272727272727274]], "label": "76 /escm/css/fonts/Roboto-Regular.ttf", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 8.35]], "label": "38 /escm/js/jquery.leanModal.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 14.3]], "label": "116 /escm/css/theme/images/ui-icons_bbbbbb_256x240.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 2706.85], [1.49727276E12, 2829.1999999999994]], "label": "110 /escm/order/showOrderDetail", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 13.199999999999998]], "label": "22 /escm/js/slideBlock.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 12.799999999999999], [1.49727276E12, 37.800000000000004]], "label": "99 /escm/recentItem", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 11.949999999999998]], "label": "21 /escm/js/clearinput.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 7.449999999999998]], "label": "119 /escm/images/order-icon-stop-billing.png", "isOverall": false}, {"isController": true, "data": [[1.49727288E12, 13584.300000000001], [1.49727276E12, 12588.0]], "label": "Order Selection", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 14.350000000000001], [1.49727276E12, 18.05]], "label": "117 /escm/messages", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 12.350000000000001]], "label": "18 /escm/js/main.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 11.0]], "label": "34 /escm/js/placeholders.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 5.1000000000000005]], "label": "55 /escm/css/modern_ui/images/dropDown.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 8.05]], "label": "102 /escm/images/order-icon-subscription.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 16.5]], "label": "10 /escm/css/modern_ui/usageGraph/examples.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 4.444444444444445], [1.49727282E12, 5.7272727272727275]], "label": "66 /escm/css/jquery.ui.timepicker.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 21.599999999999998], [1.49727276E12, 24.449999999999996]], "label": "112 /escm/recentItem", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 6.799999999999999]], "label": "59 /escm/css/theme/images/ui-icons_ffffff_256x240.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 5.333333333333334], [1.49727282E12, 5.545454545454546]], "label": "65 /escm/css/logintypedialog.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 9.75]], "label": "28 /escm/js/usageGraphJS/jqplot.highlighter.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 70.33333333333333], [1.49727282E12, 72.90909090909092]], "label": "69 /escm/js/jquery-1.5.2.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 19.050000000000004]], "label": "43 /escm/js/usageGraphJS/jqplot.cursor.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 11.2]], "label": "49 /escm/images/myAccount.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 11.35]], "label": "19 /escm/js/jquery-validate/additional-methods.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 16.750000000000004]], "label": "14 /escm/css/modern_ui/jquery.multiselect.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 10.05]], "label": "35 /escm/js/jquery.elastic.source.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 8.444444444444445], [1.49727282E12, 18.636363636363637]], "label": "72 /escm/js/validator.js", "isOverall": false}, {"isController": true, "data": [[1.49727288E12, 11994.0], [1.49727282E12, 12911.545454545454], [1.49727276E12, 13276.8], [1.4972727E12, 12945.3]], "label": "Login Page Credentials and Dashboard Display", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 5.444444444444445], [1.49727282E12, 6.2727272727272725]], "label": "73 /escm/js/jquery.bpopup.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 9.450000000000001]], "label": "48 /escm/css/modern_ui/images/myDashboard.png", "isOverall": false}, {"isController": true, "data": [[1.49727288E12, 3454.45], [1.49727276E12, 3617.95]], "label": "Order_Search", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 14.700000000000001]], "label": "33 /escm/js/usageGraphJS/excanvas.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 11724.35], [1.49727276E12, 12248.349999999999]], "label": "5 /escm/login/doAuth?id=loginform", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 10.999999999999998]], "label": "92 /escm/css/theme/images/ui-icons_blue_256x240.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 10.600000000000001]], "label": "40 /escm/js/escm_alert.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 13.25]], "label": "83 /escm/images/hourglass.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 25.149999999999995]], "label": "90 /escm/images/next.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 15.5]], "label": "81 /escm/images/recent.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 4.85]], "label": "113 /escm/images/trash.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 8.299999999999999]], "label": "24 /escm/js/datatable.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 48.77777777777778], [1.49727282E12, 51.18181818181818]], "label": "70 /escm/js/jquery-ui-1.8.17.custom.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 25.350000000000005]], "label": "17 /escm/js/jquery.tablesorter.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 8.649999999999999]], "label": "12 /escm/css/payment/jquery.tzCheckbox.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 9.6]], "label": "36 /escm/js/MonthPicker.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 12.649999999999999]], "label": "27 /escm/js/usageGraphJS/jqplot.enhancedLegendRenderer.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 7.15]], "label": "50 /escm/css/modern_ui/images/myCatalog.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 4813.85], [1.49727276E12, 5617.500000000001]], "label": "88 /escm/order/showOrderDetail", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 9.875], [1.49727282E12, 11.75]], "label": "63 /escm/css/theme/jquery-ui-1.8.17.custom.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 10.200000000000001]], "label": "107 /escm/css/theme/images/ui-icons_222222_256x240.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 619.3000000000001], [1.49727276E12, 543.6500000000001]], "label": "109 /escm/order/searchOrder", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 5.15]], "label": "96 /escm/images/slider-arrow-left.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 6.75]], "label": "104 /escm/images/order-icon-installment.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 71.33333333333333], [1.49727282E12, 76.45454545454545]], "label": "64 /escm/css/merchant.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 14.549999999999997]], "label": "20 /escm/js/jquery-validate/jquery.validate.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 10.5]], "label": "86 /escm/images/bb_ajax_loader.gif", "isOverall": false}], "title": "Response Time Over Time", "granularity": 60000, "maxY": 13584.300000000001, "maxX": 1.49727288E12, "minX": 1.4972727E12, "minY": 2.6666666666666665}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: "%H:%M:%S",
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Response time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average response time was %y ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Times Over Time
function refreshResponseTimeOverTime(fixTimestamps) {
    var infos = responseTimesOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 19800000);
    }
    if(isGraph($("#flotResponseTimesOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesOverTime", "#overviewResponseTimesOverTime");
        $('#footerResponseTimesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var latenciesOverTimeInfos = {
        data: {"result": {"supportsControllersDiscrimination": true, "series": [{"isController": false, "data": [[1.49727288E12, 0.0]], "label": "26 /escm/js/usageGraphJS/jqplot.canvasAxisTickRenderer.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "85 /escm/images/cancelicon.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "108 /escm/images/BB-ajax-loader-round.gif", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "101 /escm/images/order-icon-custom-fields.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "16 /escm/js/jquery.blockUI.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "94 /escm/images/warn.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "58 /escm/css/theme/images/ui-icons_ededed_256x240.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "91 /escm/images/view_mail.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "51 /escm/images/orders.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "105 /escm/images/order-icon-quote.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "79 /escm/images/icon14.gif", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "56 /escm/images/_loading.gif", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727282E12, 0.0]], "label": "71 /escm/js/jquery.alerts.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "32 /escm/js/usageGraphJS/jquery.jqplot.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "54 /escm/css/modern_ui/images/CP_login.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "106 /escm/images/order-icon-ticket.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727276E12, 44.00000000000001]], "label": "98 /escm/messages", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "115 /escm/images/help.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "57 /escm/images/bubble.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "30 /escm/js/usageGraphJS/jqplot.canvasAxisLabelRenderer.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727282E12, 0.0]], "label": "68 /escmnull/css/merchant.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "120 /escm/images/order-icon-usage.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "39 /escm/js/jquery.ui.timepicker.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "9 /escm/css/modern_ui/usageGraph/jquery.jqplot.min.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "87 /escm/images/ticket/order_ticket.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "31 /escm/js/usageGraphJS/jqplot.canvasTextRenderer.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "103 /escm/images/order-icon-provisioned.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "84 /escm/images/express_order.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "11 /escm/css/modern_ui/usageGraph/jquery.jqplot.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "100 /escm/images/order-icon-adjust.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727282E12, 0.0]], "label": "74 /escm/css/fonts/Roboto-Light.woff", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727282E12, 0.0], [1.49727276E12, 42.375], [1.4972727E12, 97.66666666666666]], "label": "62 /escm/login/auth", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "15 /escm/js/jquery.qtip-1.0.0-rc3.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "29 /escm/js/usageGraphJS/jqplot.dateAxisRenderer.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "82 /escm/images/orderstatusicon/provisioningfailed.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "25 /escm/js/jquery.ba-dotimeout.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "89 /escm/images/previous.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "37 /escm/js/jquery.slimscroll.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "53 /escm/images/settings.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727282E12, 0.0]], "label": "67 /escm/css/jquery.alerts.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727276E12, 49.75]], "label": "111 /escm/messages", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "41 /escm/js/jquery.flexslider.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "52 /escm/images/ticket/39x39ticket.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727276E12, 26.30000000000001]], "label": "118 /escm/recentItem", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727282E12, 0.0]], "label": "75 /escm/css/fonts/Roboto-Bold.woff", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "47 /escm/js/panels.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "23 /escm/js/jquery-validate/jquery.metadata.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "97 /escm/images/slider-arrow-right.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "44 /escm/js/jquery.scrollToTop.min.js", "isOverall": false}, {"isController": true, "data": [[1.49727288E12, 24.75], [1.49727282E12, 54.00000000000001], [1.49727276E12, 169.37500000000003], [1.4972727E12, 234.16666666666666]], "label": "Login Page Request", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "114 /escm/images/icon20.gif", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "45 /escm/js/payment/jquery.dataTables.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "80 /escm/images/loading.gif", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "93 /escm/images/summary_edit_pencil.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "95 /escm/images/order-icon-email.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "42 /escm/js/usageGraphJS/jqplot.pointLabels.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727276E12, 19.45]], "label": "77 /escm/order/index", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "46 /escm/js/payment/jquery.tzCheckbox.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "13 /escm/css/tablesorter.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727282E12, 0.0]], "label": "76 /escm/css/fonts/Roboto-Regular.ttf", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "38 /escm/js/jquery.leanModal.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "116 /escm/css/theme/images/ui-icons_bbbbbb_256x240.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727276E12, 2812.1000000000004]], "label": "110 /escm/order/showOrderDetail", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "22 /escm/js/slideBlock.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727276E12, 36.800000000000004]], "label": "99 /escm/recentItem", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "21 /escm/js/clearinput.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "119 /escm/images/order-icon-stop-billing.png", "isOverall": false}, {"isController": true, "data": [[1.49727288E12, 34.449999999999996], [1.49727276E12, 6134.1]], "label": "Order Selection", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727276E12, 17.6]], "label": "117 /escm/messages", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "18 /escm/js/main.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "34 /escm/js/placeholders.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "55 /escm/css/modern_ui/images/dropDown.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "102 /escm/images/order-icon-subscription.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "10 /escm/css/modern_ui/usageGraph/examples.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727282E12, 0.0]], "label": "66 /escm/css/jquery.ui.timepicker.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727276E12, 23.150000000000006]], "label": "112 /escm/recentItem", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "59 /escm/css/theme/images/ui-icons_ffffff_256x240.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727282E12, 0.0]], "label": "65 /escm/css/logintypedialog.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "28 /escm/js/usageGraphJS/jqplot.highlighter.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727282E12, 0.0]], "label": "69 /escm/js/jquery-1.5.2.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "43 /escm/js/usageGraphJS/jqplot.cursor.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "49 /escm/images/myAccount.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "19 /escm/js/jquery-validate/additional-methods.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "14 /escm/css/modern_ui/jquery.multiselect.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "35 /escm/js/jquery.elastic.source.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727282E12, 0.0]], "label": "72 /escm/js/validator.js", "isOverall": false}, {"isController": true, "data": [[1.49727288E12, 4076.444444444445], [1.49727282E12, 14194.27272727273], [1.49727276E12, 7880.9], [1.4972727E12, 8176.200000000001]], "label": "Login Page Credentials and Dashboard Display", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727282E12, 0.0]], "label": "73 /escm/js/jquery.bpopup.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "48 /escm/css/modern_ui/images/myDashboard.png", "isOverall": false}, {"isController": true, "data": [[1.49727288E12, 19.6], [1.49727276E12, 3589.7000000000003]], "label": "Order_Search", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "33 /escm/js/usageGraphJS/excanvas.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727276E12, 7399.9]], "label": "5 /escm/login/doAuth?id=loginform", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "92 /escm/css/theme/images/ui-icons_blue_256x240.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "40 /escm/js/escm_alert.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "83 /escm/images/hourglass.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "90 /escm/images/next.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "81 /escm/images/recent.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "113 /escm/images/trash.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "24 /escm/js/datatable.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727282E12, 0.0]], "label": "70 /escm/js/jquery-ui-1.8.17.custom.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "17 /escm/js/jquery.tablesorter.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "12 /escm/css/payment/jquery.tzCheckbox.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "36 /escm/js/MonthPicker.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "27 /escm/js/usageGraphJS/jqplot.enhancedLegendRenderer.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "50 /escm/css/modern_ui/images/myCatalog.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727276E12, 5604.85]], "label": "88 /escm/order/showOrderDetail", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727282E12, 0.0]], "label": "63 /escm/css/theme/jquery-ui-1.8.17.custom.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "107 /escm/css/theme/images/ui-icons_222222_256x240.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727276E12, 542.85]], "label": "109 /escm/order/searchOrder", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "96 /escm/images/slider-arrow-left.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "104 /escm/images/order-icon-installment.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727282E12, 0.0]], "label": "64 /escm/css/merchant.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "20 /escm/js/jquery-validate/jquery.validate.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "86 /escm/images/bb_ajax_loader.gif", "isOverall": false}], "title": "Latencies Over Time", "granularity": 60000, "maxY": 14194.27272727273, "maxX": 1.49727288E12, "minX": 1.4972727E12, "minY": 0.0}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: "%H:%M:%S",
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Response latencies in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendLatenciesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average latency was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesLatenciesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotLatenciesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewLatenciesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Latencies Over Time
function refreshLatenciesOverTime(fixTimestamps) {
    var infos = latenciesOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 19800000);
    }
    if(isGraph($("#flotLatenciesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesLatenciesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotLatenciesOverTime", "#overviewLatenciesOverTime");
        $('#footerLatenciesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var connectTimeOverTimeInfos = {
        data: {"result": {"supportsControllersDiscrimination": true, "series": [{"isController": false, "data": [[1.49727288E12, 0.0]], "label": "26 /escm/js/usageGraphJS/jqplot.canvasAxisTickRenderer.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "85 /escm/images/cancelicon.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "108 /escm/images/BB-ajax-loader-round.gif", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "101 /escm/images/order-icon-custom-fields.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "16 /escm/js/jquery.blockUI.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "94 /escm/images/warn.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "58 /escm/css/theme/images/ui-icons_ededed_256x240.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "91 /escm/images/view_mail.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "51 /escm/images/orders.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "105 /escm/images/order-icon-quote.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "79 /escm/images/icon14.gif", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "56 /escm/images/_loading.gif", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727282E12, 0.0]], "label": "71 /escm/js/jquery.alerts.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "32 /escm/js/usageGraphJS/jquery.jqplot.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "54 /escm/css/modern_ui/images/CP_login.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "106 /escm/images/order-icon-ticket.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727276E12, 0.0]], "label": "98 /escm/messages", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "115 /escm/images/help.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "57 /escm/images/bubble.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "30 /escm/js/usageGraphJS/jqplot.canvasAxisLabelRenderer.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727282E12, 0.0]], "label": "68 /escmnull/css/merchant.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "120 /escm/images/order-icon-usage.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "39 /escm/js/jquery.ui.timepicker.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "9 /escm/css/modern_ui/usageGraph/jquery.jqplot.min.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "87 /escm/images/ticket/order_ticket.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "31 /escm/js/usageGraphJS/jqplot.canvasTextRenderer.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "103 /escm/images/order-icon-provisioned.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "84 /escm/images/express_order.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "11 /escm/css/modern_ui/usageGraph/jquery.jqplot.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "100 /escm/images/order-icon-adjust.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727282E12, 0.0]], "label": "74 /escm/css/fonts/Roboto-Light.woff", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727282E12, 0.0], [1.49727276E12, 0.0], [1.4972727E12, 0.0]], "label": "62 /escm/login/auth", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "15 /escm/js/jquery.qtip-1.0.0-rc3.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "29 /escm/js/usageGraphJS/jqplot.dateAxisRenderer.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "82 /escm/images/orderstatusicon/provisioningfailed.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "25 /escm/js/jquery.ba-dotimeout.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "89 /escm/images/previous.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "37 /escm/js/jquery.slimscroll.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "53 /escm/images/settings.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727282E12, 0.0]], "label": "67 /escm/css/jquery.alerts.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727276E12, 0.0]], "label": "111 /escm/messages", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "41 /escm/js/jquery.flexslider.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "52 /escm/images/ticket/39x39ticket.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727276E12, 0.0]], "label": "118 /escm/recentItem", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727282E12, 0.0]], "label": "75 /escm/css/fonts/Roboto-Bold.woff", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "47 /escm/js/panels.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "23 /escm/js/jquery-validate/jquery.metadata.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "97 /escm/images/slider-arrow-right.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "44 /escm/js/jquery.scrollToTop.min.js", "isOverall": false}, {"isController": true, "data": [[1.49727288E12, 0.0], [1.49727282E12, 0.0], [1.49727276E12, 0.0], [1.4972727E12, 0.0]], "label": "Login Page Request", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "114 /escm/images/icon20.gif", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "45 /escm/js/payment/jquery.dataTables.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "80 /escm/images/loading.gif", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "93 /escm/images/summary_edit_pencil.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "95 /escm/images/order-icon-email.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "42 /escm/js/usageGraphJS/jqplot.pointLabels.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727276E12, 0.0]], "label": "77 /escm/order/index", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "46 /escm/js/payment/jquery.tzCheckbox.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "13 /escm/css/tablesorter.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727282E12, 0.0]], "label": "76 /escm/css/fonts/Roboto-Regular.ttf", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "38 /escm/js/jquery.leanModal.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "116 /escm/css/theme/images/ui-icons_bbbbbb_256x240.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727276E12, 0.0]], "label": "110 /escm/order/showOrderDetail", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "22 /escm/js/slideBlock.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727276E12, 0.0]], "label": "99 /escm/recentItem", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "21 /escm/js/clearinput.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "119 /escm/images/order-icon-stop-billing.png", "isOverall": false}, {"isController": true, "data": [[1.49727288E12, 0.0], [1.49727276E12, 0.0]], "label": "Order Selection", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727276E12, 0.0]], "label": "117 /escm/messages", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "18 /escm/js/main.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "34 /escm/js/placeholders.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "55 /escm/css/modern_ui/images/dropDown.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "102 /escm/images/order-icon-subscription.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "10 /escm/css/modern_ui/usageGraph/examples.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727282E12, 0.0]], "label": "66 /escm/css/jquery.ui.timepicker.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727276E12, 0.0]], "label": "112 /escm/recentItem", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "59 /escm/css/theme/images/ui-icons_ffffff_256x240.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727282E12, 0.0]], "label": "65 /escm/css/logintypedialog.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "28 /escm/js/usageGraphJS/jqplot.highlighter.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727282E12, 0.0]], "label": "69 /escm/js/jquery-1.5.2.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "43 /escm/js/usageGraphJS/jqplot.cursor.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "49 /escm/images/myAccount.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "19 /escm/js/jquery-validate/additional-methods.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "14 /escm/css/modern_ui/jquery.multiselect.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "35 /escm/js/jquery.elastic.source.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727282E12, 0.0]], "label": "72 /escm/js/validator.js", "isOverall": false}, {"isController": true, "data": [[1.49727288E12, 0.0], [1.49727282E12, 0.0], [1.49727276E12, 0.0], [1.4972727E12, 0.0]], "label": "Login Page Credentials and Dashboard Display", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727282E12, 0.0]], "label": "73 /escm/js/jquery.bpopup.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "48 /escm/css/modern_ui/images/myDashboard.png", "isOverall": false}, {"isController": true, "data": [[1.49727288E12, 0.0], [1.49727276E12, 0.0]], "label": "Order_Search", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "33 /escm/js/usageGraphJS/excanvas.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727276E12, 0.0]], "label": "5 /escm/login/doAuth?id=loginform", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "92 /escm/css/theme/images/ui-icons_blue_256x240.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "40 /escm/js/escm_alert.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "83 /escm/images/hourglass.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "90 /escm/images/next.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "81 /escm/images/recent.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "113 /escm/images/trash.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "24 /escm/js/datatable.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727282E12, 0.0]], "label": "70 /escm/js/jquery-ui-1.8.17.custom.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "17 /escm/js/jquery.tablesorter.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "12 /escm/css/payment/jquery.tzCheckbox.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "36 /escm/js/MonthPicker.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "27 /escm/js/usageGraphJS/jqplot.enhancedLegendRenderer.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "50 /escm/css/modern_ui/images/myCatalog.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727276E12, 0.0]], "label": "88 /escm/order/showOrderDetail", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727282E12, 0.0]], "label": "63 /escm/css/theme/jquery-ui-1.8.17.custom.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "107 /escm/css/theme/images/ui-icons_222222_256x240.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727276E12, 0.0]], "label": "109 /escm/order/searchOrder", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "96 /escm/images/slider-arrow-left.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "104 /escm/images/order-icon-installment.png", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0], [1.49727282E12, 0.0]], "label": "64 /escm/css/merchant.css", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "20 /escm/js/jquery-validate/jquery.validate.min.js", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.0]], "label": "86 /escm/images/bb_ajax_loader.gif", "isOverall": false}], "title": "Connect Time Over Time", "granularity": 60000, "maxY": 4.9E-324, "maxX": 1.49727288E12, "minX": 1.4972727E12, "minY": 0.0}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: "%H:%M:%S",
                    axisLabel: getConnectTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average Connect Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendConnectTimeOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average connect time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesConnectTimeOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotConnectTimeOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewConnectTimeOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Connect Time Over Time
function refreshConnectTimeOverTime(fixTimestamps) {
    var infos = connectTimeOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 19800000);
    }
    if(isGraph($("#flotConnectTimeOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesConnectTimeOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotConnectTimeOverTime", "#overviewConnectTimeOverTime");
        $('#footerConnectTimeOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var responseTimePercentilesOverTimeInfos = {
        data: {"result": {"supportsControllersDiscrimination": false, "series": [{"isController": false, "data": [[1.49727288E12, 2.0], [1.49727282E12, 4.0], [1.49727276E12, 7.0], [1.4972727E12, 37.0]], "label": "Min", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 16005.0], [1.49727282E12, 548.0], [1.49727276E12, 14694.0], [1.4972727E12, 579.0]], "label": "Max", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 4068.8499999999885], [1.49727282E12, 9444.499999999984], [1.49727276E12, 11958.8], [1.4972727E12, 579.0]], "label": "95th percentile", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 11948.559999999998], [1.49727282E12, 13711.759999999991], [1.49727276E12, 14416.59], [1.4972727E12, 579.0]], "label": "99th percentile", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 93.0], [1.49727282E12, 5947.799999999999], [1.49727276E12, 7176.800000000001], [1.4972727E12, 444.6000000000005]], "label": "90th percentile", "isOverall": false}], "title": "Response Time Percentiles Over Time (successful requests only)", "granularity": 60000, "maxY": 16005.0, "maxX": 1.49727288E12, "minX": 1.4972727E12, "minY": 2.0}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: "%H:%M:%S",
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Response Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentilesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Response time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentilesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimePercentilesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimePercentilesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Time Percentiles Over Time
function refreshResponseTimePercentilesOverTime(fixTimestamps) {
    var infos = responseTimePercentilesOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 19800000);
    }
    if(isGraph($("#flotResponseTimePercentilesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimePercentilesOverTime", "#overviewResponseTimePercentilesOverTime");
        $('#footerResponseTimePercentilesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var responseTimeVsRequestInfos = {
    data: {"result": {"supportsControllersDiscrimination": false, "series": [{"isController": false, "data": [[2032.0, 2.0], [168.0, 3.0]], "label": "Failures", "isOverall": false}, {"isController": false, "data": [[2032.0, 7.0], [168.0, 7.0], [228.0, 75.0], [12.0, 42.0]], "label": "Successes", "isOverall": false}], "title": "Response Time Vs Request", "granularity": 60000, "maxY": 75.0, "maxX": 2032.0, "minX": 12.0, "minY": 2.0}},
    getOptions: function() {
        return {
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Response Time (ms)",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: {
                noColumns: 2,
                show: true,
                container: '#legendResponseTimeVsRequest'
            },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median response time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesResponseTimeVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotResponseTimeVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewResponseTimeVsRequest"), dataset, prepareOverviewOptions(options));

    }
};

// Response Time vs Request
function refreshResponseTimeVsRequest() {
    var infos = responseTimeVsRequestInfos;
    prepareSeries(infos.data);
    if (isGraph($("#flotResponseTimeVsRequest"))){
        infos.create();
    }else{
        var choiceContainer = $("#choicesResponseTimeVsRequest");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimeVsRequest", "#overviewResponseTimeVsRequest");
        $('#footerResponseRimeVsRequest .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var latenciesVsRequestInfos = {
    data: {"result": {"supportsControllersDiscrimination": false, "series": [{"isController": false, "data": [[2032.0, 0.0], [168.0, 0.0]], "label": "Failures", "isOverall": false}, {"isController": false, "data": [[2032.0, 0.0], [168.0, 0.0], [228.0, 35.0], [12.0, 40.0]], "label": "Successes", "isOverall": false}], "title": "Latencies Vs Request", "granularity": 60000, "maxY": 40.0, "maxX": 2032.0, "minX": 12.0, "minY": 0.0}},
    getOptions: function() {
        return{
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Latency (ms)",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: { noColumns: 2,show: true, container: '#legendLatencyVsRequest' },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median response time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesLatencyVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotLatenciesVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewLatenciesVsRequest"), dataset, prepareOverviewOptions(options));
    }
};

// Latencies vs Request
function refreshLatenciesVsRequest() {
        var infos = latenciesVsRequestInfos;
        prepareSeries(infos.data);
        if(isGraph($("#flotLatenciesVsRequest"))){
            infos.createGraph();
        }else{
            var choiceContainer = $("#choicesLatencyVsRequest");
            createLegend(choiceContainer, infos);
            infos.createGraph();
            setGraphZoomable("#flotLatenciesVsRequest", "#overviewLatenciesVsRequest");
            $('#footerLatenciesVsRequest .legendColorBox > div').each(function(i){
                $(this).clone().prependTo(choiceContainer.find("li").eq(i));
            });
        }
};

var hitsPerSecondInfos = {
        data: {"result": {"supportsControllersDiscrimination": false, "series": [{"isController": false, "data": [[1.49727288E12, 33.86666666666667], [1.49727282E12, 2.8], [1.49727276E12, 3.8], [1.4972727E12, 0.2]], "label": "hitsPerSecond", "isOverall": false}], "title": "Hits Per Second", "granularity": 60000, "maxY": 33.86666666666667, "maxX": 1.49727288E12, "minX": 1.4972727E12, "minY": 0.2}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: "%H:%M:%S",
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of hits / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendHitsPerSecond"
                },
                selection: {
                    mode : 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y.2 hits/sec"
                }
            };
        },
        createGraph: function createGraph() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesHitsPerSecond"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotHitsPerSecond"), dataset, options);
            // setup overview
            $.plot($("#overviewHitsPerSecond"), dataset, prepareOverviewOptions(options));
        }
};

// Hits per second
function refreshHitsPerSecond(fixTimestamps) {
    var infos = hitsPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 19800000);
    }
    if (isGraph($("#flotHitsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesHitsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotHitsPerSecond", "#overviewHitsPerSecond");
        $('#footerHitsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var codesPerSecondInfos = {
        data: {"result": {"supportsControllersDiscrimination": false, "series": [{"isController": false, "data": [[1.49727288E12, 0.15], [1.49727282E12, 0.18333333333333332]], "label": "404", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 33.71666666666667], [1.49727282E12, 2.6166666666666667], [1.49727276E12, 3.8], [1.4972727E12, 0.2]], "label": "200", "isOverall": false}], "title": "Codes Per Second", "granularity": 60000, "maxY": 33.71666666666667, "maxX": 1.49727288E12, "minX": 1.4972727E12, "minY": 0.15}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: "%H:%M:%S",
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses/sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendCodesPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "Number of Response Codes %s at %x was %y.2 responses / sec"
                }
            };
        },
    createGraph: function() {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesCodesPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotCodesPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewCodesPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Codes per second
function refreshCodesPerSecond(fixTimestamps) {
    var infos = codesPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 19800000);
    }
    if(isGraph($("#flotCodesPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesCodesPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotCodesPerSecond", "#overviewCodesPerSecond");
        $('#footerCodesPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var transactionsPerSecondInfos = {
        data: {"result": {"supportsControllersDiscrimination": true, "series": [{"isController": false, "data": [[1.49727288E12, 0.15], [1.49727282E12, 0.18333333333333332]], "label": "64 /escm/css/merchant.css-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "32 /escm/js/usageGraphJS/jquery.jqplot.min.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "28 /escm/js/usageGraphJS/jqplot.highlighter.min.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "10 /escm/css/modern_ui/usageGraph/examples.css-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "87 /escm/images/ticket/order_ticket.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "89 /escm/images/previous.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "9 /escm/css/modern_ui/usageGraph/jquery.jqplot.min.css-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "31 /escm/js/usageGraphJS/jqplot.canvasTextRenderer.min.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "14 /escm/css/modern_ui/jquery.multiselect.css-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "94 /escm/images/warn.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "23 /escm/js/jquery-validate/jquery.metadata.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.15], [1.49727282E12, 0.18333333333333332]], "label": "70 /escm/js/jquery-ui-1.8.17.custom.min.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "101 /escm/images/order-icon-custom-fields.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "13 /escm/css/tablesorter.css-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "25 /escm/js/jquery.ba-dotimeout.min.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.15], [1.49727282E12, 0.18333333333333332]], "label": "71 /escm/js/jquery.alerts.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "83 /escm/images/hourglass.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "48 /escm/css/modern_ui/images/myDashboard.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "30 /escm/js/usageGraphJS/jqplot.canvasAxisLabelRenderer.min.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "22 /escm/js/slideBlock.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "102 /escm/images/order-icon-subscription.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "119 /escm/images/order-icon-stop-billing.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "24 /escm/js/datatable.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "108 /escm/images/BB-ajax-loader-round.gif-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "39 /escm/js/jquery.ui.timepicker.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.15], [1.49727282E12, 0.18333333333333332]], "label": "68 /escmnull/css/merchant.css-failure", "isOverall": false}, {"isController": true, "data": [[1.49727288E12, 0.3333333333333333], [1.49727276E12, 0.3333333333333333]], "label": "Order Selection-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "50 /escm/css/modern_ui/images/myCatalog.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "100 /escm/images/order-icon-adjust.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "11 /escm/css/modern_ui/usageGraph/jquery.jqplot.css-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "85 /escm/images/cancelicon.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "17 /escm/js/jquery.tablesorter.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "33 /escm/js/usageGraphJS/excanvas.min.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "104 /escm/images/order-icon-installment.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "21 /escm/js/clearinput.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.15], [1.49727282E12, 0.18333333333333332]], "label": "75 /escm/css/fonts/Roboto-Bold.woff-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "113 /escm/images/trash.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "12 /escm/css/payment/jquery.tzCheckbox.css-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333], [1.49727276E12, 0.3333333333333333]], "label": "109 /escm/order/searchOrder-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "106 /escm/images/order-icon-ticket.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.13333333333333333], [1.49727282E12, 0.2]], "label": "67 /escm/css/jquery.alerts.css-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "54 /escm/css/modern_ui/images/CP_login.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "107 /escm/css/theme/images/ui-icons_222222_256x240.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "44 /escm/js/jquery.scrollToTop.min.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333], [1.49727276E12, 0.3333333333333333]], "label": "88 /escm/order/showOrderDetail-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "81 /escm/images/recent.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333], [1.49727276E12, 0.3333333333333333]], "label": "5 /escm/login/doAuth?id=loginform-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "105 /escm/images/order-icon-quote.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "42 /escm/js/usageGraphJS/jqplot.pointLabels.min.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "29 /escm/js/usageGraphJS/jqplot.dateAxisRenderer.min.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.15], [1.49727282E12, 0.18333333333333332]], "label": "66 /escm/css/jquery.ui.timepicker.css-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "35 /escm/js/jquery.elastic.source.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "49 /escm/images/myAccount.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "82 /escm/images/orderstatusicon/provisioningfailed.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "90 /escm/images/next.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "96 /escm/images/slider-arrow-left.png-success", "isOverall": false}, {"isController": true, "data": [[1.49727288E12, 0.3333333333333333], [1.49727276E12, 0.3333333333333333]], "label": "Order_Search-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.15], [1.49727282E12, 0.18333333333333332]], "label": "74 /escm/css/fonts/Roboto-Light.woff-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "43 /escm/js/usageGraphJS/jqplot.cursor.min.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333], [1.49727276E12, 0.3333333333333333]], "label": "111 /escm/messages-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.15], [1.49727282E12, 0.18333333333333332]], "label": "69 /escm/js/jquery-1.5.2.min.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.13333333333333333], [1.49727282E12, 0.2]], "label": "63 /escm/css/theme/jquery-ui-1.8.17.custom.css-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "84 /escm/images/express_order.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.13333333333333333], [1.49727282E12, 0.2], [1.49727276E12, 0.13333333333333333], [1.4972727E12, 0.2]], "label": "62 /escm/login/auth-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "41 /escm/js/jquery.flexslider.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "37 /escm/js/jquery.slimscroll.min.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "36 /escm/js/MonthPicker.min.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "16 /escm/js/jquery.blockUI.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "114 /escm/images/icon20.gif-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.15], [1.49727282E12, 0.18333333333333332]], "label": "65 /escm/css/logintypedialog.css-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "51 /escm/images/orders.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "57 /escm/images/bubble.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333], [1.49727276E12, 0.3333333333333333]], "label": "112 /escm/recentItem-success", "isOverall": false}, {"isController": true, "data": [[1.49727288E12, 0.15], [1.49727282E12, 0.18333333333333332], [1.49727276E12, 0.16666666666666666], [1.4972727E12, 0.16666666666666666]], "label": "Login Page Credentials and Dashboard Display-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "91 /escm/images/view_mail.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "18 /escm/js/main.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333], [1.49727276E12, 0.3333333333333333]], "label": "77 /escm/order/index-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "58 /escm/css/theme/images/ui-icons_ededed_256x240.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "97 /escm/images/slider-arrow-right.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "20 /escm/js/jquery-validate/jquery.validate.min.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "120 /escm/images/order-icon-usage.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333], [1.49727276E12, 0.3333333333333333]], "label": "110 /escm/order/showOrderDetail-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "92 /escm/css/theme/images/ui-icons_blue_256x240.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "103 /escm/images/order-icon-provisioned.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "40 /escm/js/escm_alert.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "15 /escm/js/jquery.qtip-1.0.0-rc3.min.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "116 /escm/css/theme/images/ui-icons_bbbbbb_256x240.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "86 /escm/images/bb_ajax_loader.gif-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333], [1.49727276E12, 0.3333333333333333]], "label": "99 /escm/recentItem-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "93 /escm/images/summary_edit_pencil.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "38 /escm/js/jquery.leanModal.min.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "115 /escm/images/help.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333], [1.49727276E12, 0.3333333333333333]], "label": "117 /escm/messages-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "46 /escm/js/payment/jquery.tzCheckbox.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "79 /escm/images/icon14.gif-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.15], [1.49727282E12, 0.18333333333333332]], "label": "76 /escm/css/fonts/Roboto-Regular.ttf-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.15], [1.49727282E12, 0.18333333333333332]], "label": "73 /escm/js/jquery.bpopup.min.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333], [1.49727276E12, 0.3333333333333333]], "label": "98 /escm/messages-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "27 /escm/js/usageGraphJS/jqplot.enhancedLegendRenderer.min.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "47 /escm/js/panels.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "53 /escm/images/settings.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.15], [1.49727282E12, 0.18333333333333332]], "label": "72 /escm/js/validator.js-success", "isOverall": false}, {"isController": true, "data": [[1.49727288E12, 0.13333333333333333], [1.49727282E12, 0.2], [1.49727276E12, 0.13333333333333333], [1.4972727E12, 0.2]], "label": "Login Page Request-failure", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "55 /escm/css/modern_ui/images/dropDown.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333], [1.49727276E12, 0.3333333333333333]], "label": "118 /escm/recentItem-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "26 /escm/js/usageGraphJS/jqplot.canvasAxisTickRenderer.min.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "34 /escm/js/placeholders.min.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "52 /escm/images/ticket/39x39ticket.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "19 /escm/js/jquery-validate/additional-methods.min.js-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "80 /escm/images/loading.gif-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "59 /escm/css/theme/images/ui-icons_ffffff_256x240.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "95 /escm/images/order-icon-email.png-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "56 /escm/images/_loading.gif-success", "isOverall": false}, {"isController": false, "data": [[1.49727288E12, 0.3333333333333333]], "label": "45 /escm/js/payment/jquery.dataTables.js-success", "isOverall": false}], "title": "Transactions Per Second", "granularity": 60000, "maxY": 0.3333333333333333, "maxX": 1.49727288E12, "minX": 1.4972727E12, "minY": 0.13333333333333333}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: "%H:%M:%S",
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of transactions / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendTransactionsPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y transactions / sec"
                }
            };
        },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesTransactionsPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotTransactionsPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewTransactionsPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Transactions per second
function refreshTransactionsPerSecond(fixTimestamps) {
    var infos = transactionsPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, 19800000);
    }
    if(isGraph($("#flotTransactionsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTransactionsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTransactionsPerSecond", "#overviewTransactionsPerSecond");
        $('#footerTransactionsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

// Collapse the graph matching the specified DOM element depending the collapsed
// status
function collapse(elem, collapsed){
    if(collapsed){
        $(elem).parent().find(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
    } else {
        $(elem).parent().find(".fa-chevron-down").removeClass("fa-chevron-down").addClass("fa-chevron-up");
        if (elem.id == "bodyBytesThroughputOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshBytesThroughputOverTime(true);
            }
            document.location.href="#bytesThroughputOverTime";
        } else if (elem.id == "bodyLatenciesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesOverTime(true);
            }
            document.location.href="#latenciesOverTime";
        } else if (elem.id == "bodyConnectTimeOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshConnectTimeOverTime(true);
            }
            document.location.href="#connectTimeOverTime";
        } else if (elem.id == "bodyResponseTimePercentilesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimePercentilesOverTime(true);
            }
            document.location.href="#responseTimePercentilesOverTime";
        } else if (elem.id == "bodyResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeDistribution();
            }
            document.location.href="#responseTimeDistribution" ;
        } else if (elem.id == "bodySyntheticResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshSyntheticResponseTimeDistribution();
            }
            document.location.href="#syntheticResponseTimeDistribution" ;
        } else if (elem.id == "bodyActiveThreadsOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshActiveThreadsOverTime(true);
            }
            document.location.href="#activeThreadsOverTime";
        } else if (elem.id == "bodyTimeVsThreads") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTimeVsThreads();
            }
            document.location.href="#timeVsThreads" ;
        } else if (elem.id == "bodyCodesPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshCodesPerSecond(true);
            }
            document.location.href="#codesPerSecond";
        } else if (elem.id == "bodyTransactionsPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTransactionsPerSecond(true);
            }
            document.location.href="#transactionsPerSecond";
        } else if (elem.id == "bodyResponseTimeVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeVsRequest();
            }
            document.location.href="#responseTimeVsRequest";
        } else if (elem.id == "bodyLatenciesVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesVsRequest();
            }
            document.location.href="#latencyVsRequest";
        }
    }
}

// Collapse
$(function() {
        $('.collapse').on('shown.bs.collapse', function(){
            collapse(this, false);
        }).on('hidden.bs.collapse', function(){
            collapse(this, true);
        });
});

$(function() {
    $(".glyphicon").mousedown( function(event){
        var tmp = $('.in:not(ul)');
        tmp.parent().parent().parent().find(".fa-chevron-up").removeClass("fa-chevron-down").addClass("fa-chevron-down");
        tmp.removeClass("in");
        tmp.addClass("out");
    });
});

/*
 * Activates or deactivates all series of the specified graph (represented by id parameter)
 * depending on checked argument.
 */
function toggleAll(id, checked){
    var placeholder = document.getElementById(id);

    var cases = $(placeholder).find(':checkbox');
    cases.prop('checked', checked);
    $(cases).parent().children().children().toggleClass("legend-disabled", !checked);

    var choiceContainer;
    if ( id == "choicesBytesThroughputOverTime"){
        choiceContainer = $("#choicesBytesThroughputOverTime");
        refreshBytesThroughputOverTime(false);
    } else if(id == "choicesResponseTimesOverTime"){
        choiceContainer = $("#choicesResponseTimesOverTime");
        refreshResponseTimeOverTime(false);
    } else if ( id == "choicesLatenciesOverTime"){
        choiceContainer = $("#choicesLatenciesOverTime");
        refreshLatenciesOverTime(false);
    } else if ( id == "choicesConnectTimeOverTime"){
        choiceContainer = $("#choicesConnectTimeOverTime");
        refreshConnectTimeOverTime(false);
    } else if ( id == "responseTimePercentilesOverTime"){
        choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        refreshResponseTimePercentilesOverTime(false);
    } else if ( id == "choicesResponseTimePercentiles"){
        choiceContainer = $("#choicesResponseTimePercentiles");
        refreshResponseTimePercentiles();
    } else if(id == "choicesActiveThreadsOverTime"){
        choiceContainer = $("#choicesActiveThreadsOverTime");
        refreshActiveThreadsOverTime(false);
    } else if ( id == "choicesTimeVsThreads"){
        choiceContainer = $("#choicesTimeVsThreads");
        refreshTimeVsThreads();
    } else if ( id == "choicesSyntheticResponseTimeDistribution"){
        choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        refreshSyntheticResponseTimeDistribution();
    } else if ( id == "choicesResponseTimeDistribution"){
        choiceContainer = $("#choicesResponseTimeDistribution");
        refreshResponseTimeDistribution();
    } else if ( id == "choicesHitsPerSecond"){
        choiceContainer = $("#choicesHitsPerSecond");
        refreshHitsPerSecond(false);
    } else if(id == "choicesCodesPerSecond"){
        choiceContainer = $("#choicesCodesPerSecond");
        refreshCodesPerSecond(false);
    } else if ( id == "choicesTransactionsPerSecond"){
        choiceContainer = $("#choicesTransactionsPerSecond");
        refreshTransactionsPerSecond(false);
    } else if ( id == "choicesResponseTimeVsRequest"){
        choiceContainer = $("#choicesResponseTimeVsRequest");
        refreshResponseTimeVsRequest();
    } else if ( id == "choicesLatencyVsRequest"){
        choiceContainer = $("#choicesLatencyVsRequest");
        refreshLatenciesVsRequest();
    }
    var color = checked ? "black" : "#818181";
    choiceContainer.find("label").each(function(){
        this.style.color = color;
    });
}

// Unchecks all boxes for "Hide all samples" functionality
function uncheckAll(id){
    toggleAll(id, false);
}

// Checks all boxes for "Show all samples" functionality
function checkAll(id){
    toggleAll(id, true);
}

// Prepares data to be consumed by plot plugins
function prepareData(series, choiceContainer, customizeSeries){
    var datasets = [];

    // Add only selected series to the data set
    choiceContainer.find("input:checked").each(function (index, item) {
        var key = $(item).attr("name");
        var i = 0;
        var size = series.length;
        while(i < size && series[i].label != key)
            i++;
        if(i < size){
            var currentSeries = series[i];
            datasets.push(currentSeries);
            if(customizeSeries)
                customizeSeries(currentSeries);
        }
    });
    return datasets;
}

/*
 * Ignore case comparator
 */
function sortAlphaCaseless(a,b){
    return a.toLowerCase() > b.toLowerCase() ? 1 : -1;
};

/*
 * Creates a legend in the specified element with graph information
 */
function createLegend(choiceContainer, infos) {
    // Sort series by name
    var keys = [];
    $.each(infos.data.result.series, function(index, series){
        keys.push(series.label);
    });
    keys.sort(sortAlphaCaseless);

    // Create list of series with support of activation/deactivation
    $.each(keys, function(index, key) {
        var id = choiceContainer.attr('id') + index;
        $('<li />')
            .append($('<input id="' + id + '" name="' + key + '" type="checkbox" checked="checked" hidden />'))
            .append($('<label />', { 'text': key , 'for': id }))
            .appendTo(choiceContainer);
    });
    choiceContainer.find("label").click( function(){
        if (this.style.color !== "rgb(129, 129, 129)" ){
            this.style.color="#818181";
        }else {
            this.style.color="black";
        }
        $(this).parent().children().children().toggleClass("legend-disabled");
    });
    choiceContainer.find("label").mousedown( function(event){
        event.preventDefault();
    });
    choiceContainer.find("label").mouseenter(function(){
        this.style.cursor="pointer";
    });

    // Recreate graphe on series activation toggle
    choiceContainer.find("input").click(function(){
        infos.createGraph();
    });
}