/*Main javascript file*/
// Visualization data - maps IDs to display names
//import ScatterCategorical from 'charts/scatterCat.js'
//import LinePlotCompare from './charts/linepltCompare.js'
//import HierarchalZoom from './charts/hierarchyZoom.js'

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


const disorderCol = binCols.filter(col => col.startsWith('P1_A'));
const p2 = binCols.filter(col => col.startsWith('P2'))
const p1 = binCols.filter(col => col.startsWith('P1'))
const options = {
    binCols:binCols,
    strCols:strCols,
    disorderCol:disorderCol,
    pubOpin:p2,
    expOpin:p1,
}


//Fetch Data
d3.csv("https://api.allorigins.win/raw?url=https://raw.githubusercontent.com/PrimeauExArcadia/IVFinalProject/main/listedgames.csv")
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
        const dataTable = new DataTable('#tableBody')
        const scatterCat = new ScatterCategorical('#scatterChart',data,options,dataTable)
        scatterCat.render()
        const linplt = new LinePlotCompare('#linepltCompare',data,options,dataTable)
        linplt.render()
        
    });

