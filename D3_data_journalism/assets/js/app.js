const svgWidth = 960;
const svgHeight = 500;

const margin = {
    top: 50,
    right: 50,
    bottom: 60,
    left: 50
};

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, 
// and shift the latter by left and top margins.
const svg = d3.select("#scatter")
    .append("svg")
    .classed("chart", true)
    .attr("width", svgWidth)
    .attr("height", svgHeight);

const chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function (healthData) {

    // Parse Data/Cast as numbers
    healthData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    // Create scale functions
    const xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(healthData, d => d.poverty)])
        .range([0, width]);

    const yLinearScale = d3.scaleLinear()
        .domain([4, d3.max(healthData, d => d.healthcare)])
        .range([height, 0]);

    // Create axis functions
    const bottomAxis = d3.axisBottom(xLinearScale);
    const leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Create Circles
    const circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")

    //Add the SVG Text Element to the chartGroup
    chartGroup.selectAll("text")
        .data(healthData)
        .enter()
        .append("text")
        .classed("stateText", true)
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare) + 5)
        .text(d => d.abbr)
        .attr("font-size", "15px")

    // Initialize tool tip
    const toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.state}<br>Poverty: ${d.poverty} %<br>Healthcare: ${d.healthcare}`);
        });

    // Create tooltip in the chart
    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data, this);
    })
        // on mouseout event
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "aText")
        .text("Lacks Healthcare(%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + 40})`)
        .attr("class", "aText")
        .text("In Poverty (%)");

}).catch(function (error) {
    console.log(error);
});
