const formContainer = document.querySelector('.modal-layout');
const form = document.querySelector('#submit-form');
form.onsubmit = (e)=> {
    e.preventDefault();
}
const bookListContainer = document.querySelector('#book-list');
const toBookList = [
    {
        cookie: '1233',
        book_id: 0,
        location: 'hervanta',
        date: '2022-06-10',
        booking_details: [
          {
            start_time: 11,
            court_nums: [4, 5]
          },
          {
            start_time: 12,
            court_nums: [5]
          },
          {
            start_time: 15,
            court_nums: [2, 3]
          },
          {
            start_time: 16,
            court_nums: [2]
          }
        ],
      },
      {
        book_id: 1,
        location: 'hervanta',
        date: '2022-06-12',
        booking_details: [
          {
            start_time: 11,
            court_nums: [4, 5]
          },
          {
            start_time: 12,
            court_nums: [5]
          }
        ],
      },
];

function inputFormToggle(option) {
    if (formContainer) {
        if (formContainer.style.display == 'none' || getComputedStyle(formContainer).display == 'none') {
            // show the form
            formContainer.style.display = 'flex';

            // handle btn
            inputFormBtnToggle(option);
        }
        else {
            // close the form
            formContainer.style.display = 'none';
            // reset input form to default
            renderInputForm({});
        }
    }
}

function inputFormBtnToggle(option) {

    const addNewBtn = document.querySelector("#add-new-btn");
    const editBtn = document.querySelector("#edit-btn");

    if (option == 1) { // show add new btn, hide edit btn
        addNewBtn.style.display = "block";
        editBtn.style.display = "none";
    }
    else if (option == 2) { // show edit btn, hide add new btn
        editBtn.style.display = "block";
        addNewBtn.style.display = "none";
    }
}

function addNewDetail() {
    // details container
    const lastDetailContainer = document.querySelector('.form-container--detail > .detail-container:last-child');

    lastDetailContainer.insertAdjacentHTML("afterend", `
        <div class="detail-container">
        <div class="del-detail-btn">
            <i class="fa-solid fa-minus"></i>
        </div>
        <div class="form-group">
            <label for="time" class="form-label form-label--sub">Time:</label>
            <select name="time" class="form-control form-control--sub">
                <option value="6">6 am</option>
                <option value="7">7 am</option>
                <option value="8">8 am</option>
                <option value="9">9 am</option>
                <option value="10">10 am</option>
                <option value="11">11 am</option>
                <option value="12">12 pm</option>
                <option value="13">1 pm</option>
                <option value="14">2 pm</option>
                <option value="15">3 pm</option>
                <option value="16">4 pm</option>
                <option value="17">5 pm</option>
                <option value="18">6 pm</option>
                <option value="19">7 pm</option>
                <option value="20">8 pm</option>
                <option value="21">9 pm</option>
                <option value="22">10 pm</option>
            </select>
            <span class="form-message"></span>
        </div>

        <p class="form-label">Courts:</p>
        <div class="form-group form-group--sub">
            <div class="checkbox-group">
                <div class="checkbox-container">
                    <input name="court1" type="checkbox" class="form-control checkbox-item" value="1">
                    <label for="court1" class="checkbox-label">Court 1</label>
                </div>
                <div class="checkbox-container">
                    <input name="court2" type="checkbox" class="form-control checkbox-item" value="2">
                    <label for="court2" class="checkbox-label">Court 2</label>
                </div>
                <div class="checkbox-container">
                    <input name="court3" type="checkbox" class="form-control checkbox-item" value="3">
                    <label for="court3" class="checkbox-label">Court 3</label>
                </div>
            </div>

            <div class="checkbox-group">
                <div class="checkbox-container">
                    <input name="court4" type="checkbox" class="form-control checkbox-item" value="4">
                    <label for="court4" class="checkbox-label">Court 4</label>
                </div>
                <div class="checkbox-container">
                    <input name="court5" type="checkbox" class="form-control checkbox-item" value="5">
                    <label for="court5" class="checkbox-label">Court 5</label>
                </div>
                <div class="checkbox-container">
                    <input name="court6" type="checkbox" class="form-control checkbox-item" value="6">
                    <label for="court6" class="checkbox-label">Court 6</label>
                </div>
            </div>
            <span class="form-message"></span>
        </div>
    </div>`);

    // add delete option to detail
    deleteDetail();
}

function deleteDetail() {
    // get list of delete detail button
    let deleteDetailBtns = document.querySelectorAll('.del-detail-btn');

    // turn nodelist to array
    deleteDetailBtns = Array.from(deleteDetailBtns);

    // add delete when delete button is clicked
    deleteDetailBtns.forEach(btn => {
        btn.onclick = e => {
            const container = e.target.closest(".detail-container");
            container.remove();
        }
    })
}


function addNewOption() {

    let formValues;


    const isValid = Validator({
        form: '#submit-form',
        rules: [
            Validator.isRequired('#cookie'),
            Validator.isRequired('#date'),
            Validator.isUnique('#date', toBookList, 'date')
        ]
    })

    if (isValid) {

        // if there is a form
        if (form) {
            // Retrieve all the inputs
            const inputs = form.querySelectorAll('[name]');
    
            // handle input that is not related to time and courts
            formValues = Array.from(inputs).reduce(function(values, input) {
                if (input.name !== 'time' && !input.name.includes('court')) {
                    values[input.name] = input.value
                }
    
                return values;
            }, {});
    
            // handle booking details
            const detailContainers = form.getElementsByClassName('detail-container');
    
            formValues['booking_details'] = [];
    
            const detailOption = formValues['booking_details'];
    
            Array.from(detailContainers).forEach((detailContainer) => {
                const childs = detailContainer.querySelectorAll('[name]');
                const childValues = Array.from(childs).reduce((childObject, child) => {
                    if (child.type == 'checkbox') {
                        if (!childObject['court_nums']) {
                            childObject['court_nums'] = [];
                        }
    
                        if (child.matches(':checked')) {
    
                            childObject['court_nums'].push(parseInt(child.value));
                        }
                    }
                    else {
    
                        childObject['start_' + child.name] = parseInt(child.value);
                    }
                    return childObject;
                }, {})
    
                detailOption.push(childValues);
            })
        }
    
    
        // push the formValues to the toBookList
        toBookList.push(formValues);
        // generate a new id
        toBookList.at(-1)["book_id"] = toBookList.indexOf(toBookList.at(-1));
        console.log(toBookList)
    
    
        // then close the addNew form
        inputFormToggle(0);
    
        // reset input form to default
        renderInputForm({});
    
        // then re-render the booklist view
        renderBookList();
    
        // add edit function
        handleBookListItem();
    }

}

function renderBookList() {
    // if there is book list container
    if (bookListContainer) {

        // first, turn option object into html
        const newToBookList = toBookList.map(option => {

            const newBookingDetails = option.booking_details.map((detail, i) => {

                return `
                <p class="body-item book-detail">
                    <span class="book-detail__item">Option ${i + 1}: ${detail.start_time > 12 ? detail.start_time - 12 : detail.start_time} ${detail.start_time >= 12 ? 'pm' : 'am'}</span>
                    <span class="book-detail__item">Courts: ${detail.court_nums.join(', ')}</span>
                </p>`
            })

            const bookingDetailsHTML = newBookingDetails.join('');

            return `
            <div class="book-list__item" book_id="${option.book_id}">
                <div class="book-list__heading">
                    <h4 class="book-location">${option.location.toUpperCase()}</h4>
                    <div class="book-list__btns">
                        <div class="book-list__delete">
                            <i class="fa-solid fa-trash-can"></i>
                        </div>
                        <div class="book-list__edit">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </div>
                    </div>
                </div>
                <div class="book-list__body">
                    <p class="body-item book-date">Date: ${option.date}</p>
                    ${bookingDetailsHTML}
                </div>
            </div>`
        })

        const toBookListHTML = newToBookList.join('');


        // append new option to the list
        bookListContainer.innerHTML = toBookListHTML;

    }
}

function renderInputForm(listItem) {

    // find container
    if (form) {
        // render input to view
        // if object is empty, then reset the view to original view
        if (isEmptyObject(listItem)) {

            //First delete all time and courts input except 1
            const timeAndCourtsList = form.querySelectorAll('.form-container .form-container--detail .detail-container');

            Array.from(timeAndCourtsList).forEach((timeAndCourtsItem, i) => {
                if (i !== 0) {
                    timeAndCourtsItem.parentElement.removeChild(timeAndCourtsItem);
                }
            })

            // Retrieve all the inputs
            const inputs = form.querySelectorAll('[name]');

            // handle input that is not related to time and courts
            Array.from(inputs).forEach((input)=> {
                if (input.name !== 'time' && !input.name.includes('court')) {
                    // if it is select tag
                    if (input.tagName === 'SELECT') {
                        input.selectedIndex = "0";
                    }
                    else {
                        input.value = "";
                    }
                }
                else {

                    // if it is select tag
                    if (input.tagName === 'SELECT') {
                        input.selectedIndex = "0";
                    }
                    else if (input.type == 'checkbox') {
                        input.checked = false;
                    }
                }
            })
        }
        else { // if the input object is not empty then render the view with the input info

            // Add times and courts template first
            listItem.booking_details.forEach((detail, i) => {
                if (i !== 0)
                    addNewDetail()
            })

            // Retrieve all the inputs
            const inputs = form.querySelectorAll('[name]');


            Array.from(inputs).forEach((input)=> {

                // handle input that is not related to time and courts
                if (input.name !== 'time' && !input.name.includes('court')) {
                    for (const item in listItem) {
                        if (item === input.name) {
                            input.value = listItem[item];
                        }
                    }
                }
            })

            // handle booking details
            const detailContainers = form.getElementsByClassName('detail-container');

            Array.from(detailContainers).forEach((detailContainer, index) => {

                // get time and courts from detail container
                const childs = detailContainer.querySelectorAll('[name]');

                Array.from(childs).forEach(child => {

                    listItem.booking_details.forEach((detail, bookingIndex) => {
                        if (index == bookingIndex) {
                            // render time
                            if (child.name === 'time') {
                                child.value = detail.start_time;
                            }
                            else if (child.name.includes('court')) {
                                const extractedNumFromCourt = parseInt(child.name.substring('court'.length));

                                detail.court_nums.forEach(court_num => {
                                    if (court_num === extractedNumFromCourt) {
                                        child.checked = "true";
                                    }
                                })
                            }
                        }
                    })
                })
            })
        }
    }
}

function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
}

function getParent(element, selector) {
    while (element.parentElement) {
        if (element.parentElement.matches(selector)) {
            return element.parentElement;
        }
        element = element.parentElement;
    }
}

function handleBookListItem() {
    // get list of edit detail button
    const editDetailBtns = document.querySelectorAll('.book-list__edit');
    const deleteDetailBtns = document.querySelectorAll('.book-list__delete');

    Array.from(editDetailBtns).forEach(editDetailBtn => {
        editDetailBtn.onclick = e => {
            let parent = e.target;
            parent = getParent(parent, '[book_id]')

            // open the specific item from bookList
            if (parent.hasAttribute("book_id")) {
                const id = parseInt(parent.getAttribute("book_id"));

                // loop through toBooklist to find the item with the id
                const target = toBookList.find(toBookItem => {
                    return toBookItem?.book_id === id;
                })

                // render the specific item
                renderInputForm(target);

                // open the input form
                inputFormToggle(2);

                // add edit function to the edit btn
                const editBtn = form.querySelector("#edit-btn");
                editBtn.onclick = () => {
                    editInputForm(id);
                }

            }
        }
    })

    Array.from(deleteDetailBtns).forEach(deleteDetailBtn => {
        deleteDetailBtn.onclick = e => {
            let parent = e.target;
            parent = getParent(parent, '[book_id]')

            // open the specific item from bookList
            if (parent.hasAttribute("book_id")) {
                const id = parseInt(parent.getAttribute("book_id"));

                // delete Book Item from Booklist with the id
                deleteBookItemFromBookList(id);

            }
        }
    })
}

function editInputForm(id) {

    // get values of the input
    let formValues;
    const isValid = Validator({
        form: '#submit-form',
        rules: [
            Validator.isRequired('#cookie'),
            Validator.isRequired('#date'),
            Validator.isUnique('#date', toBookList, 'date')
        ]
    })

    if (isValid) {
        
        // if there is a form
        if (form) {
            // Retrieve all the inputs
            const inputs = form.querySelectorAll('[name]');
    
            // handle input that is not related to time and courts
            formValues = Array.from(inputs).reduce(function(values, input) {
                if (input.name !== 'time' && !input.name.includes('court')) {
                    values[input.name] = input.value
                }
    
                return values;
            }, {});
    
            // handle booking details
            const detailContainers = form.getElementsByClassName('detail-container');
    
            formValues['booking_details'] = [];
    
            const detailOption = formValues['booking_details'];
    
            Array.from(detailContainers).forEach((detailContainer) => {
                const childs = detailContainer.querySelectorAll('[name]');
                const childValues = Array.from(childs).reduce((childObject, child) => {
                    if (child.type == 'checkbox') {
                        if (!childObject['court_nums']) {
                            childObject['court_nums'] = [];
                        }
    
                        if (child.matches(':checked')) {
    
                            childObject['court_nums'].push(parseInt(child.value));
                        }
                    }
                    else {
    
                        childObject['start_' + child.name] = parseInt(child.value);
                    }
                    return childObject;
                }, {})
    
                detailOption.push(childValues);
            })
    
        }
    
        // loop through toBooklist to find the item with the id
        const target_id = toBookList.findIndex(toBookItem => {
    
            return toBookItem?.book_id === id;
        })
    
        // assign new status
        toBookList[target_id] = formValues;
        toBookList[target_id].book_id = id;
    
        // then close the addNew form
        inputFormToggle(0);
    
        // reset input form to default
        renderInputForm({});
    
        // then re-render the booklist view
        renderBookList();
    
        // add edit and delete function
        handleBookListItem();
    }

}

// handle delete list item
function deleteBookItemFromBookList(id) {

    // loop through toBooklist to find the item with the id
    const target_id = toBookList.findIndex(toBookItem => {

        return toBookItem?.book_id === id;
    })

    // delete the item with the specific id
    toBookList.splice(target_id, 1);

    // generate new id for list items
    toBookList.forEach((e, i) => {
        e["book_id"] = i;
    })

    // re-render book list
    renderBookList();

    // add edit and delete function
    handleBookListItem();
}

const baseURL = 'http://ec2-54-254-130-78.ap-southeast-1.compute.amazonaws.com:1999';

// handle submit tobooklist to server
let socket;
let firstTime = true;
async function submitForm(target) {
    console.log(toBookList);

    printToScreen('Start booking...')

    
    if (firstTime) {
        // socket = io("http://localhost:3000");
        socket = io(baseURL);
        firstTime = false;
    }
    else {
        socket.connect()
    }
    socket.on('result log', (msg) => {
        console.log(msg);
        printToScreen(msg)
    })

    disableBtn(target)
    enableBtn(document.querySelector('#end-btn'))


    // send to server with post method
    const url = baseURL + '/book';
    let data = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(toBookList)
    })

    data = await data.json();

    console.log(data);
    if (data.status == 'OK' && data.isStop == true) {
        printToScreen('Booking force stopped!')
    }
    else if (data.status == 'OK' && data.isStop == false) {
        printToScreen('Max court number (3 courts) exceeded!')
        printToScreen('Booking finished!')
    }
    enableBtn(target);
}

// stop booking
async function stopBooking(target) {
    const url = baseURL + '/stop';
    let data = await fetch(url);

    data = await data.json();
    if (data.status == 'OK') {
        printToScreen('Stop booking request sent!');

        if (socket != undefined && socket.connected) {

            socket.off();
            socket.disconnect()
        }

        disableBtn(target);
    }
    console.log(data);
    





    // scroll to bottom
    scrollToBottom();
}

// handle logging result to the result log
function printToScreen(message) {
    // get the result log placeholder
    const insertPosition = document.getElementById('result-log-placeholder');
    const newInsertPosition = document.querySelectorAll('.result-log__body > .result-log__content:last-child');
    console.log(newInsertPosition.length)

    // check type of msg
    if (typeof message == 'string') {

        // convert message to html
        message = `<pre class="result-log__content">${message}</pre>`
    }
    else if (typeof message == 'object') {

        message = JSON.stringify(message, null, 2);
        // convert message to html
        message = `<pre class="result-log__content">${message}</pre>`
    }

    // console.log(message)

    // append message to the resut log
    if (newInsertPosition.length <= 0) {

        insertPosition.insertAdjacentHTML("afterend", message);
    } else {

        newInsertPosition[0].insertAdjacentHTML("afterend", message);
    }

    // scroll to Bottom
    scrollToBottom();
}

// clear log
function clearLog() {
    const container = document.querySelector('.result-log__body');

    container.innerHTML = '<span id="result-log-placeholder"></span>';
}

function scrollToBottom() {
    const container = document.querySelector('.result-log__body');
    container.scrollTop = container.scrollHeight;
}

function disableBtn(btn) {
    btn.disabled = true;
}

function enableBtn(btn) {
    btn.disabled = false;
}

