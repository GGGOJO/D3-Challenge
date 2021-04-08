// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function (data) {

    // BEGIN CODING
    // Step 1: Parse Data/Cast as numbers
    data.forEach(function (data) {
        data.poverty = +data.poverty
        data.healthcare = +data.healthcare
    });

    // Step 2: Create scale functions
    povertyList = data.map((d) => d.poverty)
    healthcareList = data.map((d) => d.healthcare)

    let xLinearScale = d3.scaleLinear()
        .domain([d3.min(povertyList) * 0.85, d3.max(povertyList)])
        .range([0, width])


    let yLinearScale = d3.scaleLinear()
        .domain([d3.min(healthcareList) * 0.8, d3.max(healthcareList)])
        .range([height, 0])

    // Step 3: Create axis functions
    let xAxis = d3.axisBottom(xLinearScale)
    let yAxis = d3.axisLeft(yLinearScale)


    // Step 4: Append Axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)

    chartGroup.append("g")
        .call(yAxis)

    // Step 5: Create Circles
    let circleGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return xLinearScale(d.poverty)
        })
        .attr("cy", function (d) {
            return yLinearScale(d.healthcare)
        })
        .attr("fill", "blue")
        .attr("r", "15")
        .attr("opacity", ".5");


    // Step 6: Initialize tool tip
    let toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.state}, Poverty: ${d.poverty}, Lack Healthcare: ${d.healthcare}`)
        })

    // Step 7: Create tooltip in the chart    
    textGroup = chartGroup.append("g")
    textGroup.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function (d) {
            return d.abbr;
        })
        // place the abbr text into the scale
        .attr("dx", function (d) {
            return xLinearScale(d.poverty) - 10;
        })
        .attr("dy", function (d) {
            return yLinearScale(d.healthcare) + 15 / 2.5;
        })
        .attr("font-size", 15)
        .call(toolTip);



    // Step 8: Create event listeners to display on hover and hide the tooltip
    // ==============================

    circleGroup.on("mouseover", function (data) {
        toolTip.show(data, this);
    })

    circleGroup.on("mouseout", function (data) {
        toolTip.hide(data);
    });

    // Step 9: Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lack of Healthcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Poverty (%)");
}).catch(function (error) {
    console.log(error);
});
