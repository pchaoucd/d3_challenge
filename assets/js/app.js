// // @TODO: YOUR CODE HERE!
// You need to create a scatter plot between two of the data variables such as 
// `Healthcare vs. Poverty` or `Smokers vs. Age`.

// Using the D3 techniques we taught you in class, create a scatter plot that represents 
// each state with circle elements. You'll code this graphic in the `app.js` 
// file of your homework directory—make sure you pull in the data from `data.csv`
// by using the `d3.csv` function. Your scatter plot should ultimately appear like 
// the image at the top of this section.

// * Include state abbreviations in the circles.

// * Create and situate your axes and labels to the left and bottom of the chart.

// * Note: You'll need to use `python -m http.server` to run the visualization. 
// This will host the page at `localhost:8000` in your web browser.

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

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(dataHealthCare) {
    // console.log(dataHealthCare);
    
    // Parse Data/Cast as numbers
        dataHealthCare.forEach(function(data) {
            data.state = data.state
            data.poverty = +data.poverty
            data.healthcare = +data.healthcare
            data.abbr = data.abbr
            });

    // Create Scale Function
        var xLinearScale = d3.scaleLinear()
            .domain([8, d3.max(dataHealthCare, d => d.poverty)])
            .range([0, width]);
    
        var yLinearScale = d3.scaleLinear()
            .domain([3, d3.max(dataHealthCare, d => d.healthcare)])
            .range([height, 0]);

    // Create Axis Function
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the Chart
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);
        
        chartGroup.append("g")
            .call(leftAxis);

    // Create Circles
        var circlesGroup = chartGroup.selectAll("circle")
            .data(dataHealthCare)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.poverty))
            .attr("cy", d => yLinearScale(d.healthcare))
            .attr("r", "20")
            .attr("fill", "blue")
            .style("text-anchor", "middle")
            .attr("opacity", "0.7");
        
        var circlesGroup = chartGroup.selectAll()
            .data(dataHealthCare)
            .enter()
            .append("text")
            .attr("x", d => xLinearScale(d.poverty))
            .attr("y", d => yLinearScale(d.healthcare))
            .style("font-size", "12px")
            .style("text-anchor", "middle")
            .style('fill', 'black')
            .text(d => (d.abbr));

    // Initialize Tooltip
        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([80, -60])
            .html(function(d) {
                return (`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`);
            }); 
    
    // Create Tooltip in the Chart
        chartGroup.call(toolTip);

    // Create Event Listeners to Display and Hide the Tooltip
        circlesGroup.on("click", function(data) {
            toolTip.show(data, this);
            d3.select(this).transition()
            // .duration(1500)
            // .attr("fill", "red")
            // .style("opacity", ".5")
        })

    // On Mouse Out Event
            .on("mouseout", function(data, index) {
                toolTip.hide(data);
                d3.select(this)
                // .attr("fill", "pink")
                // .style("opacity", "0.5")
            });

    // Create Axes Label
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 20)
            .attr("x", 0 - (height / 1.1))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Lacks Healthcare (%)")
            .attr("font-family", "menlo")
            .attr("font-size", "30px")
            .style('stroke', 'black')
            .text("Lacks Healthcare (%)");
            

        chartGroup.append("text")
            .attr("transform", `translate(${width / 2.9}, ${height + margin.top + 30})`)
            .attr("class", "axisText")
            // .attr("font-weight",function(data,i) {return i*100+800;})
            .attr("font-family", "menlo")
            .attr("font-size", "30px")
            .style('stroke', 'black')
            .text("In Poverty (%)");

    }).catch(function(error) {
            console.log(error);
    });