var courseName = document.getElementById("courseName");
var courseCategory = document.getElementById("courseCategory");
var coursePrice = document.getElementById("coursePrice");
var courseDesc = document.getElementById("courseDescription");
var courseCapacity = document.getElementById("courseCapacity");
var inputs = document.querySelectorAll(".inputs");
var table = document.querySelector(".table #data");
var deleteButtons = [];
var updataButton = [];
var search = document.querySelector("#search");
var form = document.querySelector("form");
var inputStates = [];
for (var i = 0; i < inputs.length; i++) {
    inputStates.push(false);
}
var courses = [];
var submitBtn = document.getElementById("submit");
submitBtn.addEventListener("click", function(event) {
    // event.preventDefault();
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
                <td>${courses[i].id}</td>
                <td>${courses[i].name}</td>
                <td>${courses[i].category}</td>
                <td>${courses[i].price}</td>
                <td>${courses[i].description}</td>
                <td>${courses[i].capacity}</td>
                <td><button class="update-button btn btn-outline-info">Update</button></td>
                <td><button id="delete-button" data-course-id="${courses[i].id}" class="btn btn-outline-danger" onclick="">Delete</button></td>
            </tr> 
        `;
    }
    table.innerHTML = result;
}

document.addEventListener("click", function(event) {
    if (event.target.id == "delete-button") {
        id = event.target.getAttribute("data-course-id");
        deleteCourse(id);
    }
});

function deleteCourse(id) {
    var target = biSearch(id);
    if (target != -1) {
        courses.splice(target, 1);
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

function validateInputField(event) {
    var pattern = /^[A-Z].{0,8}[a-zA-Z]$/;
    var value = event.target.value;
    var inputIdx = parseInt(event.target.getAttribute("input-idx"));
    var errorText = event.target.parentNode.querySelector("p");
    if (!pattern.test(value)) {
        event.target.classList.remove("is-valid");
        event.target.classList.add("is-invalid");
        errorText.style.display = "block";
        inputStates[inputIdx] = false;
    }
    else {
        event.target.classList.remove("is-invalid");
        event.target.classList.add("is-valid");
        errorText.style.display = "none";
        inputStates[inputIdx] = true;
    }
}

function validateNumericalInputFields(event) {
    var inputValue = event.target.value.trim();
    var value = parseInt(inputValue);
    var inputIdx = parseInt(event.target.getAttribute("input-idx"));
    var errorText = event.target.parentNode.querySelector("p");
    if (inputValue == "" || isNaN(value) || value < 100) {
        event.target.classList.remove("is-valid");
        event.target.classList.add("is-invalid");
        errorText.style.display = "block";
        inputStates[inputIdx] = false;
    }
    else {
        event.target.classList.remove("is-invalid");
        event.target.classList.add("is-valid");
        errorText.style.display = "none";
        inputStates[inputIdx] = true;
    }
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