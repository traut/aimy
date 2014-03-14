var barHeight = 30;
var glue = 2;
var duration = 400;

var chartWidth = 200;

var margin = {top: 0, right: 0, bottom: 0, left: 0};
var height = 200 - margin.top - margin.bottom;

var svg;
var dataTree;

function collapse(d) {
    if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
    }
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
        .attr("height", newHeight)
        .attr("viewBox", "0 0 " + chartWidth + " " + newHeight);

    var nodeGroup = svg.selectAll("g.node")
        .data(nodes, function(d, i) { return d.name; })
        .enter()
            .append("svg:g")
            .attr("class", "node")
            .style("opacity", "0")
            .on("click", click)

    nodeGroup.append("svg:rect")
        .attr("width", chartWidth - 1)
        .attr("height", barHeight - 2)
        .style("stroke", function(d, i) { return d.color; })
        .style("stroke-width", "1px")
        .style("fill", "none");

    nodeGroup.append("svg:rect")
        .attr("width", function(d, i) { return d.width; })
        .attr("height", barHeight - 2)
        .style("fill", function(d, i) { return d.color; });

    nodeGroup.append("svg:text")
        .attr("x", 0)
        .attr("dx", 5)
        .attr("dy", 20)
        .attr("class", "label")
        .text(function(d) { return d.name; });

    nodeGroup.append("svg:text")
        .attr("text-anchor", "end")
        .attr("x", function(d) { return chartWidth; })
        .attr("dx", -2)
        .attr("dy", 25)
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
        //.attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", "0 0 " + chartWidth + " " + height)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    dataTree = data;

    //layout.size([width, height])

    data.children.forEach(collapse);
    update(data);
}



