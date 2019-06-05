

//html functions
//document.getElementById('instagram').addEventListener("click", function () {
    const fs = require('fs');
    const puppeteer = require('puppeteer');
    const zipFolder = require('zip-a-folder');
   let instagramurl = 'https://www.instagram.com/wickedclothes/';
       //document.getElementById('instagram').value;


(async () =>{



let browser = await puppeteer.launch(({headless:false}));
let page = await browser.newPage();
let counter = 0;

        page.on('response', async (response) => {
        const matches = /.*\.(jpeg)*...$/.exec(response.url());
        if (matches && (matches.length === 2)) {

            const buffer = await response.buffer();
            fs.writeFileSync(`images/image-${counter}.${'jpeg'}`, buffer, 'base64');
            counter += 1;
        }
    });
await page.goto(instagramurl);

    await page.waitFor(1000);
    await autoScroll(page);



    let data =  await page.evaluate(() =>{

let username = document.querySelector('._7UhW9').innerText;
let name =  document.querySelector('.rhpdm').innerText;



return{
    username,
    name
}

    });

console.log(data);
    class ZipAFolder {

        static main() {
            zipFolder.zipFolder('images', 'test/test.zip‎', function(err) {
                if(err) {
                    console.log('Something went wrong!', err);
                }
            });
        }
    }

    ZipAFolder.main();
await browser.close();




})();
async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            let distance = 100;
            let timer = setInterval(() => {
                let scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 400);
        });
    });
}

//});

