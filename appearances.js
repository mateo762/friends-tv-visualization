function startAppearances() {
    let selectedName = ''
    let linesData = []
    let separatedLinesData = []
    let episodesData = []
    let linesCountData = []
    let wordsCountData = []
    let wordsUsagesCountData = []
    let margin = {top: 25, right: 60, bottom: 60, left: 120};
    const width = 700 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    function getSeasonOfInput(input) {
        if (input.getAttribute('id') == "all-season-appearances") {
            return 'all'
        } else {
            let season = input.getAttribute('id').split('-')[2]
            return `s${season<10?`0${season}`:season}`
        }
    }

    function getSelectedSeason() {
        return getSeasonOfInput(document.querySelector('#last-viz > .radio-container > input[name="season-appearances"]:checked'))
    }

    function getSelectedEpisode() {
        let episodes = document.querySelectorAll('.dropdown-content > a')
        for (let i = 0; i < episodes.length; i++) {
            if (episodes[i].style['background-color'] == 'rgb(0, 123, 255)') {
                return episodes[i]
            }
        }
    }

    function addLabelToAxes(svg,xlabel,ylabel) {

        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "middle")
            .attr("x", width/2)
            .attr("y", height+50)
            .text(xlabel);

        svg.append('g')
            .attr('transform', `translate(${-50}, ${height / 2})`)
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)')
            .text(ylabel)
    }

    function updateScatterplot(scatterplotSvg,data,name,max,season,xlabel,ylabel,first = true) {
        // Clear the scatterplot
        scatterplotSvg.selectAll("*").remove();

        // Transform the data for the selected character into an array
        let countArrayData = Object.entries(data[name]).map(([name, count]) => ({ name, count }));
        // let linesArrayData = Object.entries(linesData[name]).map(([name, count]) => ({ name, count }));

        let filteredData = []

        if (season != 'all') {
            let id = parseInt(getSelectedEpisode().getAttribute('id'))
            let episode = `e${id<10?"0"+id:id}`
            if (first == true) {
                filteredData = linesData[name][season][episode]
            } else {
                filteredData = separatedLinesData[name][season][episode]
            }
            countArrayData = countArrayData.filter((name) => name.name.startsWith(season))
            countArrayData = countArrayData.filter((name) => name.name.includes(episode))
        }
        countArrayDataFiltered = []
        countArrayData.forEach((object) => {
            val = {}
            val.count = object.count
            let splittedName = object.name.split('_')
            splittedName = splittedName.reduce((accumulator, current, currentIndex) => {
                if (currentIndex != 0 && currentIndex != 3) {
                    return accumulator + current;
                }
                return accumulator
            }, '');  
            val.name = splittedName
            countArrayDataFiltered.push(val)
        });

        // Create the x scale
        const xScatterplotScale = d3
        .scaleBand()
        .domain(countArrayDataFiltered.map(d => d.name))
        .range([0, width])
        .padding(0.1);

        // Create the y scale
        const yScatterplotScale = d3
        .scaleLinear()
        // .domain([0, d3.max(countArrayDataFiltered, d => d.count)]) // we could adjust the domain for each character
        .domain([0,max]) // but rather, we set it such that it's fix for each of them as it makes it easier to compare between each character
        .range([height, 0]);

        let conversationsCount = 0
        let prec = ''
        for (let i = 0; i < countArrayDataFiltered.length; i++) {
            let el = countArrayDataFiltered[i];
            if (el.name != prec) {
                conversationsCount++
                prec = el.name
            }
        }
        let distanceFromColumnCenter = ((width/2)/conversationsCount)
        let radius = 5
        
        console.log(filteredData)
        // Create the circles for the scatterplot
        scatterplotSvg.selectAll(".circle")
            .data(countArrayDataFiltered)
            .enter()
            .append("circle")
            .attr("class", "circle")
            .attr("cx", function (d) { return xScatterplotScale(d.name) + distanceFromColumnCenter - radius; })
            .attr("cy", function (d) { return yScatterplotScale(d.count); })
            .attr("r", radius)
            .on("mouseover",function(d) {
                debugger
                let conv = `c${this.__data__.name.split('c')[1]}`
                let result = filteredData[conv][0]
                result = result.join(' ')
                scatterplotSvg.append("text")
                .attr('x',10)
                .attr('y',0)
                .attr('class','profile-img-desc')
                .attr('width', width)
                .attr('height', 5)
                .text(result)
            })
            .on("mouseout",function(d) {
                d3.selectAll('.profile-img-desc').remove()
            })

        // Add the x-axis for the scatterplot
        scatterplotSvg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScatterplotScale))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        // Add the y-axis for the scatterplot
        scatterplotSvg.append("g")
            .call(d3.axisLeft(yScatterplotScale));

        addLabelToAxes(scatterplotSvg,xlabel,ylabel)
    }


    function link(name) {
        return `https://enrico-benedettini.github.io/friends_data/${name}.json`
    }

    
    d3.json(link("lines_per_conversation")).then(function (linesPerConversation) {
        linesData = linesPerConversation
    }).then(function (){
        d3.json(link("separated_lines_per_conversation")).then(function (separatedLinesPerConversation) {
            separatedLinesData = separatedLinesPerConversation
        })
    }).then(function (){
        d3.json(link("episodes_per_season")).then(function (episodesPerSeason) {
            episodesData = episodesPerSeason
        })
    }).then(function (){
        d3.json(link("lines_counts")).then(function (linesData) {
            linesCountData = linesData
        })
    }).then(function (){
        d3.json(link("words_per_line")).then(function (words_data) {
            wordsCountData = words_data
        })
    }).then(function (){
        d3.json(link("words_usages")).then(function (usages_data) {
            wordsUsagesCountData = usages_data
        })
    }).then(function (){
        d3.json(link("character_appearances")).then(function (apperancesData) {
            function histogram(svg,data,season,xlabel,ylabel,perCharacter=false,name) {
                
                /* Prepare element for the following viz (scatter plot of number of lines per appearance) */
                if (perCharacter == true) {
                    data = data[name][season]
                } else {
                    let dataCopy = {}
                    keys = Object.keys(data)
                    for(let i = 0; i < keys.length;i++) {
                        name = keys[i]
                        dataCopy[name] = data[name][season]
                    }
                    data = dataCopy
                }
                // First, we convert the data to an array such that each index corresponds to a character and its appearances' count
                const dataArray = Object.entries(data).map(([name, count]) => ({ name, count }));
                
                /* 1. Set up phase */
                svg.selectAll("*").remove();

                /* 2. Define the scales */
                // Create the x scale
                const xHistogramScale = d3
                .scaleBand()
                .domain(dataArray.map(d => d.name))
                .range([0, width])
                .padding(0.1);
                
                // Create the y scale
                // First, evaluate the maximum based on the highest count and add a 10% space to it to fit its description on hover
                let max = d3.max(dataArray, d => d.count)
                max = max + (max/8)
                const yHistogramScale = d3
                .scaleLinear()
                .domain([0, max])
                .range([height, 0]);


                /* 3. Content addition */
                // We create the bars and add them to our chart
                const bars = svg
                    .selectAll(".bar")
                    .data(dataArray)
                    .enter()
                    .append("rect")
                    .attr("class", "bar")
                    .attr("x", d => xHistogramScale(d.name))
                    .attr("y", d => yHistogramScale(d.count))
                    .attr("width", xHistogramScale.bandwidth())
                    .attr("height", d => height - yHistogramScale(d.count));
                
                /* 4. Define the axes */
                // Create the x axis
                const xAxis = d3.axisBottom(xHistogramScale);
                svg
                    .append("g")
                    .attr("class", "x-axis")
                    .attr("transform", `translate(0, ${height})`)
                    .call(xAxis);

                // Create the y axis
                const yAxis = d3.axisLeft(yHistogramScale);
                svg
                    .append("g")
                    .attr("class", "y-axis")
                    .call(yAxis);

                /* 5. Add labels to x and y axes */
                addLabelToAxes(svg,xlabel,ylabel)

                return bars
            }

            function createSvg(){
                // Create the SVG element
                // We select the div with id=last-viz and append to it the svg that will contain the viz (plot or histogram)
                return d3.select("#last-viz")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            }

            // Create the SVG elements for the scatterplots and histogram
            let histogramSvg = createSvg()
            let linesScatterplotSvg = createSvg()
            let wordsScatterplotSvg = createSvg()
            let wordsUsagesHistogramSvg = createSvg()

            function addHistogramListeners(bars) {
                bars.on("click", function (d) {
                    selectedName = this.__data__.name
                    updateGraphs(getSelectedSeason())
                });
                bars.on("mouseover", function (d) {
                    let character = this.__data__.name.split(" ")[0].toLowerCase()
                    let lineLength = 10
                    let profilePicDimension = 50
                    let w = this.getAttribute('width')
                    let x = this.getAttribute('x')
                    let y = this.getAttribute('y') - profilePicDimension - lineLength
                    x = parseInt(x) + parseInt(w/2) - (profilePicDimension/2)
                    histogramSvg.append("svg:image")
                        .attr('x',x)
                        .attr('y',y)
                        .attr('class','profile-img')
                        .attr('width', profilePicDimension)
                        .attr('height', profilePicDimension)
                        .attr('xlink:href',`pictures/${character}.png`)
                    histogramSvg.append("text")
                        .attr('x',x + 10)
                        .attr('y',y)
                        .attr('class','profile-img-desc')
                        .attr('width', profilePicDimension)
                        .attr('height', profilePicDimension)
                        .text(this.__data__.count)
                    x = x + (profilePicDimension/2)
                    y = y + profilePicDimension
                    histogramSvg.append("line")
                        .attr('x1',x)
                        .attr('y1',y)
                        .attr('x2',x)
                        .attr('y2',y+lineLength)
                        .attr('class','profile-img-connect-line')
                        .attr("stroke-width", 3)
                        .attr("stroke", "black")
                        .attr('height', profilePicDimension)

                });
                bars.on("mouseout", function (d) {
                    d3.selectAll('.profile-img').remove() 
                    d3.selectAll('.profile-img-desc').remove()
                    d3.selectAll('.profile-img-connect-line').remove()
                });

                // Update the translation of the bars group based on the scroll position
                histogramSvg.on("scroll", () => {
                    const scrollX = svg.node().scrollLeft;
                    bars.attr("transform", `translate(${-scrollX}, 0)`);
                });
            }

            function updateGraphs(season) {

                const bars = histogram(histogramSvg,apperancesData,season,"Characters","Number of appearances")
                addHistogramListeners(bars)
    
                if(selectedName!='') {
                    updateScatterplot(linesScatterplotSvg, linesCountData, selectedName,30,season,"Conversation id","Number of lines",true)
                    updateScatterplot(wordsScatterplotSvg, wordsCountData, selectedName,200,season,"Conversation id","Number of words",false)
                    histogram(wordsUsagesHistogramSvg, wordsUsagesCountData, season, "Words", "Number of usages", true, selectedName)
                }
            }

            const bars = histogram(histogramSvg,apperancesData,getSelectedSeason(),"Characters","Number of appearances")
            // Add event listener to the bars
            addHistogramListeners(bars)

            let inputs = document.querySelectorAll('#last-viz > .radio-container > [name="season-appearances"]')
            inputs.forEach((input) => {
                input.addEventListener('change', function(e) {
                    // if this radio button is checked
                    if (e.target.checked) {
                        let season = getSeasonOfInput(input)
                        let content = document.querySelector('.dropdown-content')
                        let nEpisodes = episodesData[season]
                        let btn = document.querySelector('.dropdown-btn')
                        btn.innerHTML = "Episode 01"
                        content.innerHTML = ''
                        for (let i = 1; i <= nEpisodes; i++) {
                            let ep = i < 10?"0"+i:i
                            content.innerHTML += `<a class="episode" id="${ep}">Episode ${ep}</a>`
                        }

                        if (season!='all') {
                            document.getElementById("01").setAttribute('style', 'background-color: rgb(0, 123, 255);')
                            btn.removeAttribute('style');
                            let epLinks = document.querySelectorAll('.episode')
                            epLinks.forEach((ep)=>{
                                ep.addEventListener(("click"),function(d) {
                                    // Reset backgroundColor of previously selected <a> tag and select the new one
                                getSelectedEpisode().removeAttribute('style');
                                // Set the color of the newly selected <a>
                                ep.setAttribute('style', 'background-color: rgb(0, 123, 255);')
                                
                                let e = parseInt(ep.getAttribute('id'))
                                
                                btn.innerHTML = ep.innerHTML
                                updateGraphs(season)
                                });
                            });
                        } else{
                            btn.setAttribute('style', 'display: none;');
                        }
                        
                        updateGraphs(season)
                    }
                })
            })
        });
    });
}


startAppearances()