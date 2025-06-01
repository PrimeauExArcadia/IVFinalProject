/*Main javascript file*/
// Visualization data - maps IDs to display names


//Load Data
const binCols = ['ESA2008','ESA2009','ESA2010','ESA2011','ESA2012','ESA2013','ESA2014','ESA2015','ESA2016','ESA2017','ESA2018',
                'ESACount','EuroGamer','GamesRadar','Guardien','IGN','MetaCritic','Polygon','TIME','CriticCount',
                'TotalCitationsCount','Platformscount','Narrative','P2_B_MentalHelthRelatedContent',
                'P2_C1_playersOpinionNegativeOpinion','P2_C2_playersOpinionNeutralOpinion','P2_C3_playersOpinionPositiveOpinion',
                'P2_D1_scientificEvidenceNegative','P2_D2_scientificEvidenceNeutral','P2_D3_scientificEvidencePositive',
                'P1_MentalHelthRelatedContent','P1_A1_neuroDevelopmentalDisorders','P1_A2_schizophreniaSpectrumAndOtherPsychoticDisorders',
                'P1_A3_bipolarDisorderAndOtherRelatedDisorders','P1_A4_depressiveDisorders','P1_A5_anxietyDisorders','P1_A6_obsessiveCompulsiveDisordersAndRelatedDisorders',
                'P1_A7_postTraumati','P1_A8_postTraumaticStressAndOtherStressRelatedDisorders',
                'P1_A9_somaticSymptomsDisordersAndOtherRelatedDisorders','P1_A10_eatingDisorders','P1_A11_eliminationDisorders',
                'P1_A12_sleepWakeDisorders','P1_A13_sexualDisorders','P1_A14_genderDysphoria','P1_A15_disruptiveImpulseControlAndConductDisorders',
                'P1_A16_substanceRelatedAndAddictiveDisorders','P1_A17_neurocognitiveDisorders','P1_A18_personalityDisorders','P1_A19_paraphilicDisorders',
                'P1_A20_otherMentalDisorders','P1_COUNTDisorders',
]
const strCols = ['DigitalGame','Year','YearInterval','Series','Protagonist',
                'MainPC','DigitalGameMainGenre','DigitalGameSecondaryGenre'];


const disCol = binCols.filter(col => col.startsWith('P1_A'))

const margin = {top:50,right:50,bottom:100,left:100};
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;
const svg = d3.select("body").append("svg")
    .attr("width",width+margin.left+margin.right)
    .attr("height",height+margin.top+margin.bottom)
    .append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);

//Fetch Data
d3.csv("https://api.allorigins.win/raw?url=https://raw.githubusercontent.com/PrimeauExArcadia/IV-Final-Project-2025/main/listedgames.csv")
    .then(function(rawData) {
        const data = rawData.map(row => {
            const processed = {};
            binCols.forEach(col => {
                processed[col] = +row[col];
            });
            strCols.forEach(col => {
                processed[col] = row[col];
            });
            
            return processed;
        });
        //console.log(data);
        categoryScatter(data)
    });

//Plot scatter
function categoryScatter(data){
    const scatterData = [];

    data.forEach(game => {
        binCols.forEach(col => {
            if (game[col] === 1){
                scatterData.push({
                    yearInterval:game.YearInterval,
                    attribute: col,
                    game: game
                });
            }
        });
    });
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.YearInterval)
        .filter((value,index,self) => self.indexOf(value) === index).sort())
        .range([0,width])
        .padding(0.1);

    const yScale = d3.scaleBand()
        .domain(disCol)
        .range([height,0])
        .padding(0.1);
    console.log(xScale.domain());
    console.log(yScale.domain());

    const radiusScale = d3.scaleSqrt()
        .domain([0,d3.max(scatterData, d => {
            return scatterData.filter(
                p => p.yearInterval === d.yearInterval && p.attribute === d.attribute
            ).length; //get number of games with attribute
        })])
        .range([3,15])

    const svg = d3.select("#scatterChart")
        .append(svg)
        .attr("width",500)
        .attr("height",800)
    
    svg.selectAll(".dot")
        .data(scatterData)
        .enter()
        .append("circle")
        .attr("class","dot")
        .attr("cx",d=> xScale(d.yearInterval) + xScale.bandwidth() / 2)
        .attr("cy",d=> yScale(d.attribute) + yScale.bandwidth() / 2)
        .attr("r",d => radiusScale(
            scatterData.filter(
                p => p.yearInterval === d.yearInterval && p.attribute === d.attribute
            ).length
        ))
        .style("fill","steelblue")
        .style("opacity",0.7);
    svg.append("g")
        .attr("transform",`translate(0,${height})`)
        .call(d3.axisBottom(xScale))

    svg.append("g")
        .call(d3.axisLeft(yScale))
    
    svg.append("text")
        .attr("transform","rotate(-90)")
        .attr("y",0-margin.left)
        .attr("x",0-(height/2))
        .text("Mental Health Themes Prevalence by Disorder")
        .style("font-size","16px")
    
    svg.append("text")
        .attr("transform",`translate(${width / 2},${height + margin.top - 20})`)
        .style("text-anchor","middle")
        .text("Year Interval");

}
    