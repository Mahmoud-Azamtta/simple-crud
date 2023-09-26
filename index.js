var courseName = document.getElementById("courseName");
var courseCategory = document.getElementById("courseCategory");
var coursePrice = document.getElementById("coursePrice");
var courseDesc = document.getElementById("courseDescription");
var courseCapacity = document.getElementById("courseCapacity");
var inputs = document.querySelectorAll(".inputs");
var table = document.querySelector(".table #data");
var deleteBtn = document.querySelector("#deleteBtn");
var deleteButtons = [];
var updataButton = [];
var search = document.querySelector("#search");
var form = document.querySelector("form");


var inputStates = [];
for (var i = 0; i < inputs.length; i++) {
    inputStates.push(false);
}

var courses = [];
getCourses();

var submitBtn = document.getElementById("submit");
submitBtn.addEventListener("click", function() {
    addCourse();
    clearInputs();
    displayData(courses);
});

function addCourse() {
    var course = {
        id: courses.length + 1,
        name: courseName.value,
        category: courseCategory.value,
        price: coursePrice.value,
        description: courseDesc.value,
        capacity: courseCapacity.value
    };
    courses.push(course);
    localStorage.setItem("courses", JSON.stringify(courses));
}

function getCourses() {
    courses = JSON.parse(localStorage.getItem("courses"));
    if (courses != null) 
        displayData(courses);
    else 
        courses = [];
}



function clearInputs() {
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
    }
}

function displayData(courses) {
    var result = "";
    for (var i = 0; i < courses.length; i++) {
        result += `
            <tr>
                <td id="data">${courses[i].id}</td>
                <td id="data" class="name">${courses[i].name}</td>
                <td id="data" class="category">${courses[i].category}</td>
                <td id="data" class="price">${courses[i].price}</td>
                <td id="data" class="desc">${courses[i].description}</td>
                <td id="data" class="capacity">${courses[i].capacity}</td>
                <td>
                    <button id="update-button" class="btn btn-outline-info" data-course-id="${courses[i].id}">Update</button>
                    <button class="save d-none rounded-1" style="width: 40px; height: 40px;"><i class="fa-solid fa-check"></i></button>
                    <button class="cancel d-none rounded-1" style="width: 40px; height: 40px;"><i class="fa-solid fa-x"></i></button>
                </td>
                <td><button id="delete-button" data-course-id="${courses[i].id}" class="btn btn-outline-danger" onclick="">Delete</button></td>
            </tr> 
        `;
    }
    table.innerHTML = result;
}

document.addEventListener("click", function(event) {
    if (event.target.id == "delete-button") {
        var id = event.target.getAttribute("data-course-id");
        deleteCourse(id);
    }
    else if (event.target.id == 'update-button') {
        var id = event.target.getAttribute("data-course-id");
        var parent = event.target.parentNode;
        updateCourse(id, parent);
        console.log("update clicked");
    }
});

function deleteCourse(id) {
    var target = biSearch(id);
    if (target != -1) {
        courses.splice(target, 1);
        localStorage.setItem("courses", JSON.stringify(courses));
    }
    displayData(courses);
}

search.addEventListener("keyup", function(event) {
    var targetStr = event.target.value;
    searchFor(targetStr.toLowerCase());
});

function searchFor(target) {
    var targetCourses = [];
    for (var i = 0; i < courses.length; i++) {
        if (courses[i].name.toLowerCase().includes(target)) {
            targetCourses.push(courses[i]);
        }
    }
    displayData(targetCourses);
}

courseName.addEventListener("keyup", validateInputField);
courseCategory.addEventListener("keyup", validateInputField);
coursePrice.addEventListener("keyup", validateNumericalInputFields);
courseCapacity.addEventListener("keyup", validateNumericalInputFields);
courseDesc.addEventListener("keyup", validateCourseDescription);
deleteBtn.addEventListener("click", deleteAllCourses);

function validateInputField(event) {
    var pattern = /^[A-Z].{0,8}[a-zA-Z]$/;
    var value = event.target.value;
    if (!pattern.test(value)) 
        showError(event);
    else 
        hideError(event);
}

function validateNumericalInputFields(event) {
    var inputValue = event.target.value.trim();
    var value = parseInt(inputValue);
    if (inputValue == "" || isNaN(value) || value < 100) 
        showError(event);
    else 
        hideError(event);
}

function validateCourseDescription(event) {
    var value = event.target.value;
    var inputIdx = parseInt(event.target.getAttribute("input-idx"));
    var static = event.target.parentNode.querySelector(".static");
    var changing = event.target.parentNode.querySelector(".changing");
    static.style.display = "inline";
    changing.style.display = "inline";
    changing.innerHTML = value.length;
    if (value.length > 100) {
        static.classList.remove("text-success");
        static.classList.add("text-danger");
        changing.classList.remove("text-success");
        changing.classList.add("text-danger");
        event.target.classList.remove("is-valid");
        event.target.classList.add("is-invalid");
        inputStates[inputIdx] = false;
    }
    else {
        static.classList.remove("text-danger");
        static.classList.add("text-success");
        changing.classList.remove("text-danger");
        changing.classList.add("text-success");
        event.target.classList.remove("is-invalid");
        event.target.classList.add("is-valid");
        inputStates[inputIdx] = true;
    }
}

function showError(event) {
    var inputIdx = parseInt(event.target.getAttribute("input-idx"));
    var errorText = event.target.parentNode.querySelector("p");
    event.target.classList.remove("is-valid");
    event.target.classList.add("is-invalid");
    errorText.style.display = "block";
    inputStates[inputIdx] = false;
}

function hideError(event) {
    var inputIdx = parseInt(event.target.getAttribute("input-idx"));
    var errorText = event.target.parentNode.querySelector("p");
    event.target.classList.remove("is-invalid");
    event.target.classList.add("is-valid");
    errorText.style.display = "none";
    inputStates[inputIdx] = true;
}

function deleteAllCourses() {
    courses = [];
    localStorage.setItem("courses", JSON.stringify(courses));
    displayData(courses);
}

form.addEventListener("keyup", function() {
    var isValid = true;
    for (var i = 0; i < inputs.length; i++) {
        if (!inputStates[i]) {
            isValid = false;
            break;
        }
    }
    if (isValid) {
        submitBtn.removeAttribute("disabled");
        submitBtn.setAttribute("enabled", "enabled");
    }
    else {
        submitBtn.removeAttribute("enabled");
        submitBtn.setAttribute("disabled", "disabled");
    }
});

function updateCourse(id, parent) {
    parent.querySelector("#update-button").classList.add("d-none");
    var saveBtn = parent.querySelector(".save");
    saveBtn.classList.remove("d-none");
    saveBtn.classList.add("d-flex", 
    "justify-content-center", 
    "align-items-center",
    "border-success",
    "bg-transparent",
    "text-success");
    var cancelBtn = parent.querySelector(".cancel");
    cancelBtn.classList.remove("d-none");
    cancelBtn.classList.add("d-flex",
    "justify-content-center", 
    "align-items-center",
    "border-danger",
    "bg-transparent",
    "text-danger");

    var dataCols = parent.parentNode.querySelectorAll("#data");
    for (var i = 1; i < dataCols.length; i++) {
        var input = document.createElement("input");
        input.type = "text";
        input.value = dataCols[i].innerHTML;
        input.classList.add("form-control");
        dataCols[i].innerHTML = "";
        dataCols[i].appendChild(input);
    }

    saveBtn.addEventListener("click", function() {
        console.log("clicked");
        for (var i = 0; i < courses.length; i++) {
            if (courses[i].id == id) {
                courses[i].name = parent.parentNode.querySelector(".name input").value;
                courses[i].category = parent.parentNode.querySelector(".category input").value; 
                courses[i].price = parent.parentNode.querySelector(".price input").value;
                courses[i].description = parent.parentNode.querySelector(".desc input").value; 
                courses[i].capacity = parent.parentNode.querySelector(".capacity input").value;
                break;
            }
        }
        localStorage.setItem("courses", JSON.stringify(courses));
        displayData(courses);
    });
    
    cancelBtn.addEventListener("click", function() {
        displayData(courses);
    });
}

function biSearch(target) {
    var left = 0; 
    var right = courses.length - 1;
    while (left <= right) {
        var mid = Math.ceil((left + right) / 2);
        console.log(mid);
        if (courses[mid].id == target) {
            return mid;
        }
        if (courses[mid].id > target) {
            right = mid - 1;
        }
        else {
            left = mid + 1;
        }
    }

    return -1;
}