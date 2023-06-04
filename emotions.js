function startEmotions() {
    let season_1_data = []
    let season_2_data = []
    let season_3_data = []
    let season_4_data = []
    let season_all_data = []
    
    let season_1_data_words = []
    let season_2_data_words = []
    let season_3_data_words = []
    let season_4_data_words = []
    let season_all_data_words = []
    
    let currentEmotion = []
    let wordData = []
    
    const starterText = "<h3>Emotional analysis:</h3><ul><li>Hover the pie charts for emotion distribution per character</li><li>Select a legend item to highlight all corresponding sectors</li><li>Hover each character for some basic information</li><li>Select a season or deselect all to see global data</li></ul>"
    let JoyfulText = "<dl><dt><strong>Joyful</strong></dt><dd><em>adjective</em></dd><dd>To be in a state of great happiness or delight.</dd><ul><li> categoryScoresMap.joyful.maxScore.</li><li>Overflowing with happiness and positive energy.</li></ul></dl>"
    let MadText = "<dl><dt><strong>Mad</strong></dt><dd><em>adjective</em></dd><dd>Feeling or showing anger or intense irritation.</dd><ul><li>Experiencing intense anger and frustration.</li><li>Furious and filled with rage.</li></ul></dl>";
    let NeutralText = "<dl><dt><strong>Neutral</strong></dt><dd><em>adjective</em></dd><dd>Not showing any particular emotion, indifferent.</dd><ul><li>The characters become more emotional as the seasons progress.</li></ul></dl>";
    let PeacefulText = "<dl><dt><strong>Peaceful</strong></dt><dd><em>adjective</em></dd><dd>Free from disturbance; tranquil.</dd><ul><li>Experiencing inner calm and serenity.</li><li>In a state of peace and harmony.</li></ul></dl>";
    let PowerfulText = "<dl><dt><strong>Powerful</strong></dt><dd><em>adjective</em></dd><dd>Having great power, influence, or effect.</dd><ul><li>Exerting immense strength and authority.</li><li>Holding significant control and impact.</li></ul></dl>";
    let SadText = "<dl><dt><strong>Sad</strong></dt><dd><em>adjective</em></dd><dd>Feeling or showing sorrow; unhappy.</dd><ul><li>Overwhelmed by feelings of sadness and grief.</li><li>In a state of deep melancholy and emotional pain.</li></ul></dl>";
    let ScaredText = "<dl><dt><strong>Scared</strong></dt><dd><em>adjective</em></dd><dd>Feeling or being afraid or frightened.</dd><ul><li>Experiencing intense fear and anxiety.</li><li>Terrified and paralyzed with fright.</li></ul></dl>";    
    
    const categoryScoresMap = new Map();
    
    
    let textDisplayValues = [JoyfulText, MadText, NeutralText, PeacefulText, PowerfulText, SadText, ScaredText]
    
    const data_urls = [ "https://mateo762.github.io/friends_data/emotions_s1.json", 
    "https://mateo762.github.io/friends_data/emotions_s2.json",
    "https://mateo762.github.io/friends_data/emotions_s3.json",
    "https://mateo762.github.io/friends_data/emotions_s4.json",
    "https://mateo762.github.io/friends_data/emotions_all.json"]
    
    const word_data_urls = ["https://mateo762.github.io/friends_data/emotions_all_2.json",
    "https://mateo762.github.io/friends_data/emotions_words_s1.json",
    "https://mateo762.github.io/friends_data/emotions_words_s2.json",
    "https://mateo762.github.io/friends_data/emotions_words_s3.json",
    "https://mateo762.github.io/friends_data/emotions_words_s4.json"]
    
    d3.json(data_urls[4]).then(function (emotion_data) {
        season_all_data = emotion_data    
        d3.json(data_urls[1]).then(function (emotion_data){
            season_2_data = emotion_data        
        })
        
        d3.json(data_urls[2]).then(function (emotion_data){
            season_3_data = emotion_data
        })
        
        d3.json(data_urls[3]).then(function (emotion_data){
            season_4_data = emotion_data
        })
        
        d3.json(data_urls[0]).then(function (emotion_data){
            season_1_data = emotion_data
        })
        
        d3.json(word_data_urls[0]).then(function (emotion_data_words){
            season_all_data_words = emotion_data_words
            wordData = season_all_data_words
        })
        d3.json(word_data_urls[1]).then(function (emotion_data_words){
            season_1_data_words = emotion_data_words
        })
        d3.json(word_data_urls[2]).then(function (emotion_data_words){
            season_2_data_words = emotion_data_words
        })
        d3.json(word_data_urls[3]).then(function (emotion_data_words){
            season_3_data_words = emotion_data_words
        })
        d3.json(word_data_urls[4]).then(function (emotion_data_words){
            season_4_data_words = emotion_data_words
        })
        
        
        wordData = season_all_data_words
        const ross_data = season_all_data[5]
        const monica_data = season_all_data[2]
        const chandler_data = season_all_data[0]
        const phoebe_data = season_all_data[3]
        const joey_data = season_all_data[1]
        const rachel_data = season_all_data[4] 
        
        const ross_values = getValuesAndCount(ross_data)
        const monica_values = getValuesAndCount(monica_data)
        const chandler_values = getValuesAndCount(chandler_data)
        const phoebe_values = getValuesAndCount(phoebe_data)
        const joey_values = getValuesAndCount(joey_data)
        const rachel_values = getValuesAndCount(rachel_data)
        
        
        function getValuesAndCount(char_data){
            char_values = [char_data.Joyful, char_data.Mad, char_data.Neutral, char_data.Peaceful, char_data.Powerful, char_data.Sad, char_data.Scared];
            char_count = char_data.word_count
            return {char_values, char_count}
        }
        
        
        
        const width = 1150
        const height = 600;
        const padding = 35;
        const legendWidth = 350; // Set the width for the legend
        const data = [
            {
                // x values are fixed for visual understanding -- give enough spacing between each
                // Not data related
                x: 5,
                // Total count of words out of which this analysis is made
                y: ross_values.char_count,
                // Emotion proportion of values for each sector
                values: ross_values.char_values,
                // picture name / piechart identifier
                picture: "ross",
                name: "Ross Geller"
            },
            {
                x: 40,
                y: monica_values.char_count,
                values: monica_values.char_values,
                picture: "monica",
                name: "Monica Geller"
            },
            {
                x: 75,
                y: chandler_values.char_count,
                values: chandler_values.char_values,
                picture: "chandler",
                name: "Chandler Bing"
                
            },
            {
                x: 110,
                y: phoebe_values.char_count,
                values: phoebe_values.char_values,
                picture: "phoebe",
                name: "Phoebe Buffay"
                
            },
            {
                x: 145,
                y: joey_values.char_count,
                values: joey_values.char_values,
                picture: "joey",
                name: "Joey Tribbiani"
            },
            {
                x: 180,
                y: rachel_values.char_count,
                values: rachel_values.char_values,
                picture: "rachel",
                name: "Rachel Green"
            }
        ];
        
        function getTopDataForSeason(){
            categoryScoresMap.clear();
            // Initialize an object to store the maximum and minimum scores for each category
            const categoryScores = {};
            
            // Iterate over the data array
            for (const characterData of data) {
                // Retrieve the values array and character name for the current character
                const values = characterData.values;
                const characterName = characterData.name;
                
                // Iterate over the values array and find the maximum and minimum scores for each category
                for (let i = 0; i < values.length; i++) {
                    const emotion_list = ["Joyful", "Mad", "Neutral", "Peaceful", "Powerful", "Sad", "Scared"]
                    const categoryName = emotion_list[i];
                    const score = values[i];
                    
                    // Check if the category exists in the map
                    if (!categoryScoresMap.has(categoryName)) {
                        // If it doesn't exist, initialize the category data in the map
                        categoryScoresMap.set(categoryName, {
                            maxScore: score,
                            minScore: score,
                            maxCharacter: characterName,
                            minCharacter: characterName,
                        });
                    } else {
                        // If it exists, update the maximum and minimum scores for the category
                        const categoryData = categoryScoresMap.get(categoryName);
                        
                        if (score > categoryData.maxScore) {
                            categoryData.maxScore = score;
                            categoryData.maxCharacter = characterName;
                        }
                        if (score < categoryData.minScore) {
                            categoryData.minScore = score;
                            categoryData.minCharacter = characterName;
                        }
                    }
                }
            }
            
        }
        
        getTopDataForSeason()
        
        const svg = d3.select('#my_dataviz')
        .append('svg')
        .attr('width', width + legendWidth)
        .attr('height', height);
        
        
        // Create a group for the pie charts
        const chartsGroup = svg.append('g')
        .attr('transform', `translate(${padding},${padding})`);
        
        // Create a group for the legend
        const legendGroup = svg.append('g')
        .attr('transform', `translate(${width - 3*padding},${padding})`);
        
        // Append a text display element
        const textDisplay = legendGroup
        .append('foreignObject')
        .attr('id', 'text-display')
        .attr('x', 0)
        .attr('y', 300)
        .attr('width', 250) // Set the desired width of the container
        .attr('height', 500); // Set the desired height of the container
        
        // Append a div element inside the foreignObject
        const div = textDisplay
        .append('xhtml:div')
        .style('font-family', 'Arial') // Set the desired font-family
        .style('font-size', '16px'); // Set the desired font-size
        
        // Set the HTML content
        div.html(starterText);
        
        const xAxisWidth = 900
        const xAxisHeight = 20;
        const xAxisX = 0;
        const xAxisY = height - padding;
        
        const xAxis = svg
        .append('svg')
        .attr('class', 'x-axis')
        .attr('width', xAxisWidth)
        .attr('height', xAxisHeight)
        .attr('x', xAxisX)
        .attr('y', xAxisY)
        
        xAxis.style('background-color', '#f0f0f0').style('border', '1px solid #ccc');
        const seasons = ['season_1', 'season_2', 'season_3', 'season_4'];
        let selectedSeason = "";
        
        const axisScale = d3
        .scaleBand()
        .domain(seasons)
        .range([0, xAxisWidth])
        .padding(0.1);
        
        const seasonGroup = xAxis.append('g')
        .attr('class', 'legend-group');
        
        const seasonRects = seasonGroup.selectAll('rect')
        .data(seasons)
        .enter()
        .append('rect')
        .attr('x', (d) => axisScale(d))
        .attr('y', 0)
        .attr('width', axisScale.bandwidth())
        .attr('height', xAxisHeight)
        .style('fill', '#ccc')
        .style('cursor', 'pointer')
        .style('opacity', 0.4)
        .on('click', handleSeasonClick)
        .on('mouseover', function (d) {
            d3.select(this)
            .transition()
            .style('opacity', 1);
        })
        .on('mouseout', function (event, d) {
            if (selectedSeason !== d) {
                d3.select(this)
                .transition()
                .style('opacity', 0.4);
            }
        });
        
        const textForBoxes = seasons.map((season) => {
            return {
                season: season,
                text: `Season ${season.slice(-1)}` // Example text associated with each season
            };
        });
        
        
        const seasonTexts = seasonGroup.selectAll('text')
        .data(textForBoxes)
        .enter()
        .append('text')
        .attr('x', (d) => axisScale(d.season) + axisScale.bandwidth() / 2)
        .attr('y', xAxisHeight / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('fill', 'black') // Set the text color
        .style('font-size', '12px') // Set the font size
        .style('pointer-events', 'none') // Disable pointer events
        .text((d) => d.text);
        
        function redrawPieCharts(data) {
            const yScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.y) - d3.min(data, d => d.y) / 3, d3.max(data, d => d.y)])
            .range([height - padding, padding]);
            
            const groups = chartsGroup.selectAll('g')
            .data(data);
            
            // Update existing groups' positions
            groups.transition(700)
            .attr('transform', d => `translate(${xScale(d.x)}, ${yScale(d.y)})`);
            
            groups.each(function (d) {
                const pieData = pieGenerator(d.values);
                const group = d3.select(this);
                
                // Update pie chart paths
                const paths = group.selectAll('path')
                .data(pieData);
                
                // Update existing paths
                paths.transition(500)
                .attr('d', arcGenerator);
                
                // Create new paths for added data
                paths.enter()
                .append('path')
                .attr('d', arcGenerator)
                .attr('fill', (d, i) => colorScale(i))
                .style('opacity', 0.6)
                
                // Remove any paths for removed data
                paths.exit()
                .remove();
            });
        }
        
        
        function loadSeasonData(selectedSeason){
            let seasonData = []
            let tempWordData = []
            switch(selectedSeason){
                case "season_1":
                seasonData = season_1_data
                tempWordData = season_1_data_words
                break;
                case "season_2":
                seasonData = season_2_data
                tempWordData = season_2_data_words
                break;
                case "season_3":
                seasonData = season_3_data
                tempWordData = season_3_data_words
                break;
                case "season_4":
                seasonData = season_4_data
                tempWordData = season_4_data_words
                break;
                case "":
                seasonData = season_all_data
                tempWordData = season_all_data_words
                break;
            }        
            
            wordData = tempWordData
            const ross_data = seasonData[5]
            const monica_data = seasonData[2]
            const chandler_data = seasonData[0]
            const phoebe_data = seasonData[3]
            const joey_data = seasonData[1]
            const rachel_data = seasonData[4]
            const ross_update = getValuesAndCount(ross_data)
            const monica_update = getValuesAndCount(monica_data)
            const chandler_update = getValuesAndCount(chandler_data)
            const phoebe_update = getValuesAndCount(phoebe_data)
            const joey_update = getValuesAndCount(joey_data)
            const rachel_update = getValuesAndCount(rachel_data)        
            data[0].values = ross_update.char_values
            data[0].y = ross_update.char_count
            data[1].values = monica_update.char_values
            data[1].y = monica_update.char_count
            data[2].values = chandler_update.char_values
            data[2].y = chandler_update.char_count
            data[3].values = phoebe_update.char_values
            data[3].y = phoebe_update.char_count
            data[4].values = joey_update.char_values
            data[4].y = joey_update.char_count
            data[5].values = rachel_update.char_values
            data[5].y = rachel_update.char_count
            
            getTopDataForSeason()
            
            updateTextValues()
            
            if(legendIsToggled === false){
                d3.select('#text-display').html(starterText)
            } else {
                d3.select('#text-display').html(textDisplayValues[currentEmotion])
            }
            
            // Redraw piecharts here
            redrawPieCharts(data)
            legendIsToggled = false
        }
        
        let legendIsToggled = false;
        
        function handleSeasonClick(event, season) {
            // Update the data for the pie charts based on the selected season
            // Redraw the pie charts with the updated data
            const allSeasons = xAxis.selectAll('rect');
            
            if (selectedSeason !== season){
                allSeasons
                .transition()
                .style('opacity', 0.4);
                selectedSeason = season
                d3.select(this)
                .transition()
                .style('opacity', 1)
            }
            else{
                selectedSeason = ""
                d3.select(this)
                .transition()
                .style('opacity', 0.4)
            }
            
            legend.selectAll('rect').each(function() {
                const rect = d3.select(this);
                const rectId = rect.node().parentNode.getAttribute('data-id');
                // Get the unique identifier of the current legend item
                const rectOp = rect.style('opacity')
                if(rectOp == 1){
                    legendIsToggled = true
                }
                else{
                }
            })
            
            loadSeasonData(selectedSeason)
        }
        
        const maxX = width - padding - legendWidth;
        
        const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.x)])
        .range([padding, maxX]);
        
        const yScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.y) - d3.min(data, d => d.y)/3, d3.max(data, d => d.y)])
        .range([height - padding, padding]);
        
        const sizeScale = d3.scaleSqrt()
        .domain([0, d3.max(data, d => d.values.length)])
        .range([5, 20]);
        
        const pieGenerator = d3.pie()
        .sort(null);
        
        const arcGenerator = d3.arc()
        .outerRadius(60)
        .innerRadius(35)
        .padAngle(0.1)
        .cornerRadius(0);
        
        const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
        
        const emotion_colors = ["#2d8659", "#f94144", "#bfbfbf", "#7e1717", "#f8961e", "#104696", "#b5179e"]
        const colorScale = d3.scaleOrdinal()
        .range(emotion_colors);
        
        const colorCloud = d3.scaleOrdinal()
        .range(emotion_colors);
        
        
        const groups = chartsGroup.selectAll('g')
        .data(data)
        .enter()
        .append('g')
        .attr('transform', d => `translate(${xScale(d.x)}, ${yScale(d.y)})`);
        
        groups.each(function (d) {
            const pieData = pieGenerator(d.values);
            const group = d3.select(this);
            
            // Add clipping path
            const clip = group.append("clipPath")
            .attr("id", "clip")
            .append("circle")
            .attr("r", arcGenerator.innerRadius());
            
            // Append the image element
            group.append("image")
            .attr("xlink:href", (d, i) => `pictures/${d.picture}.png`)
            .attr("clip-path", "url(#clip)") // Use the clip path
            .attr("x", -35)
            .attr("y", -35)
            .attr("width", 35 * 2)
            .attr("height", 35 * 2)
            .on("mouseover", function (d) {
                const characterData = d3.select(this).datum(); 
                // Mouseover logic
                tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
                tooltip.html(`Name: ${characterData.name}<br/>Word count: ${characterData.y}`) 
            })
            .on("mouseout", function (d) {
                // Mouseout logic
                tooltip.transition()
                .duration(500)
                .style("opacity", 0);
            });
            
            const paths = group.selectAll('path')
            .data(pieData)
            .enter()
            .append('path')
            .attr('d', arcGenerator)
            .attr('fill', (d, i) => colorScale(i))
            .style('opacity', 0.6)
            .each(function(d) {
                // Associate the pie chart information with each sector's path element
                d3.select(this.parentNode);
            })
            .on('click', function(d) {
                var pieChart = d3.select(this.parentNode).datum();  // Get the attached pie chart information
                // Code to execute when a sector is clicked
                // You can access the associated pie chart and perform actions based on it
                const character = pieChart.name
                const emotion = emotion_list[d3.select(this).datum().index]
                // You can also access the associated data using d.data and perform actions based on it
                tooltip
                .transition()
                .duration(200)
                .style('opacity', 0.9);
                const t = getSectorTooltip(character, emotion)
                tooltip
                .html(t)
                .transition(200)
                .style('left', `${d.pageX}px`)
                .style('top', `${d.pageY - 28}px`);
            })
            .on('mouseover', function (d) {
                
                // Get the data associated with the hovered segment
                const segmentData = d3.select(this).datum().data;
                
                // Display the data in the tooltip
                tooltip.transition()
                .duration(200)
                .style('opacity', 0.9);
                tooltip.html(`${(segmentData*100).toFixed(2)}%`)
                .style('left', `${d.pageX}px`)
                .style('top', `${d.pageY - 28}px`);
                
                
                // Increase outer radius of arc generator
                arcGenerator.outerRadius(60 + 10);
                arcGenerator.innerRadius(35 + 10);
                arcGenerator.padAngle(0);
                // Redraw sectors with updated arc generator
                d3.select(this)
                .transition()
                .attr('d', arcGenerator)
                .style('opacity', 1);
            })
            .on('mouseout', function (d) {
                tooltip.transition()
                .duration(500)
                .style("opacity", 0);
                // Reset outer radius of arc generator
                arcGenerator.outerRadius(60);
                arcGenerator.innerRadius(35);
                arcGenerator.padAngle(0.1);
                
                // Redraw sectors with updated arc generator
                d3.select(this)
                .transition()
                .attr('d', arcGenerator)
                .style('opacity', 0.6);
            });
            
        });
        
        const emotion_list = ["Joyful", "Mad", "Neutral", "Peaceful", "Powerful", "Sad", "Scared"]
        
        // Define the legend data
        const legendData = colorScale.domain().map(label => ({
            label : emotion_list[label],
            color: colorScale(label)
        }));
        
        
        // Create the legend
        const legend = legendGroup.selectAll('.legend')
        .data(legendData)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', (d, i) => `translate(0, ${i * 40})`)
        .attr('data-id', (d, i) => i); // Assign a unique identifier to each legend item
        
        
        legend.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 40)
        .attr('height', 20)
        .style('fill', d => d.color)
        .style('opacity', 0.6);
        
        legend.append('text')
        .attr('x', 60)
        .attr('y', 14)
        .text(d => d.label)
        .style('font-size', '18px');
        
        // Initialize flag variable
        let isSameLegendClicked = false;
        let legendTripleClick = 0;
        let lastClickedId = 0;
        
        // Add click event listener to legend elements
        legend.selectAll('rect')
        .on('click', function(event, d) {
            const matchingPaths = [];
            const notMatchingPaths = [];
            const clickedRect = d3.select(this)
            const newRectOpacity = clickedRect.style('opacity') === '1' ? 0.6 : 1;
            clickedRect.transition().style('opacity', newRectOpacity)
            
            // Get the unique identifier of the clicked legend item
            const clickedId = clickedRect.node().parentNode.getAttribute('data-id');
            
            if (clickedId === lastClickedId) {
                // Same legend rectangle clicked twice
                isSameLegendClicked = true;
                legendTripleClick++
                if(legendTripleClick == 2){
                    legendTripleClick = true
                }
            } else {
                // Different legend rectangle clicked
                isSameLegendClicked = false;
                currentEmotion = clickedId
                legendTripleClick = 0
            }
            
            
            // Iterate over each legend rectangle
            legend.selectAll('rect')
            .each(function () {
                const rect = d3.select(this);
                // Get the unique identifier of the current legend item
                const rectId = rect.node().parentNode.getAttribute('data-id');
                if (clickedId !== rectId) {
                    // Set the opacity based on the clicked legend item
                    rect
                    .transition()
                    .style('opacity', 0.6);
                }
                else{
                    rect
                    .transition()
                    .style('opacity', newRectOpacity);
                }
            });
            
            
            
            // Iterate over each pie chart group
            groups.each(function() {
                const group = d3.select(this);
                const legendIndex = legendData.findIndex(entry => entry.label === d.label);
                
                
                // Iterate over each path in the pie chart
                group.selectAll('path')
                .each(function(segmentData) {
                    
                    // Check if the data matches the clicked legend entry
                    if (segmentData.index === legendIndex) {
                        matchingPaths.push(d3.select(this));
                    }
                    else{
                        notMatchingPaths.push(d3.select(this));
                    }
                });
            });    
            
            // Update the style of the matching paths
            // Toggle the opacity and radii of the selected paths
            const currentOpacity = matchingPaths[0].style('opacity');
            const newOpacity = currentOpacity === '1' ? 0.6 : 1;
            const currentOuterRadius = arcGenerator.outerRadius();
            const currentInnerRadius = arcGenerator.innerRadius();
            const newOuterRadius = currentOuterRadius === 60 ? 70 : 60;
            const newInnerRadius = currentInnerRadius === 35 ? 45 : 35;
            
            matchingPaths.forEach(function(path) {
                if(!isSameLegendClicked || legendTripleClick === true){
                    path.transition()
                    .style('opacity', newOpacity)
                    .attr('d', arcGenerator.outerRadius(70).innerRadius(45));
                    
                }
                else{
                    path.transition()
                    .style('opacity', newOpacity)
                    .attr('d', arcGenerator.outerRadius(60).innerRadius(35));
                }
            })
            if(legendTripleClick === true){
                legendTripleClick = false
            }
            notMatchingPaths.forEach(function(path) {
                path.transition()
                .style('opacity', 0.6)
                .attr('d', arcGenerator.outerRadius(60).innerRadius(35));
            }
            );
            
            
            // Change text box beneath legend
            const rect = d3.select(this);
            // Get the unique identifier of the current legend item
            const rectId = rect.node().parentNode.getAttribute('data-id');
            updateTextValues()
            const selectedText = textDisplayValues[rectId];
            // Set the HTML content
            const div = d3.select('#text-display')
            div.html(selectedText);
            if(newRectOpacity === 0.6){
                div.html(starterText);
            }
            lastClickedId = clickedId
        });
        
        
        
        function updateTextValues(){        
            JoyfulText = `<dl><dt><strong>Joyful</strong></dt><dd><em>adjective</em></dd><dd>To be in a state of great happiness or delight.</dd><ul><li>Highest: ${categoryScoresMap.get("Joyful").maxCharacter} (${(categoryScoresMap.get("Joyful").maxScore*100).toFixed(2)}%)</li><li>Lowest: ${categoryScoresMap.get("Joyful").minCharacter} (${(categoryScoresMap.get("Joyful").minScore*100).toFixed(2)}%)</li></ul></dl>`
            MadText = `<dl><dt><strong>Mad</strong></dt><dd><em>adjective</em></dd><dd>Feeling or showing anger or intense irritation.</dd><ul><li>Highest: ${categoryScoresMap.get("Mad").maxCharacter} (${(categoryScoresMap.get("Mad").maxScore*100).toFixed(2)}%)</li><li>Lowest: ${categoryScoresMap.get("Mad").minCharacter} (${(categoryScoresMap.get("Mad").minScore*100).toFixed(2)}%)</li></ul></dl>`
            NeutralText = "<dl><dt><strong>Neutral</strong></dt><dd><em>adjective</em></dd><dd>Not showing any particular emotion, indifferent.</dd><ul><li>The characters become more emotional as the seasons progress.</li></ul></dl>";
            PeacefulText = `<dl><dt><strong>Peaceful</strong></dt><dd><em>adjective</em></dd><dd>Free from disturbance; tranquil.</dd><ul><li>Highest: ${categoryScoresMap.get("Peaceful").maxCharacter} (${(categoryScoresMap.get("Peaceful").maxScore*100).toFixed(2)}%)</li><li>Lowest: ${categoryScoresMap.get("Peaceful").minCharacter} (${(categoryScoresMap.get("Peaceful").minScore*100).toFixed(2)}%)</li></ul></dl>`
            PowerfulText = `<dl><dt><strong>Powerful</strong></dt><dd><em>adjective</em></dd><dd>Having great power, influence, or effect.</dd><ul><li>Highest: ${categoryScoresMap.get("Powerful").maxCharacter} (${(categoryScoresMap.get("Powerful").maxScore*100).toFixed(2)}%)</li><li>Lowest: ${categoryScoresMap.get("Powerful").minCharacter} (${(categoryScoresMap.get("Powerful").minScore*100).toFixed(2)}%)</li></ul></dl>`
            SadText = `<dl><dt><strong>Sad</strong></dt><dd><em>adjective</em></dd><dd>Feeling or showing sorrow; unhappy.</dd><ul><li>Highest: ${categoryScoresMap.get("Sad").maxCharacter} (${(categoryScoresMap.get("Sad").maxScore*100).toFixed(2)}%)</li><li>Lowest: ${categoryScoresMap.get("Sad").minCharacter} (${(categoryScoresMap.get("Sad").minScore*100).toFixed(2)}%)</li></ul></dl>`
            ScaredText = `<dl><dt><strong>Scared</strong></dt><dd><em>adjective</em></dd><dd>Feeling or being afraid or frightened.</dd><ul><li>Highest: ${categoryScoresMap.get("Scared").maxCharacter} (${(categoryScoresMap.get("Scared").maxScore*100).toFixed(2)}%)</li><li>Lowest: ${categoryScoresMap.get("Scared").minCharacter} (${(categoryScoresMap.get("Scared").minScore*100).toFixed(2)}%)</li></ul></dl>`
            textDisplayValues = [JoyfulText, MadText, NeutralText, PeacefulText, PowerfulText, SadText, ScaredText]
            
        }
        
        function getKeysWithHighestValues(x) {
            const array = Object.entries(x).map(function([key, value]) {
                return { key: key, value: value };
            });
            
            array.sort(function(a, b) {
                return b.value - a.value;
            });
            
            // Get the keys of the first 3 objects
            const keys = array.slice(0, 3).map(function(obj) {
                return obj.key;
            });
            
            return keys;
        }
        
        function getFirstName(fullName) {
            // Split the full name into an array of words
            const words = fullName.split(' ');
            
            // Extract the first word (first name)
            const firstName = words[0];
            
            // Convert the first name to lowercase
            const lowerFirstName = firstName.toLowerCase();
            
            return lowerFirstName;
        }
        
        function updateNames(names) {
            let updatedNames = [];
            
            // Iterate over each name in the array
            for (let i = 0; i < names.length; i++) {
                const fullName = names[i];
                const firstName = getFirstName(fullName);
                
                // Add the lowercase first name to the updatedNames array
                updatedNames.push(firstName);
            }
            
            return updatedNames;
        }
        
        function getWordCloud(words) {
            let t = "";

            let cloudWords = words.map(word => ({ text: word[0], size: word[1] }));
                        
            // Compute the domain of your size values
            let sizeDomain = d3.extent(cloudWords, d => d.size);
            
            // Decide on your font size range
            let fontSizeRange = [20, 30]; // Change this to fit your design
            
            // Create a scale for the font sizes
            let fontSizeScale = d3.scaleLinear()
            .domain(sizeDomain)
            .range(fontSizeRange);
            
            cloudWords = cloudWords.map(word => ({ text: word.text, size: fontSizeScale(word.size) }))
            
            // Create a new layout instance
            let layout = d3.layout.cloud()
            .size([300, 250]) // Set the size of the word cloud to the same size as your tooltip
            .words(cloudWords)
            .padding(2)
            .rotate(() => (Math.random() < 0.5 ? 0 : 0)) // Randomly rotate words by 0 or 90 degrees
            .font("Impact")
            .fontSize(d => d.size) // Use the scale here
            .on("end", draw);
            
            // Start the layout calculation
            layout.start();

            
            function draw(cloudWords) {
                const c = d3.create("svg")
                .attr("width" , 300)
                .attr("height" , 250);

                const group = c.append("g")
                .attr("transform", "translate(150,125)"); // Center the word cloud in the tooltip

                const texts = group.selectAll("text")
                .data(cloudWords)
                .enter()
                .append("text")
                .style("font-size", d => `${d.size}px`)
                .style("font-family", "Impact")
                .style("fill", (_d, i) => colorCloud(i))
                .attr("text-anchor", "middle")
                .attr("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
                .text(d => d.text);
                t = c.node().outerHTML;
            }
            return t
        }
        
        function getSectorTooltip(character, emotion){
            const data = wordData[character][emotion].characters
            const words = wordData[character][emotion].words
            console.log(data)
            let characters = getKeysWithHighestValues(data)
            characters = updateNames(characters)
            let cloudWords = getWordCloud(words)
            const tooltipHtml =  `<div id="emotion-tooltip" class="emotion-tooltip">
            <div>
            <span>Most common words associated</span>
            <div id="emotion-wordcloud">
            ${cloudWords}
            </div>
            </div>
            <div>
            <span>Character interactions associated</span>
            <div>
            <img id="emotion-tooltip-image-1" src="pictures/${characters[0]}.png">
            <img id="emotion-tooltip-image-1" src="pictures/${characters[1]}.png">
            <img id="emotion-tooltip-image-1" src="pictures/${characters[2]}.png">
            </div>
            </div>
            </div>`
            return tooltipHtml
        }
    })
}

startEmotions()