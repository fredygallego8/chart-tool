function StackedColumnChart(node, obj) {

  var axisModule = require("../components/axis"),
      scaleModule = require("../components/scale"),
      Axis = axisModule.axisManager,
      Scale = scaleModule.scaleManager;

  //  scales
  var xScaleObj = new Scale(obj, "xAxis"),
      yScaleObj = new Scale(obj, "yAxis"),
      xScale = xScaleObj.scale, yScale = yScaleObj.scale;

  //  axes
  var yAxisObj = new Axis(node, obj, yScaleObj.scale, "yAxis"),
      xAxisObj = new Axis(node, obj, xScaleObj.scale, "xAxis"),
      yAxis = yAxisObj.axis, xAxis = xAxisObj.axis;

  axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);

  var timeScale = (obj.xAxis.scale === "time") ? true : false;

  if (timeScale) {

    var timeInterval = require("../../utils/utils").timeInterval,
        timeElapsed = timeInterval(obj.data.data);
    var singleColumn = obj.dimensions.tickWidth() / timeElapsed;

    xAxisObj.range = [0, (obj.dimensions.tickWidth() - singleColumn)];

    axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);

  } else {
    var singleColumn = xScale.rangeBand();
  }

  var seriesGroup = node.append("g")
    .attr("class", function() {
      var output = obj.prefix + "series_group";
      if (obj.data.seriesAmount > 1) {
        // If more than one series append a 'muliple' class so we can target
        output += " " + obj.prefix + "multiple";
      }
      return output;
    })
    .attr("transform", function() {
      return "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth()) + ",0)";
    })

  // Add a group for each cause.
  var series = seriesGroup.selectAll("g." + obj.prefix + "series")
    .data(obj.data.stackedData)
    .enter().append("g")
    .attr("class", function(d, i) { return obj.prefix + "series " + obj.prefix + "series_" + (i); });

  // Add a rect for each data point.
  var rect = series.selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
    .attr({
      "class": obj.prefix + "column",
      "data-key": function(d) { return d.x; },
      "x": function(d) { return xScale(d.x); },
      "y": function(d) { return yScale(Math.max(0, d.y0 + d.y)); },
      "height": function(d) { return Math.abs(yScale(d.y) - yScale(0)); },
      "width": singleColumn
    });

  axisModule.addZeroLine(obj, node, yAxisObj, "yAxis");

  return {
    xScaleObj: xScaleObj,
    yScaleObj: yScaleObj,
    xAxisObj: xAxisObj,
    yAxisObj: yAxisObj,
    seriesGroup: seriesGroup,
    series: series,
    rect: rect
  };

}

function OrdinalTimeStackedColumnChart(node, obj) {

  var axisModule = require("../components/axis"),
      scaleModule = require("../components/scale"),
      Axis = axisModule.axisManager,
      Scale = scaleModule.scaleManager;

  //  scales
  var xScaleObj = new Scale(obj, "xAxis"),
      yScaleObj = new Scale(obj, "yAxis"),
      xScale = xScaleObj.scale, yScale = yScaleObj.scale;

  //  axes
  var yAxisObj = new Axis(node, obj, yScaleObj.scale, "yAxis"),
      xAxisObj = new Axis(node, obj, xScaleObj.scale, "xAxis"),
      yAxis = yAxisObj.axis, xAxis = xAxisObj.axis;

  axisModule.axisCleanup(node, obj, xAxisObj, yAxisObj);

  var singleColumn = xScale(obj.data.data[1].key) - xScale(obj.data.data[0].key);

  node.select("." + obj.prefix + "axis-group." + obj.prefix + "xAxis")
    .attr("transform", "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth() - (singleColumn / 2)) + "," + (obj.dimensions.computedHeight() - obj.dimensions.xAxisHeight) + ")");

  var seriesGroup = node.append("g")
    .attr("class", function() {
      var output = obj.prefix + "series_group";
      if (obj.data.seriesAmount > 1) {
        // If more than one series append a 'muliple' class so we can target
        output += " " + obj.prefix + "multiple";
      }
      return output;
    })
    .attr("transform", function() {
      return "translate(" + (obj.dimensions.computedWidth() - obj.dimensions.tickWidth() - (singleColumn / 2)) + ",0)";
    })

  // Add a group for each cause.
  var series = seriesGroup.selectAll("g." + obj.prefix + "series")
    .data(obj.data.stackedData)
    .enter().append("g")
    .attr("class", function(d, i) { return obj.prefix + "series " + obj.prefix + "series_" + (i); });

  // Add a rect for each data point.
  var rect = series.selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
    .attr({
      "class": obj.prefix + "column",
      "data-key": function(d) { return d.x; },
      "x": function(d) { return xScale(d.x); },
      "y": function(d) { return yScale(Math.max(0, d.y0 + d.y)); },
      "height": function(d) { return Math.abs(yScale(d.y) - yScale(0)); },
      "width": singleColumn
    });

  axisModule.addZeroLine(obj, node, yAxisObj, "yAxis");

  return {
    xScaleObj: xScaleObj,
    yScaleObj: yScaleObj,
    xAxisObj: xAxisObj,
    yAxisObj: yAxisObj,
    seriesGroup: seriesGroup,
    singleColumn: singleColumn,
    series: series,
    rect: rect
  };

}

module.exports = {
  StackedColumnChart: StackedColumnChart,
  OrdinalTimeStackedColumnChart: OrdinalTimeStackedColumnChart
};
