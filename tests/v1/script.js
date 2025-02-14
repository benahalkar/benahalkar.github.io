
/*
    Harsh Benahalkar
    Javascript file for custom profile website
    created on 29th January 2025
*/



// ====================================================================================
// Variables
// ====================================================================================

// github username
const GITHUB_USERNAME = "benahalkar"

// number of projects to display on the webpage
const NUM_PROJECTS = 6;

// define modes for themes
const BROWSER_MODES = ["dark", "blue", "light", "grey"];

// minimum delay for loading screen
const MIN_LOADING_DELAY = 3000;

// theme values to change
// TODO: add more values here
const BROWSER_MODES_CSS = {
    "light": {
        "body_color_0": "#FFFFFF",
        "body_color_1": "#F5F5F5",
        "main_text_color": "#000000",
        "alternate_text_color": "#FFFFFF",
        "highlight_color": "#00BCD4",
        "contact_colors": ["#FF6659", "#64B5F6", "#81C784", "#FFF176", "#BA68C8", "#BDBDBD", "#FFB74D"] 
    },
    "grey": {
        "body_color_0": "#C9C6C6",
        "body_color_1": "#D4D1D1",
        "main_text_color": "#000000",
        "alternate_text_color": "#FFFFFF",
        "highlight_color": "#00BCD4",
        "contact_colors": ["#FF6659", "#64B5F6", "#81C784", "#FFF176", "#BA68C8", "#BDBDBD", "#FFB74D"] 
    },
    "dark": {
        "body_color_0": "#000000",
        "body_color_1": "#121212",
        "main_text_color": "#FFFFFF",
        "alternate_text_color": "#000000",
        "highlight_color": "#8BC34A",
        "contact_colors": ["#D32F2F", "#1976D2", "#388E3C", "#E64A19", "#7B1FA2", "#757575", "#FBC02D"]
    },
    "blue": {
        "body_color_0": "#000844",
        "body_color_1": "#020A50",
        "main_text_color": "#FFFFFF",
        "alternate_text_color": "#000000",
        "highlight_color": "#8BC34A",
        "contact_colors": ["#D32F2F", "#1976D2", "#388E3C", "#E64A19", "#7B1FA2", "#757575", "#FBC02D"]
    }
}





// load pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.worker.min.js';

// separator for work experience
const EXPR_SEP = "@"

// ====================================================================================
// Functions
// ====================================================================================




/**
 * Changes the browser theme based on the provided mode.
 * @param {string} theme - The current mode to set ('light', 'dark', 'grey', 'blue').
 */
async function setBrowserTheme(theme) {
    console.log(`Theme changed to ${theme}`);
    
    // checks if the mode provided exists or not
    if (! BROWSER_MODES.includes(theme)) {
        error(`Unknown mode "${theme}" found`);
        return;
    }

    if (! theme in BROWSER_MODES_CSS) {
        error(`Cannot find mode "${theme}" in CSS templates`);
        return;
    }

    const css_template = BROWSER_MODES_CSS[theme];

    // change theme name on the theme button
    // TODO: change this to icon
    const themeButton = document.getElementById("theme-button")
    themeButton.innerText = theme;
    
    // set background theme to different divs inside the body
    document.querySelectorAll("#content-sections > div").forEach((section, index) => {
        section.style.background = css_template[`body_color_${index % 2}`];
        section.style.color = css_template["main_text_color"];
    });

    // set background colors for each contact icon
    document.querySelectorAll(".contact_icons a").forEach((link, index) => {
        let numColors =  css_template["contact_colors"].length
        link.style.backgroundColor = css_template["contact_colors"][index % numColors]; // Assign color from the array
    });

    // set footer properties
    const footer = document.getElementById("footer");
    footer.style.backgroundColor = css_template["highlight_color"];
    footer.style.color = css_template["alternate_text_color"];



    // TODO: complete this
}

async function parseLinkedInPDF() {
    try {
        const pdf = await pdfjsLib.getDocument('../linkedin.pdf').promise;
        const numPages = pdf.numPages;
        let allContent = "";
  
        for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();

            // removing the first 4 and last 7 items as they contain redundant information like page numbers and spaces
            let content = textContent.items.slice(4, -7);
            
            // removing the lines that don't contain any data
            content = content.filter(obj => obj && typeof obj === "object" && obj["str"] !== "");
            
            allContent += content.map(item => item.str.trim()).join(EXPR_SEP);
            
            // if (text.includes('Experience')) {
            //     isExperienceSection = true;
            // }
    
            // if (isExperienceSection) {
            //     const experienceEntries = text.split(/\n\s*\n/);
            //     console.log()
            //     for (const entry of experienceEntries) {
            //         if (entry.match(/^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/)) {
            //             const lines = entry.split('\n');
            //             const company = lines[0].trim();
            //             const position = lines[1]?.trim();
            //             const duration = lines[2]?.trim();
                    
            //             if (company && position && duration) {
            //                 workExperience.push({ company, position, duration });
            //             }
            //         }
            //     }
            // }
    
            // if (text.includes('Education')) {
            //     break; // Stop parsing after reaching the Education section
            // }
        }

        allContent = allContent.match(/Experience([\s\S]*?)Education/)[1].split(EXPR_SEP);
        console.log("allContent", allContent);
    
        let workExperience = [];
        return workExperience; 
    } catch (error) {
        console.error('Error parsing PDF:', error);
        return [];
    }
}

/**
 * Extracts tab button labels and their associated data-tab values 
 * from the div with ID "large-screen-tabs".
 *
 * @returns {Array} An array of objects, where each object contains:
 *   - label: The button's visible text (e.g., "Tab 1").
 *   - value: The button's data-tab attribute (e.g., "tab1").
 */
async function getTabOptions() {
    // Select the parent div
    const tabContainer = document.getElementById("large-screen-tabs");

    // Select all tab buttons inside the div
    const tabButtons = tabContainer.querySelectorAll(".tab-button");

    // Extract button text and data-tab values
    return Array.from(tabButtons).map(button => ({
        label: button.innerText,   // Gets the visible text (e.g., "Tab 1")
        value: button.getAttribute("data-tab") // Gets the data-tab value (e.g., "tab1")
    }));
}


/**
 * Dynamically adds buttons to a side panel based on the provided options.
 * Each button is created with the label from the options array and appended to
 * the panel content container. Existing buttons are cleared before adding the new ones.
 *
 * @param {Array} options - An array of objects containing the data for the buttons.
 * Each object should have a `label` property, which will be used as the text for the button.
 *
 * @returns {void} This function does not return any value.
 */
async function addTabsToPanel(options) {

    // console.log(options);

    // Get the panel content container
    let panelContent = document.getElementById("small-screen-panel");

    // Clear existing buttons (to prevent duplicates)
    panelContent.innerHTML = "";

    // Dynamically create buttons
    options.forEach(name => {
        let btn = document.createElement("button");
        btn.innerText = name.label;
        btn.className = "panel-button";
        panelContent.appendChild(btn);
    });

}


/**
 * Fetches the last commit date of a GitHub repository.
 * 
 * @returns {Promise<string>} - A promise that resolves to the last commit date.
 */
async function getLastCommitDate() {
    const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_USERNAME}/commits`;

    const response = await fetch(url);
    const commits = await response.json();
    let date = new Date(commits[0].commit.author.date);

    // Get day, month, and year
    let day = date.getUTCDate();
    let month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
    let year = date.getUTCFullYear();

    // Add "th", "st", "nd", "rd" suffix to the day
    let suffix = (day % 10 === 1 && day !== 11) ? "st" :
                 (day % 10 === 2 && day !== 12) ? "nd" :
                 (day % 10 === 3 && day !== 13) ? "rd" : "th";

    // Ensure two-digit day format (01, 02, ... 09, 10, 11, etc.)
    let formattedDay = day < 10 ? `0${day}` : day;

    date = `${formattedDay}${suffix} ${month} ${year}`;
    
    // console.log("date >>", date);
    return date; // Return last commit date
}


/**
 * Fetches a list of public repositories for a given GitHub user.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of repository objects.
 * @throws {Error} If the request fails.
 *
 * @example
 * const GITHUB_USERNAME = "lemonhead";
 * getGitHubRepositories()
 *     .then(repos => console.log(repos))
 *     .catch(error => console.error(error));
 */
async function getGitHubRepositories() {
    const url = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch repositories: ${response.statusText}`);
        }

        return await response.json(); // Returns an array of repository objects
    } catch (error) {
        throw new Error(`Error fetching repositories: ${error.message}`);
    }
}


/**
 * Loads a GitHub profile image as a JavaScript Image object.
 * @function loadGitHubImage
 * @returns {Promise<HTMLImageElement>} A promise that resolves to an Image object if the image loads successfully.
 * @throws {Error} If the image fails to load.
 * 
 * @example
 * const GITHUB_USERNAME = "lemonhead";
 * loadGitHubImage().then(img => {
 *     document.body.appendChild(img);
 * }).catch(error => {
 *     console.error(error);
 * });
 */
function loadGitHubImage() {
    let profile_url = `https://github.com/${GITHUB_USERNAME}.png`;

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image at ${profile_url}`));
        img.src = profile_url;
    });
}


/**
 * checks if default browser mode "dark" or "light" 
 * @returns {string} dark/light
 */
function getBrowserMode() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
}


/**
 * Fetches the README file contents from a GitHub repository.
 *
 * @returns {Promise<string>} A promise that resolves to the README content in plain text.
 * @throws {Error} If the request fails or the README is not found.
 *
 * @example
 * const GITHUB_USERNAME = "lemonhead";
 * getGitHubReadme()
 *     .then(content => console.log(content))
 *     .catch(error => console.error(error));
 */
async function getGitHubReadme() {
    const readme_url = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_USERNAME}/readme`;
    
    try {
        const response = await fetch(readme_url, {
            headers: { Accept: "application/vnd.github.v3.raw" } // Get raw Markdown content
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch README: ${response.statusText}`);
        }

        // console.log(response);

        return await response.text();
    } catch (error) {
        throw new Error(`Error fetching README: ${error.message}`);
    }
}


function preprocessAboutREADME(content) {
    try {
        // console.log(content);

        // extract the content
        let parts = content.split('<div id="about">');

        if (parts.length > 1) {
            let aboutText = parts[1].split('</div>')[0].trim();
            
            // add more space for visual clarity
            aboutText = aboutText.split("<br>").join("<br><br>");
            // console.log("aboutText >>\n", aboutText);
            
            // TODO: Add code to parse links
            // TODO: Add code to parse bold characters

            let p = document.getElementById("about-content");
            if (p) {
                p.innerHTML = aboutText;
            }
            else {

                console.log("Cannot find element p");
            }

        } else {
            // console.log("aboutText>>", "ERROR!");
            return 'About section not found in README.';
        }
    } catch (error) {
        throw new Error(`Error setting README: ${error.message}`);
    }
}



function preprocessGitRepos(repositories) {
    // console.log(repositories);

    if (repositories.length > 1){
        repositories = repositories
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Sort by created_at in descending order
            .slice(0, NUM_PROJECTS);

        // console.log(repositories);


    } 
    else {
        error("Invalid number of repositories returned");
    }
}


// ====================================================================================
// Main code
// ====================================================================================


document.addEventListener('DOMContentLoaded', function() {

    // start loading screen animations
    let currentAngle = 0;
    let currentProgress = 0;
    const loadingIntervalID = setInterval(() => {
        const image = document.getElementById("loading-image");
        image.style.transform = `rotate(${currentAngle % 360}deg)`;
        currentAngle += 5;

        const progressBar = document.getElementById("progress-bar");
        progressBar.style.width = currentProgress + "%";
        if (currentProgress <=+ 100){
            currentProgress += Math.min(10, 100 - currentProgress);
        } 

    }, 100);

    // load about section from github readme
    const readmePromise = getGitHubReadme().then(
        content => preprocessAboutREADME(content)
    ).catch(error => console.error(error));


    // load profile picture
    const imagePromise = loadGitHubImage().then(
        img => document.getElementById("about-picture").appendChild(img)
    ).catch(error => console.error(error));


    // update footer
    const footerPromise = getLastCommitDate().then(
        date => document.getElementById("footer").innerHTML += `. Last changed on ${date}.`
    ).catch(error => console.error(error));


    // update menu options for side pane 
    const tabsPromise = getTabOptions().then(
        options => addTabsToPanel(options)
    ).catch(error => console.error(error));


    // repositories for the project section
    const reposPromise = getGitHubRepositories().then(
        repos => preprocessGitRepos(repos)
    ).catch(error => console.error(error));

    // Usage
    // parseLinkedInPDF().then(experience => {
    //     console.log('Work Experience:', experience);
    //     // Here you can further process or display the extracted work experience
    // });

    // Simulate a minimum delay to be completed before page is loaded
    const delayTaskPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(); // Mark task as done
        }, MIN_LOADING_DELAY); // Simulating a delay
    });

    // Get the element by its ID
    const button = document.getElementById("side-panel-button");

    // Add an event listener for the 'click' event
    button.addEventListener("click", function() {
        var sidepanel = document.getElementById("small-screen-panel");
        // If sidepanel is open, close it; if it's closed, open it
        if (sidepanel.style.width === "250px") {
            sidepanel.style.width = "0";
        } else {
            sidepanel.style.width = "250px";
        }
    });

    document.getElementById("theme-button").addEventListener("click", function() {
        mode = BROWSER_MODES[(BROWSER_MODES.indexOf(mode) + 1) % BROWSER_MODES.length];
        setBrowserTheme(mode);
    });

    // set browser theme mode
    let mode = getBrowserMode();
    setBrowserTheme(mode);

    // remove the loading screen after all content is loaded
    Promise.all([
        readmePromise, 
        delayTaskPromise, 
        imagePromise,
        footerPromise,
        tabsPromise
    ]).then(() => {
        let loadingScreen = document.getElementById("loading-screen");
        let content = document.getElementById("content");

        // Show content after loading
        content.style.display = "block";    

        // Move the loading screen up
        loadingScreen.style.transform = "translateY(-100%)";

        // Optional: Remove the loading screen from DOM after animation
        setTimeout(() => {
            // loadingScreen.style.display = "none";
            loadingScreen.remove();
        }, 800);

        // stop loading screen animations
        clearInterval(loadingIntervalID);
    });
});

