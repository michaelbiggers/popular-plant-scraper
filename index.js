const puppeteer = require('puppeteer');
const url = '';
const options = { headless:true, slowMo: 600,devtools: true  };
const selector = '.collection-card';
const zones = [3,4,5,6,7,8,9,10,11];
// run this function in a loop to get all zones 3-8
// function should start at one URL, collect data, push it into object, then move to the next URL and repeat
// at the end, print out the finished object to a JSON file to use as an API endpoint
let allPlants = [];

async function scrape(){    
    
    const browser = await puppeteer.launch(options);    
    const page = await browser.newPage();  
    
    
    // start loop here  
    for await (const i of zones) {
       
        // get Evergreen trees
        await page.goto(`https://www.fast-growing-trees.com/collections/evergreentrees#/filter:search_zones:${i}/perpage:6`);  
        await page.waitForSelector('#searchspring-content', {visible: true})

        let loopVal = i;
        console.log(`Scanning Zone ${loopVal}...`)
                             
        const evergreenPlants = await page.$$eval(selector, (nodes, loopVal) => {
            return nodes.map(node => {
                
                const category = "Evergreen";
                const title = node.querySelector('.product-link').textContent;
                const link = node.querySelector('.product-link').href;
                const img = node.querySelector('img.block-image').getAttribute('src');
                const zone = loopVal;
                return {
                        category,
                        title,
                        link,
                        img,
                        zone
                }
                })
            }, loopVal);
        // get shade trees
        await page.goto(`https://www.fast-growing-trees.com/collections/shadetrees#/filter:search_zones:${i}/perpage:6`);  
        await page.waitForSelector('#searchspring-content', {visible: true})

        
        const shadePlants = await page.$$eval(selector, (nodes, loopVal) => {
            return nodes.map(node => {
                const category = "Shade";
                const title = node.querySelector('.product-link').textContent;
                const link = node.querySelector('.product-link').href;
                const img = node.querySelector('img.block-image').getAttribute('src');
                const zone = loopVal;
                    return {
                        category,
                        title,
                        link,
                        img,
                        zone
                    }
                })
            }, loopVal);
        // get flowering trees
        await page.goto(`https://www.fast-growing-trees.com/collections/floweringtrees#/filter:search_zones:${i}/perpage:6`);  
        await page.waitForSelector('#searchspring-content', {visible: true})

        const floweringPlants = await page.$$eval(selector, (nodes, loopVal) => {
            return nodes.map(node => {
                const category = "Flowering";
                const title = node.querySelector('.product-link').textContent;
                const link = node.querySelector('.product-link').href;
                const img = node.querySelector('img.block-image').getAttribute('src');
                const zone = loopVal;
                    return {
                        category,
                        title,
                        link,
                        img,
                        zone
                    }
                })
            }, loopVal);
        allPlants.push(...evergreenPlants, ...shadePlants, ...floweringPlants)
        console.log(`Zone ${loopVal} completed`);
    }   
        //stop loop above this; below should only happen at the end

        const fs = require('fs');
        fs.writeFile('./plantData.json', JSON.stringify(allPlants), err => err ? console.log(err): null);  
        
        await browser.close();
    };

scrape();

