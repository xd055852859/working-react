import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4plugins_timeline from '@amcharts/amcharts4/plugins/timeline';
import * as am4plugins_bullets from '@amcharts/amcharts4/plugins/bullets';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_kelly from '@amcharts/amcharts4/themes/kelly';
// zh_Hans
import am4lang_zh_Hans from '@amcharts/amcharts4/lang/zh_Hans';
import moment from 'moment';
am4core.useTheme(am4themes_kelly);
am4core.useTheme(am4themes_animated);
const amChart = {
  createTimeLineChart(nodeName, data) {
    let chart = am4core.create(nodeName, am4plugins_timeline.SerpentineChart);
    chart.curveContainer.padding(100, 20, 50, 20);
    chart.levelCount = 3;
    chart.yAxisRadius = am4core.percent(20);
    chart.yAxisInnerRadius = am4core.percent(2);
    chart.maskBullets = false;
    // let colorSet = new am4core.ColorSet();

    chart.dateFormatter.inputDateFormat = 'yyyy-MM-dd HH:mm';
    chart.dateFormatter.dateFormat = 'HH';

    chart.data = data;
    chart.fontSize = 14;
    chart.tooltipContainer.fontSize = 14;

    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'category';
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.labels.template.paddingRight = 25;
    categoryAxis.renderer.minGridDistance = 10;

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 70;
    dateAxis.baseInterval = { count: 30, timeUnit: 'minute' };
    dateAxis.renderer.tooltipLocation = 0;
    dateAxis.renderer.line.strokeDasharray = '1,4';
    dateAxis.renderer.line.strokeOpacity = 0.5;
    dateAxis.tooltip.background.fillOpacity = 0.2;
    dateAxis.tooltip.background.cornerRadius = 5;
    dateAxis.tooltip.label.fill = new am4core.InterfaceColorSet().getFor(
      'alternativeBackground'
    );
    dateAxis.tooltip.label.paddingTop = 7;
    dateAxis.endLocation = 0;
    dateAxis.startLocation = -0.5;

    let labelTemplate = dateAxis.renderer.labels.template;
    labelTemplate.verticalCenter = 'middle';
    labelTemplate.fillOpacity = 0.4;
    labelTemplate.background.fill = new am4core.InterfaceColorSet().getFor(
      'background'
    );
    labelTemplate.background.fillOpacity = 1;
    labelTemplate.padding(7, 7, 7, 7);

    let series = chart.series.push(new am4plugins_timeline.CurveColumnSeries());
    series.columns.template.height = am4core.percent(15);

    series.dataFields.openDateX = 'start';
    series.dataFields.dateX = 'end';
    series.dataFields.categoryY = 'category';
    series.baseAxis = categoryAxis;
    series.columns.template.propertyFields.fill = 'color'; // get color from data
    series.columns.template.propertyFields.stroke = 'color';
    series.columns.template.strokeOpacity = 0;
    series.columns.template.fillOpacity = 0.6;

    let imageBullet1 = series.bullets.push(new am4plugins_bullets.PinBullet());
    imageBullet1.locationX = 1;
    imageBullet1.propertyFields.stroke = 'color';
    imageBullet1.background.propertyFields.fill = 'color';
    imageBullet1.image = new am4core.Image();
    imageBullet1.image.propertyFields.href = 'icon';
    imageBullet1.image.scale = 0.5;
    imageBullet1.circle.radius = am4core.percent(100);
    imageBullet1.dy = -5;

    let textBullet = series.bullets.push(new am4charts.LabelBullet());
    textBullet.label.propertyFields.text = 'text';
    textBullet.disabled = true;
    textBullet.propertyFields.disabled = 'textDisabled';
    textBullet.label.strokeOpacity = 0;
    textBullet.locationX = 1;
    textBullet.dy = -100;
    textBullet.label.textAlign = 'middle';

    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.align = 'center';
    chart.scrollbarX.width = am4core.percent(75);
    chart.scrollbarX.opacity = 0.5;

    let cursor = new am4plugins_timeline.CurveCursor();
    chart.cursor = cursor;
    cursor.xAxis = dateAxis;
    cursor.yAxis = categoryAxis;
    cursor.lineY.disabled = true;
    cursor.lineX.strokeDasharray = '1,4';
    cursor.lineX.strokeOpacity = 1;

    dateAxis.renderer.tooltipLocation2 = 0;
    categoryAxis.cursorTooltipEnabled = false;

    let label = chart.createChild(am4core.Label);
    label.text = '任务列表';
    label.isMeasured = false;
    label.y = am4core.percent(40);
    label.x = am4core.percent(50);
    label.horizontalCenter = 'middle';
    label.fontSize = 14;
    return chart;
  },
  createChordDiagramChart(nodeName, data, fontColor) {
    let chart = am4core.create(nodeName, am4charts.ChordDiagram);
    // colors of main characters
    chart.colors.saturation = 0.45;
    chart.colors.step = 3;
    let colors = {
      Rachel: chart.colors.next(),
      Monica: chart.colors.next(),
      Phoebe: chart.colors.next(),
      Ross: chart.colors.next(),
      Joey: chart.colors.next(),
      Chandler: chart.colors.next(),
    };

    // data was provided by: https://www.reddit.com/user/notrudedude
    chart.data = data;
    chart.dataFields.fromName = 'from';
    chart.dataFields.toName = 'to';
    chart.dataFields.value = 'value';

    chart.nodePadding = 0.5;
    chart.minNodeSize = 0.01;
    chart.startAngle = 80;
    chart.endAngle = chart.startAngle + 360;
    chart.sortBy = 'value';
    chart.fontSize = 14;
    let nodeTemplate = chart.nodes.template;
    nodeTemplate.readerTitle = '显示/隐藏或重新排列';
    nodeTemplate.showSystemTooltip = true;
    nodeTemplate.propertyFields.fill = 'color';
    nodeTemplate.tooltipText = '{name}的被指派: {total}';

    // when rolled over the node, make all the links rolled-over
    nodeTemplate.events.on('over', function (event) {
      let node = event.target;
      node.outgoingDataItems.each(function (dataItem) {
        if (dataItem.toNode) {
          dataItem.link.isHover = true;
          dataItem.toNode.label.isHover = true;
        }
      });
      node.incomingDataItems.each(function (dataItem) {
        if (dataItem.fromNode) {
          dataItem.link.isHover = true;
          dataItem.fromNode.label.isHover = true;
        }
      });

      node.label.isHover = true;
    });

    // when rolled out from the node, make all the links rolled-out
    nodeTemplate.events.on('out', function (event) {
      let node = event.target;
      node.outgoingDataItems.each(function (dataItem) {
        if (dataItem.toNode) {
          dataItem.link.isHover = false;
          dataItem.toNode.label.isHover = false;
        }
      });
      node.incomingDataItems.each(function (dataItem) {
        if (dataItem.fromNode) {
          dataItem.link.isHover = false;
          dataItem.fromNode.label.isHover = false;
        }
      });

      node.label.isHover = false;
    });

    let label = nodeTemplate.label;
    label.relativeRotation = 90;
    label.fill = fontColor;
    // label.fillOpacity = 0.4;
    let labelHS = label.states.create('hover');
    labelHS.properties.fillOpacity = 1;

    nodeTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    // this adapter makes non-main character nodes to be filled with color of the main character which he/she kissed most
    nodeTemplate.adapter.add('fill', function (fill, target) {
      let node = target;
      let counters = {};
      let mainChar = false;
      node.incomingDataItems.each(function (dataItem) {
        if (colors[dataItem.toName]) {
          mainChar = true;
        }

        if (isNaN(counters[dataItem.fromName])) {
          counters[dataItem.fromName] = dataItem.value;
        } else {
          counters[dataItem.fromName] += dataItem.value;
        }
      });
      if (mainChar) {
        return fill;
      }

      let count = 0;
      let color;
      let biggest = 0;
      let biggestName;

      for (var name in counters) {
        if (counters[name] > biggest) {
          biggestName = name;
          biggest = counters[name];
        }
      }
      if (colors[biggestName]) {
        fill = colors[biggestName];
      }

      return fill;
    });

    // link template
    let linkTemplate = chart.links.template;
    linkTemplate.strokeOpacity = 0;
    linkTemplate.fillOpacity = 0.15;
    linkTemplate.tooltipText = '{fromName} 指派 {toName} 任务数 :{value.value}';

    let hoverState = linkTemplate.states.create('hover');
    hoverState.properties.fillOpacity = 0.7;
    hoverState.properties.strokeOpacity = 0.7;

    // data credit label
    let creditLabel = chart.chartContainer.createChild(am4core.TextLink);
    // creditLabel.text = 'Data source: notrudedude';
    // creditLabel.url = 'https://www.reddit.com/user/notrudedude';
    creditLabel.y = am4core.percent(99);
    creditLabel.x = am4core.percent(99);
    creditLabel.horizontalCenter = 'right';
    creditLabel.verticalCenter = 'bottom';

    // let titleImage = chart.chartContainer.createChild(am4core.Image);
    // // titleImage.href =
    // //   '//www.amcharts.com/wp-content/uploads/2018/11/whokissed.png';
    // titleImage.x = 30;
    // titleImage.y = 30;
    // titleImage.width = 200;
    // titleImage.height = 200;
    return chart;
  },
  createXYChart(nodeName, data) {
    let chart = am4core.create(nodeName, am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.paddingRight = 20;

    chart.data = data;
    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'name';
    categoryAxis.renderer.labels.title = -20;
    categoryAxis.renderer.grid.template.strokeOpacity = 0;
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.renderer.labels.template.dx = -20;

    categoryAxis.renderer.minWidth = 40;
    categoryAxis.renderer.tooltip.dx = -20;

    let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inside = true;
    valueAxis.renderer.labels.template.fillOpacity = 0.3;
    valueAxis.renderer.grid.template.strokeOpacity = 0;
    valueAxis.min = 0;
    valueAxis.cursorTooltipEnabled = false;
    valueAxis.renderer.baseGrid.strokeOpacity = 0;
    valueAxis.renderer.labels.template.dy = 20;

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = 'steps';
    series.dataFields.categoryY = 'name';
    // series.dataFields.categoryY.fill = '#fff';
    series.tooltipText = '{valueX.value}';
    series.tooltip.pointerOrientation = 'vertical';
    series.tooltip.dy = -30;
    series.columnsContainer.zIndex = 100;

    let columnTemplate = series.columns.template;
    columnTemplate.height = am4core.percent(20);
    columnTemplate.maxHeight = 20;
    columnTemplate.column.cornerRadius(15, 10, 15, 10);
    columnTemplate.strokeOpacity = 0;

    series.heatRules.push({
      target: columnTemplate,
      property: 'fill',
      dataField: 'valueX',
      min: am4core.color('#e5dc36'),
      max: am4core.color('#5faa46'),
    });
    series.mainContainer.mask = undefined;

    let cursor = new am4charts.XYCursor();
    chart.cursor = cursor;
    cursor.lineX.disabled = true;
    cursor.lineY.disabled = true;
    cursor.behavior = 'none';

    let bullet = columnTemplate.createChild(am4charts.CircleBullet);
    bullet.circle.radius = 15;
    bullet.valign = 'middle';
    bullet.align = 'left';
    bullet.isMeasured = true;
    bullet.interactionsEnabled = false;
    bullet.horizontalCenter = 'right';
    bullet.interactionsEnabled = false;

    let hoverState = bullet.states.create('hover');
    let outlineCircle = bullet.createChild(am4core.Circle);
    outlineCircle.adapter.add('radius', function (radius, target) {
      let circleBullet = target.parent;
      return circleBullet.circle.pixelRadius + 10;
    });

    let image = bullet.createChild(am4core.Image);
    image.width = 30;
    image.height = 30;
    image.horizontalCenter = 'middle';
    image.verticalCenter = 'middle';
    image.propertyFields.href = 'href';

    image.adapter.add('mask', function (mask, target) {
      let circleBullet = target.parent;
      return circleBullet.circle;
    });

    let previousBullet;
    chart.cursor.events.on('cursorpositionchanged', function (event) {
      let dataItem = series.tooltipDataItem;

      if (dataItem.column) {
        let bullet = dataItem.column.children.getIndex(1);

        if (previousBullet && previousBullet !== bullet) {
          previousBullet.isHover = false;
        }

        if (previousBullet !== bullet) {
          let hs = bullet.states.getKey('hover');
          hs.properties.dx = dataItem.column.pixelWidth;
          bullet.isHover = true;

          previousBullet = bullet;
        }
      }
    });
    return chart;
  },
  createHeatChart(nodeName, data) {
    let chart = am4core.create(nodeName, am4charts.XYChart);
    chart.language.locale = am4lang_zh_Hans;
    chart.maskBullets = false;

    let xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    let yAxis = chart.yAxes.push(new am4charts.CategoryAxis());

    xAxis.dataFields.category = 'weekday';
    yAxis.dataFields.category = 'hour';

    xAxis.renderer.grid.template.disabled = true;
    xAxis.renderer.minGridDistance = 40;

    yAxis.renderer.grid.template.disabled = true;
    yAxis.renderer.inversed = true;
    yAxis.renderer.minGridDistance = 30;

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryX = 'weekday';
    series.dataFields.categoryY = 'hour';
    series.dataFields.value = 'value';
    series.sequencedInterpolation = true;
    series.defaultState.transitionDuration = 3000;

    let bgColor = new am4core.InterfaceColorSet().getFor('background');

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 1;
    columnTemplate.strokeOpacity = 0.2;
    columnTemplate.stroke = bgColor;
    columnTemplate.tooltipText = '{weekday}, {hour}: {value}';
    columnTemplate.width = am4core.percent(100);
    columnTemplate.height = am4core.percent(100);

    series.heatRules.push({
      target: columnTemplate,
      property: 'fill',
      min: am4core.color(bgColor),
      max: chart.colors.getIndex(0),
    });

    // heat legend
    // let heatLegend = chart.bottomAxesContainer.createChild(
    //   am4charts.HeatLegend
    // );
    // heatLegend.width = am4core.percent(100);
    // heatLegend.series = series;
    // heatLegend.valueAxis.renderer.labels.template.fontSize = 9;
    // heatLegend.valueAxis.renderer.minGridDistance = 30;

    // heat legend behavior
    // series.columns.template.events.on('over', function(event) {
    //   handleHover(event.target);
    // });

    // series.columns.template.events.on('hit', function(event) {
    //   handleHover(event.target);
    // });

    // function handleHover(column) {
    //   if (!isNaN(column.dataItem.value)) {
    //     heatLegend.valueAxis.showTooltipAt(column.dataItem.value);
    //   } else {
    //     heatLegend.valueAxis.hideTooltip();
    //   }
    // }

    // series.columns.template.events.on('out', function(event) {
    //   heatLegend.valueAxis.hideTooltip();
    // });

    chart.data = data;
    return chart;
  },
  createLineChart(nodeName, data) {
    let chart = am4core.create(nodeName, am4charts.XYChart);
    // chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect

    // chart.data = data;

    // let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    // categoryAxis.renderer.grid.template.location = 0;
    // categoryAxis.dataFields.category = 'country';
    // categoryAxis.renderer.minGridDistance = 40;

    // let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // let series = chart.series.push(new am4charts.CurvedColumnSeries());
    // series.dataFields.categoryX = 'country';
    // series.dataFields.valueY = 'value';
    // series.tooltipText = '{valueY.value}';
    // series.columns.template.strokeOpacity = 0;
    // series.columns.template.tension = 1;

    // series.columns.template.fillOpacity = 0.75;

    // let hoverState = series.columns.template.states.create('hover');
    // hoverState.properties.fillOpacity = 1;
    // hoverState.properties.tension = 0.8;

    // chart.cursor = new am4charts.XYCursor();

    // // Add distinctive colors for each column using adapter
    // series.columns.template.adapter.add('fill', function(fill, target) {
    //   return chart.colors.getIndex(target.dataItem.index);
    // });

    // chart.scrollbarX = new am4core.Scrollbar();
    // chart.scrollbarY = new am4core.Scrollbar();

    // Add data
    chart.data = data;

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = 'country';
    categoryAxis.renderer.minGridDistance = 40;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.categoryX = 'country';
    series.dataFields.valueY = 'value';
    series.strokeWidth = 3;
    series.fillOpacity = 0.5;

    // Add vertical scrollbar
    // chart.scrollbarY = new am4core.Scrollbar();
    // chart.scrollbarY.marginLeft = 0;

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = 'zoomY';
    chart.cursor.lineX.disabled = true;
    return chart;
  },
  createPieChart(nodeName, data) {
    let chart = am4core.create(nodeName, am4charts.PieChart3D);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    chart.data = data;
    let series = chart.series.push(new am4charts.PieSeries3D());
    series.dataFields.value = 'value';
    series.dataFields.category = 'name';
    // Add a legend
    chart.legend = new am4charts.Legend();
    series.labels.template.disabled = true;
    series.ticks.template.disabled = true;

    chart.legend.position = 'bottom';
    chart.data = data;

    return chart;
  },
  createCupChart(nodeName, data) {
    let iconPath =
      'M421.976,136.204h-23.409l-0.012,0.008c-0.19-20.728-1.405-41.457-3.643-61.704l-1.476-13.352H5.159L3.682,74.507 C1.239,96.601,0,119.273,0,141.895c0,65.221,7.788,126.69,22.52,177.761c7.67,26.588,17.259,50.661,28.5,71.548  c11.793,21.915,25.534,40.556,40.839,55.406l4.364,4.234h206.148l4.364-4.234c15.306-14.85,29.046-33.491,40.839-55.406  c11.241-20.888,20.829-44.96,28.5-71.548c0.325-1.127,0.643-2.266,0.961-3.404h44.94c49.639,0,90.024-40.385,90.024-90.024  C512,176.588,471.615,136.204,421.976,136.204z M421.976,256.252h-32c3.061-19.239,5.329-39.333,6.766-60.048h25.234  c16.582,0,30.024,13.442,30.024,30.024C452,242.81,438.558,256.252,421.976,256.252z';

    let chart = am4core.create(nodeName, am4charts.SlicedChart);
    chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect
    chart.paddingLeft = 60;

    chart.data = data;

    let series = chart.series.push(new am4charts.PictorialStackedSeries());
    series.dataFields.value = 'value';
    series.dataFields.category = 'name';
    // series.alignLabels = true;
    // // this makes only A label to be visible
    // series.labels.template.propertyFields.disabled = 'disabled';
    // series.ticks.template.propertyFields.disabled = 'disabled';

    series.maskSprite.path = iconPath;
    // series.ticks.template.locationX = 1;
    // series.ticks.template.locationY = 0;

    // series.labelsContainer.width = 100;

    // chart.legend = new am4charts.Legend();
    // chart.legend.position = 'top';
    // chart.legend.paddingRight = 0;
    // chart.legend.paddingBottom = 10;
    // chart.legend.width = 10;
    // chart.legend.height = 10;
    series.labels.template.disabled = true;
    series.ticks.template.disabled = true;
    // let marker = chart.legend.markers.template.children.getIndex(0);
    // chart.legend.markers.template.width = 40;
    // chart.legend.markers.template.height = 40;
    // marker.cornerRadius(20, 20, 20, 20);
    return chart;
  },
};
export default amChart;
