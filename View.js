var BarGraphModel = Backbone.Model.extend({
    defaults: {
        // Define necessary attributes for bar graph data
		BarGraphData: [
    		{ '2020': 10 },
    		{ '2021': 20 },
    		{ '2022': 15 }
]

    }
});

var PieChartModel = Backbone.Model.extend({
    defaults: {
        // Define necessary attributes for pie chart data
		PieGraphData: [
			{'2020': '10 Member'},
			{'2021': '20 Member'},
			{'2020': '10 Member'},
		],
    }
});


var BarGraphView = Backbone.View.extend({
    el: '#bar-graph-container',

    initialize: function() {
    this.model = new BarGraphModel();
    this.render();
},


    render: function() {
        let data = this.model.get('BarGraphData');
        let values = data.map(obj => parseInt(Object.values(obj)[0]));

        let width = 400;
        let height = 200;

        let svg = d3.select(this.el).append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('tabindex', '0')
            .attr('role', 'application')
            .attr('aria-label', 'Bar Graph represent the number of members per year, navigate directly using arrow key')
            .on('keydown', this.handleKeyDown.bind(this));

        let xScale = d3.scaleBand()
            .domain(d3.range(data.length))
            .range([110, width - 100])
            .padding(0.1);

        let yScale = d3.scaleLinear()
            .domain([0, d3.max(values)])
            .range([height - 40, 40]);

		let bars = svg.selectAll('rect')
        
        	.data(data)
        	.enter()
        	.append('rect')
        	// Set attributes for the bars
        	.attr('x', function(d, i) { return xScale(i); })
        	.attr('y', function(d) { return yScale(Object.values(d)[0]); })
        	.attr('width', xScale.bandwidth())
        	.attr('height', function(d) { return height - yScale(Object.values(d)[0]); })
        	.attr('fill', 'steelblue')
        	.attr('aria-label', function(d, i) { return ( Object.values(d) + 'Member(s) in' + Object.keys(d));; })
        	.attr('tabindex', '-1');

    		// Add event listeners for tooltips
		bars.on('mouseenter focus', function(d, i) { // Show tooltip on mouse enter or focus
            let year = Object.keys(i)[0]; // Extract the year from the data object
            let members = Object.values(i)[0]; // Extract the number of members
            let tooltipText = members + ' Member(s) in ' + year; // Construct the tooltip text

            // Remove existing tooltips
            d3.selectAll('.tooltip').remove();

            // Append new tooltip to the SVG element
            let tooltip = svg.append('text')
                .attr('class', 'tooltip')
                .attr('text-anchor', 'middle')
                .text(tooltipText);

            // Calculate tooltip position relative to bar position
            let barX = parseFloat(d3.select(this).attr('x'));
            let barWidth = parseFloat(d3.select(this).attr('width'));
            let barY = parseFloat(d3.select(this).attr('y'));
            let tooltipWidth = tooltip.node().getBBox().width;
            let tooltipHeight = tooltip.node().getBBox().height;

            let tooltipX = barX + barWidth / 2 - tooltipWidth / 2;
            let tooltipY = barY - tooltipHeight - 5;

        // Set tooltip position
        tooltip.attr('x', tooltipX)
               .attr('y', tooltipY);
        })
        .on('mouseleave blur', function() { // Hide tooltip on mouse leave or blur (when focus is lost)
            d3.selectAll('.tooltip').remove();
        })

        .on('focus', function(d, i) { // Show tooltip on focus
            let year = Object.keys(i)[0]; // Extract the year from the data object
            let members = Object.values(i)[0]; // Extract the number of members
            let tooltipText = members + ' Member(s) in ' + year; // Construct the tooltip text
        
            // Remove existing tooltips
            d3.selectAll('.tooltip').remove();
        
            // Append new tooltip to the SVG element
            let tooltip = svg.append('text')
                .attr('class', 'tooltip')
                .attr('x', width / 2)
                .attr('y', height / 2)
                .attr('text-anchor', 'middle')
                .text(tooltipText);
        
            // Set tooltip position relative to bar position
            tooltip.style('left', (parseFloat(d3.select(this).attr('x')) + parseFloat(d3.select(this).attr('width')) / 2 + 10) + 'px')
                .style('top', (parseFloat(d3.select(this).attr('y')) - 10) + 'px');
            })
            
            .on('blur', function() { // Hide tooltip on blur (when focus is lost)
                d3.selectAll('.tooltip').remove();
            });


        // Add labels for each bar
        svg.selectAll('.bar-label')
            .data(values)
            .enter()
            .append('text')
            .attr('class', 'bar-label')
            .attr('id', function(d, i) { return 'bar-label-' + i; })
            .attr('x', function(d, i) { return xScale(i) + xScale.bandwidth() / 2; })
            .attr('y', function(d) { return yScale(d) - 5; })
            .attr('text-anchor', 'middle')
            // .text(function(d) { return d + ' Member'; }); // Append ' Member' to each bar value
    },

    handleKeyDown: function(event) {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();

            let bars = d3.selectAll('rect').nodes();
            let currentIndex = bars.findIndex(bar => bar === document.activeElement);

            if (event.key === 'ArrowRight') {
                if (currentIndex < bars.length - 1) {
                    bars[currentIndex + 1].focus();
                }
            } else if (event.key === 'ArrowLeft') {
                if (currentIndex > 0) {
                    bars[currentIndex - 1].focus();
                }
            }
        }
    }
});



//Pie Chart
var PieChartView = Backbone.View.extend({
    el: '#pie-chart-container', // Assuming you have a container element in your HTML

    initialize: function() {
        this.model = new PieChartModel(); // Instantiate your model
        this.render();
    },

//     render: function() {
//         let data = this.model.get("PieGraphData");
// 		let width = 400;
// 		let height = 200;
// 		let radius = Math.min(width, height) / 2;
// 		// console.log(radius)

// 		let svg = d3.select(this.el).append('svg')
// 			.attr('width', width)
// 			.attr('height', height)
//            	.append('g')
//             .attr('transform', 'translate(' + (width / 2) +',' + (height / 2) + ')')
// 			.attr('tabindex', '0')
// 			.attr('aria-lable', 'Pie Chart represent the number of members per year');

// 		let pie = d3.pie()
//          	.value(function(d) { return parseInt(Object.values(d)[0]); });

// 		let path = d3.arc()
//             .outerRadius(radius - 10)
//             .innerRadius(0);

// 		let arc = svg.selectAll("arc")
//             .data(pie(data))
//             .enter()
//             .append("g")
// 			.attr('tabindex', '0')

// 		arc.append("path")
//             .attr("d", path)
//             .attr("fill", function(d, i) {
//                 return d3.schemeCategory10[i];
//         });

// 		arc.append("text")
//             .attr("transform", function(d) {
//                 return "translate(" + path.centroid(d) + ")";
//         	})
//             .attr("text-anchor", "middle")
//             .text(function(d) {
//                 return Object.keys(d.data)[0];
//             });
	
// 	}
});	

// $(document).ready(function() {
//     var barGraphView = new BarGraphView();
//     var pieChartView = new PieChartView();
// });

$(document).ready(function() {
    var barGraphView = new BarGraphView();
    var pieChartView = new PieChartView();

    $(document).keydown(function(event) {
        if (event.key === 'Escape') {
            d3.selectAll('.tooltip').remove();
        }
    });
});
