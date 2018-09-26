var graph_margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 700 - graph_margin.left - graph_margin.right,
        height = 500 - graph_margin.top - graph_margin.bottom;


// 自分のデータの形に合わせたパースをする
var graph_parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");

var x = techan.scale.financetime()
        .range([0, width]);

var y = d3.scaleLinear()
        .range([height, 0]);

var candlestick = techan.plot.candlestick()
        .xScale(x)
        .yScale(y);

var xAxis = d3.axisBottom()
        .scale(x)
        .tickFormat(d3.timeFormat("%m/%d"))
        .ticks(5);

var yAxis = d3.axisLeft()
        .scale(y);

var svg = d3.select(".graphPanel").append("svg")
        .attr("width", width + graph_margin.left + graph_margin.right)
        .attr("height", height + graph_margin.top + graph_margin.bottom)
        .append("g")
        .attr("transform", "translate(" + graph_margin.left + "," + graph_margin.top + ")");

d3.csv("/static/chartData/data.csv", function(error, data) {
    var accessor = candlestick.accessor();

    data = data.slice(0, 200).map(function(d) {
        return {
            date: graph_parseDate(d.Date),
            open: +d.Open,
            high: +d.High,
            low: +d.Low,
            close: +d.Close,
            volume: +d.Volume
        };
    }).sort(function(a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); });

    // console.log(data);

    svg.append("g")
            .attr("class", "candlestick");

    svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")");

    svg.append("g")
            .attr("class", "y axis")
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Price ($)");

    // Data to display initially
    draw(data.slice(0, data.length-20));
    // Only want this button to be active if the data has loaded
    // d3.select("button").on("click", function() { draw(data); }).style("display", "inline");
});

function draw(data) {
    x.domain(data.map(candlestick.accessor().d));
    y.domain(techan.scale.plot.ohlc(data, candlestick.accessor()).domain());

    svg.selectAll("g.candlestick").datum(data).call(candlestick);
    svg.selectAll("g.x.axis").call(xAxis);
    svg.selectAll("g.y.axis").call(yAxis);
}