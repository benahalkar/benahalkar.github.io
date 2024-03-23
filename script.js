const username = "benahalkar";
const blacklisted_repos = ["info", username];
const resume_path = "docs/Hash_Benahalkar.pdf";

const project_counts = 5;

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';

// document.documentElement.style.cursor = 'none';

// document.addEventListener('mousemove', function(event) {
//     const circle = document.getElementById('circle');
//     const mouseX = event.clientX;
//     const mouseY = event.clientY;
    
//     circle.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
// });

const getRepositories = async (username) => {
    const response = await fetch(`https://api.github.com/users/${username}/repos`);
    const data = await response.json();
    return data;
};


const populateProjectsSection = async () => {
    try {
        const projectsSection = document.querySelector('#projects');
        const repositories = await getRepositories(username);

        let count = project_counts;
        for (let i = 0; i < repositories.length; i++) {
            const repo = repositories[i];
            
            if (blacklisted_repos.indexOf( repo.name) != -1) {
                continue; 
            }

            const repoElement = document.createElement('div');
            repoElement.className = "single_project"; 

            if (repo.description == null) {
                repo.description = repo.name;
            }
            
            repoElement.innerHTML = `
            <a href="${repo.html_url} class="single_project_list" target="_blank">
            <h4 id="project_title">${repo.name}</h4>
            <p id="project_description">${repo.description}</p>
            </a>
            `;
            projectsSection.appendChild(repoElement);
            
            count = count - 1;
            
            if (count == 0) {
                break;
            }
        }
    } catch (error) {
        console.error('Error fetching repositories:', error);
    }
};

function readPDFFile(filePath) {
    return pdfjsLib.getDocument(filePath)
        .promise.then(function(pdf) {
            return pdf.getPage(1)
                .then(function(page) {
                    return page.getTextContent();
                })
                .then(function(textContent) {
                    let firstPageText = '';

                    textContent.items.forEach(function (textItem) {
                        firstPageText += textItem.str + ' ';
                    });

                    return firstPageText;
                });
        })
        .catch(function(error) {
            return null;
        });
}

async function parseWorkExperienceAsync(text) {
    return new Promise((resolve, reject) => {
        try {
            const experiences = [];
            const lines = text.split('\n');
            let currentExperience = null;

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();

                if (line.startsWith('•')) {
                    if (currentExperience !== null) {
                        experiences.push(currentExperience);
                    }

                    currentExperience = {
                        title: line.slice(1).trim(),
                        details: []
                    };
                } else if (currentExperience !== null) {
                    currentExperience.details.push(line);
                }
            }

            if (currentExperience !== null) {
                experiences.push(currentExperience);
            }

            resolve(experiences);
        } catch (error) {
            reject(error);
        }
    });
}

  

document.addEventListener('DOMContentLoaded', function() {
    
    populateProjectsSection();

    // // Call the parsePDF function with the URL of your PDF file
    // const pdfUrl = 'docs/Harsh_Benahalkar.pdf';
    // readPDFFile(pdfUrl)
    //     .then(function(text){
    //         console.log("text", text)
    //         let workExpRegex = /WORK EXPERIENCE([\s\S]*?)\b[A-Z]+\b/g;
    //         let workExpMatches = workExpRegex.exec(text);
    //         let workExperience = workExpMatches ? workExpMatches[1].trim() : "Work experience section not found.";
    //         console.log(workExperience);

    //     })
    //     .catch(function(error){
    //         console.error(error);
    //     });

    const tabLinks = document.querySelectorAll('.tab-link');
    
    tabLinks.forEach(function(tabLink) {
        tabLink.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                console.log("done");
            }
            else {
                console.log("not");
            }
        });
    });


});