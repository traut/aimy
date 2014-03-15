var barHeight = 50;
var glue = 2;
var duration = 400;

var chartWidth = 500;

var margin = {top: 0, right: 0, bottom: 0, left: 0};

var svg;
var dataTree;

function collapse(d) {
    if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
    }
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}


function click(d) {
    if (d.children && d.children.length > 0) {
        d._children = d.children;
        d.children = null;
    } else if (d._children && d._children.length > 0) {
        d.children = d._children;
    } else {
        return;
    }
    update();
}

var layout = d3.layout.pack()
    .children(function(d) {
        return (!d.children || d.children.length === 0) ? null : d.children;
    })


function update() {
    var nodes = layout.nodes(dataTree);

    // normalize by depth
    nodes.filter(function(d) {
        return d.name;
    }).forEach(function(d, i) {
        d.y = barHeight * i + glue;//d.depth * 100;
        d.x = d.depth * 20;
    });

    var newHeight = barHeight * nodes.length + glue * nodes.length + margin.top + margin.bottom;
    d3.select("svg.chart")
        .attr("height", newHeight);

    var nodeGroup = svg.selectAll("g.node")
        .data(nodes, function(d, i) { return d.name; })
        .enter()
            .append("svg:g")
            .attr("class", "node")
            .style("opacity", "0")
            .on("click", click)

    var heightWithoutGlue = barHeight - glue;

    nodeGroup.append("svg:rect")
        .attr("width", chartWidth)
        .attr("height", heightWithoutGlue)
        .attr("rx", "5px")
        .attr("ry", "5px")
        //.style("fill", function(d) { return d3.rgb(d.color).brighter();} );
        .style("fill", function(d) { return d.color; } )
        .style("opacity", "0.3");

    nodeGroup.append("svg:rect")
        .attr("width", function(d, i) { return (isNumber(d.width)) ? d.width : chartWidth; })
        .attr("height", heightWithoutGlue)
        .attr("rx", "5px")
        .attr("ry", "5px")
        .style("fill", function(d, i) { return d.color; });

    nodeGroup.append("svg:text")
        .attr("x", 0)
        .attr("dx", 5)
        .attr("dy", barHeight * (3/5))
        .attr("class", "label")
        .text(function(d) { return d.name; });

    nodeGroup.append("svg:text")
        .attr("text-anchor", "end")
        .attr("x", function(d) { return chartWidth; })
        .attr("dx", -3)
        .attr("dy", barHeight * (4/5))
        .attr("class", "tip")
        .text(function(d) { return d.tip; });

    var node = svg.selectAll("g.node")
        .data(nodes, function(d, i) { return d.name; });

    var nodeUpdate = node
        //.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .attr("transform", function(d) { return "translate(0," + d.y + ")"; })
        .transition()
            .duration(duration)
            .style("opacity", "1");

    var nodeExit = node.exit()
        .style("opacity", "0")
        .transition()
            .duration(duration)
            //.attr("transform", function(d) { return "translate(" + d.parent.x + "," + d.parent.y + ")"; })
            .attr("transform", function(d) { return "translate(0," + d.parent.y + ")"; })
        .remove();

}

function renderTree(data) {

    svg = d3.select("body").append("svg")
        .attr("class", "chart")
        //.attr("viewBox", "0 0 " + chartWidth + " 600")
        .attr("preserveAspectRatio", "xMinYMin meet")
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    dataTree = data;

    //layout.size([width, height])

    data.children.forEach(collapse);
    update(data);
}



