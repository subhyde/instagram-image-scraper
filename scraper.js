//adding user input
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

    const fsExtra = require('fs-extra'); // used to delete images after zip
    const fs = require('fs');
    const puppeteer = require('puppeteer'); // used to grab images and autoscroll
    const zipFolder = require('zip-a-folder'); // used to zip files for download



startscreen(); //starts program


function startscreen(){
    rl.question('Choose a selection:\nPress(1) Start scrape\nPress(2) Info\n',answer => {
        if(answer === '1'){


            getusername()
        }
        if(answer === '2'){
            console.log("Program Version 0.0.2\n" +
                "Created by Ethan Johnson\n" +
                "---tips---\n" +
                "photos will auto delete after a successful scrape. They will be held in a zip file after completion\n" +
                "The Scraper will NOT work if the user is private (hence no data to scrape)\n");
            startscreen();
        }

    });
}



function getusername(){

    rl.question('Please Enter the Username of the Instagram Account you would like to scrape:\n', answer => {

    let instagramurl = "https://instagram.com/"+answer+"/";
        console.log("scraping images...");
        rl.close();
        startscrape(instagramurl);


});


function startscrape(instagramurl) {
    (async () => {


//launches the headless browser
        let browser = await puppeteer.launch(({headless: false}));
        let page = await browser.newPage();
        let counter = 0;
//finds all the files that contain jpeg in their url and saves them to the image folder



        await page.goto(instagramurl);


//waits for page to fully load before scrolling and collecting the images

        await page.waitFor(1000);
        await autoScroll(page);


//grabbing data from the insagrams user profile: name, followers ect.



       await page.evaluate(() => {

            //doesnt currently work, finding a work around

           // if (document.querySelector('.error-container')) {
           //     console.log("sorry this is an invalid username");
             //   getusername();
          //  }


            let username = document.querySelector('._7UhW9').innerText;

               // let name = document.querySelector('.rhpdm').innerText;



            return {
                username

            }

        });
        page.on('response', async (response) => {

            const matches = /.*\.fbcdn*....$/.exec(response.url());
            if (matches) {


                const buffer = await response.buffer();
                fs.writeFileSync(`images/image-${counter}.jpeg`, buffer, 'base64'); //adds the jpeg extension to every image saved

                counter += 1; //adds +1 to each file saved
                console.log("image: " + counter + ' saved'); // logs every image saved

            }
        });




//zips the files into the local folder

        class ZipAFolder {

            static main() {
                //gets the username and creates a zip from it
                console.log("zipping images to a file...");
                let zipname = (instagramurl.split('/'));
                zipFolder.zipFolder('images', `zip/${zipname[3]}.zip`, function (err) {
                    if (err) {
                        console.log('Something went wrong!', err);
                    }
                });
                console.log("done zipping!");
                console.log("deleting leftover images...");
                setTimeout(cdelete, 10000);

                function cdelete(){
                    fsExtra.emptyDirSync('images');

                }
            }
        }

        ZipAFolder.main();


        await browser.close();
        console.log("done!");
        startscreen();


    })();




}}




//auto scroll function, set to 400 || this is less fast but will work on most internet speeds
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
