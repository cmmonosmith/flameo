function buildChart(title, dates, totals, actuals) {
    var totalData = [];
    var actualData = [];
    var targetData = [];
    var baseData = [];
    var behindData = [];
    var aheadData = [];
    var tickPositions = [];
    var tickLabelsStr = '{';

    var i;
    var x;
    var targetVal;
    var total;
    var actual; 
    var target;  
    var base;
    var behind;
    var ahead;
    for (i = 0; i < dates.length; i++) {
        var lastx;
        var lastTargetVal;
        var lastBase;
        var lastBehind;
        var lastAhead;
        if (i > 0) {
            lastx = x;
            lastTargetVal = targetVal;
            lastBase = base;
            lastBehind = behind;
            lastAhead = ahead;
        }
        
        x = 10000 * (i / (dates.length - 1));
        targetVal = totals[i] * ((dates.length - 1 - i) / (dates.length - 1));
        if (!isNaN(totals[i])) {
            total = {
                name: dates[i],
                x: x,
                y: totals[i]
            };
            actual = {
                name: dates[i],
                x: x,
                y: actuals[i]
            };
            target = {
                name: dates[i],
                x: x,
                y: targetVal
            };
            base = [x, actuals[i] < targetVal ? actuals[i] : targetVal];
            behind = [x, actuals[i] > targetVal ? actuals[i] - targetVal : 0];
            ahead = [x, actuals[i] < targetVal ? targetVal - actuals[i] : 0];
        } else {
            if (i == dates.length - 1) {
                targetData.push({
                    name: dates[i],
                    x: x,
                    y: 0
                });
            }
        }
        
        // mid point calculations
        if (i > 0 && !isNaN(actuals[i])) {
            if ((actuals[i] > targetVal && actuals[i - 1] < lastTargetVal)
                    || (actuals[i] < targetVal && actuals[i - 1] > lastTargetVal)) {
                var tm = (targetVal - lastTargetVal) / (x - lastx);
                var tb = lastTargetVal;
                var am = (actuals[i] - actuals[i - 1]) / (x - lastx);
                var ab = actuals[i - 1];
                var ix = lastx + ((ab - tb) / (tm - am));
                var iy = (tm * (ix - lastx)) + tb;
                var intersectionBase = [ix, iy];
                var intersectionBehind = [ix, 0];
                var intersectionAhead = [ix, 0];
                baseData.push(intersectionBase);
                behindData.push(intersectionBehind);
                aheadData.push(intersectionAhead);
            }
        }
        
        if (!isNaN(totals[i])) {
            totalData.push(total);
            actualData.push(actual);
            targetData.push(target);
            baseData.push(base);
            behindData.push(behind);
            aheadData.push(ahead);
        }
        tickPositions.push(x);
        tickLabelsStr += '"' + x + '": "' + dates[i] + '"' + (i < dates.length - 1 ? ',' : '');
    }
    tickLabelsStr += '}';
    var tickLabels = JSON.parse(tickLabelsStr);

    var chart = {
        chart: {
            //height: 500
        },
        title: {
            text: title
        },
        xAxis: [{
            tickPositions: tickPositions,
            labels: {
                formatter: function() {
                    return tickLabels[this.value];
                }
            }
        }],
        yAxis: [{
            //?
        }],
        plotOptions: {
            area: {
                stacking: 'normal',
                fillOpacity: 1.0
            },
            series: {
                events: {
                    legendItemClick: function(event) {
                        return false;
                    }
                }
            }
        },
        series: [{
            type: 'area',
            stack: 'yep',
            name: 'Ahead',
            data: aheadData,
            color: '#00cc00',
            enableMouseTracking: false,
            marker: {
                enabled: false
            }
        }, {
            type: 'area',
            stack: 'yep',
            name: 'Behind',
            data: behindData,
            color: '#cc0000',
            enableMouseTracking: false,
            marker: {
                enabled: false
            }
        }, {
            type: 'area',
            stack: 'yep',
            name: 'Base',
            data: baseData,
            color: '#ffffff',
            enableMouseTracking: false,
            marker: {
                enabled: false
            },
            fillOpacity: 0.0,
            showInLegend: false
        }, {
            type: 'line',
            name: 'Total',
            data: totalData,
            color: '#000000'
        }, {
            type: 'line',
            name: 'Actual',
            data: actualData,
            color: '#000000'
        }, {
            type: 'line',
            name: 'Target',
            data: targetData,
            color: '#000000'
        }]
    };

   $('#chart').highcharts(chart);
}

jQuery(function() {
    //buildChart();
});