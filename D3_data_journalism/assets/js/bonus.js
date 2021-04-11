let svgWidth = 960;
let svgHeight = 500;

let margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group for the main chart
let svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
let chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Parameters
let chosenXAxis = "poverty";

// Create a function to update the x-scale when the variable is click on the axis label
function xScale(Data, chosenXAxis) {
    // create the scales
    let xLinearScale = d3.scaleLinear()
        .domain([d3.min(Data, d => d[chosenXAxis]) * 0.8,
        d3.max(Data, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);

    return xLinearScale;
}

// Create a function used for updating xAxis varable upon clicking on the axis label
function renderAxes(newXScale, xAxis) {
    let bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

// Create a function to update the circles group with a time delay to transition to new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;
}

// Create a function for updating circles group with a new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

    let label;

    if (chosenXAxis === "poverty") {
        label = "Poverty:";
    }
    else {
        label = "Household income: $";
    }
    let toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function (d) {
            if (chosenXAxis === "poverty") {
                return (`${d.state}<br>${label} ${d[chosenXAxis]}%<br>Poverty ${d.poverty}%`);
            }
            else {
                return (`${d.state}<br>${label} ${d[chosenXAxis]}%<br>Lacks Healthcare ${d.healthcare}%`);
            }
        });
    // Tool Tip
    circlesGroup.call(toolTip);
    // on mouseover event
    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data, this);
    })

        // on mouseout event
        .on("mouseout", function (data, index) {
            toolTip.show(data);
        });
    return circlesGroup;
}

function updateAbbr(chosenXAxis, newXScale, abbrGroup) {
    abbrGroup.transition()
        .duration(1000)
        .attr("dx", d => newXScale(d[chosenXAxis]) - 10);
    return abbrGroup
}

// Retrieve the CSV data
d3.csv("assets/data/data.csv").then(function (Data, err) {
    if (err) throw err;

    // parse the data
    Data.forEach(function (data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.income = +data.income;
    });

    // use the xScale function for the x scale
    let xLinearScale = xScale(Data, chosenXAxis);

    // Create the y scale function
    let yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(Data, d => d.healthcare)])
        .range([height, 0]);

    // Create initial axis functions
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    // append x-axis
    let xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // append initial circles
    let circlesGroup = chartGroup.selectAll("circle")
        .data(Data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 20)
        .attr("fill", "green")
        .attr("opacity", ".5");

    let abbrGroup = chartGroup.append("g").selectAll("text")
        .data(Data)
        .enter()
        .append("text")
        .text(function (d) {
            return d.abbr;
        })
        .attr("dx", function (d) {
            return xLinearScale(d[chosenXAxis]) - 10;
        })
        .attr("dy", function (d) {
            return yLinearScale(d.healthcare) + 15 / 2.5;
        })
        .attr("font-size", 15)

    let labelsGroups = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    let povertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .classed("active", true)
        .text("In Poverty (%)");

    let incomeLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "income")
        .classed("inactive", true)
        .text("Household Income (Median)");


    // append y axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Lacks Healthcare (%)");

    // updateTooltip function with above csv import
    let circlesGroup = updateTooltip(chosenXAxis, circlesGroup);

    // x axis labels event listener
    labelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            let value = d3.select(this).attr("value");

            if (value !== chosenXAxis) {
                // replaces chosenXAxis with value
                chosenXAxis = value;

                // console.log(chosenXAxis)

                //update the x scale with new data
                xLinearScale = xScale(Data, chosenXAxis);

                xAxis = renderAxes(xLinearScale, xAxis);

                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

                circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                abbrGroup = updateAbbr(chosenXAxis, xLinearScale, abbrGroup);


                // changes classes to change bold text
                if (chosenXAxis === "income") {
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });
}).catch(function (err) {
    console.log(err);
});