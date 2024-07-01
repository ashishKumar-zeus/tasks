
function toggleClassName(itemCalled, classToToggle) {
    const item = document.querySelector(`.${itemCalled}`);
    item.classList.toggle(classToToggle);
}


function showCardsData(cards) {

    const cardsClass = document.querySelector('.cards');

    console.log(cards);

    cards.map(individualCard => {

        const card = document.createElement("div");
        card.className = "individualCard";

        // details 

        const details = document.createElement('div');
        details.className = "details";

        const img = document.createElement('img');
        img.setAttribute('src', individualCard.image);

        // content 

        const content = document.createElement('div');
        content.className = 'content';

        const title = document.createElement('p');
        title.className = "headingOfCards";
        title.setAttribute('style', "font-size: 20px; font-weight: bold;margin-top: 0px;");
        title.innerHTML = individualCard.title;

        const desc = document.createElement('p');
        desc.innerHTML = `${individualCard.subject} &nbsp; | &nbsp;Grade ${individualCard.grade} <span style="color: green;font-weight: bold;">${individualCard.addition}</span>`;

        const divisions = document.createElement('p');
        divisions.innerHTML = `<b>${individualCard.units}</b> Units &nbsp;<b>${individualCard.lessons}</b> Lessons &nbsp;<b>${individualCard.topics}</b> Topics`;


        const select = document.createElement('select');
        individualCard.classesOptions.length > 0 ?
            "" :
            select.setAttribute('disabled', true);
        ;
        select.setAttribute('name', 'classType');
        select.setAttribute('id', 'classType');


        select.innerHTML = `${individualCard.classesOptions.map((classes) => {
            return `<option value="${classes}">${classes}</option>`
        })}`

        individualCard.classesOptions.length > 0 ?
            "" :
            select.innerHTML = `<option value="noClasses">No Classes</option>`;
        ;


        const extraInfo = document.createElement('p');
        extraInfo.innerHTML = `${individualCard.info.totalStudents} Students &nbsp; | &nbsp;${individualCard.info.duration}`;


        content.appendChild(title);
        individualCard.subject ? content.appendChild(desc) : "";
        (individualCard.units > 0 || individualCard.topics || individualCard.lessons) ? content.appendChild(divisions) : "";
        content.appendChild(select);

        (individualCard.info.totalStudents || individualCard.info.duration) ?
            content.appendChild(extraInfo) : "";

        // favorite 

        const starIcon = document.createElement('img');
        starIcon.className = 'favIcon';
        starIcon.setAttribute('src', 'icons/favourite.svg');

        (individualCard.favorite) ?
            starIcon.setAttribute('style', "height: 35px;") :
            starIcon.setAttribute('style', "height: 35px;opacity: 0.2;")

        details.appendChild(img)
        details.appendChild(content)
        details.append(starIcon)

        // operations 

        const operations = document.createElement('div');
        operations.className = 'operations';
        operations.innerHTML = `<img src="icons/preview.svg" style="font-size: 22px;"></img>
                    <img src="icons/manage course.svg" style="font-size: 22px;"></img>
                    <img src="icons/grade submissions.svg" style="font-size: 22px;"></img>
                    <img src="icons/reports.svg" style="font-size: 22px;"></img>`

        const expired = document.createElement('span');
        expired.className = "expired";
        expired.innerHTML = "Expired";

        card.appendChild(details)
        card.appendChild(operations)

        // expired 

        individualCard.expired ? card.appendChild(expired) : ""

        console.log(card)
        cardsClass.appendChild(card);


    });

}

function updateAlerts(alerts) {

    console.log(alerts)

    alerts.map((alert)=>{

        const alertContainer = document.querySelector('.alerts');

        const alertBox = document.createElement('div');
        alertBox.className = 'individualAlert';
        (alert.ticked ? alertBox.classList.add('ticked') : "")
    
        alertBox.innerHTML =
            `<p class="title">${alert.title}</p>
            ${alert.course ? `<p class="information">${alert.course}</p>` : ""}
            <div class="more">
                <p class="time" style="width: 100%;text-align: right;">${alert.time}</p>
            </div>`
    
        console.log(alertBox)
        alertContainer.appendChild(alertBox);
    })

}

function updateAnnouncements(announces) {
    console.log(announces)

    announces.map((announce)=>{

        const announceContainer = document.querySelector('.announce');

        const announceBox = document.createElement('div');
        announceBox.className = 'individualAnnouncements';
        (announce.ticked ? announceBox.classList.add('ticked') : "")
    
        announceBox.innerHTML =
            `<p class="author">PA:<b>${announce.author}</b></p>
            <p class="title">${announce.title}</p>
            <div class="more">
                <p class="file">
                ${announce.files > 0 ? `<span><i style="transform: rotate(-45deg);color: #6E6E6E;" class="fa-solid fa-paperclip"></i></span>` : ""}
                
                ${announce.files > 0 ? announce.files +" files are attached" : ""}</p>
                <p class="time">${announce.time}</p>
            </div>`
    
        console.log(announceBox)
        announceContainer.appendChild(announceBox);
    })
}

document.addEventListener('DOMContentLoaded', () => {

    const cardsData = fetch('data.json').then((res) => {
        return res.json();
    }).then((data) => {
        console.log("successfully fetched json data");
        showCardsData(data.cards);
        updateAlerts(data.alerts);
        updateAnnouncements(data.announcements);

    })


})