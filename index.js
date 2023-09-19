var courseName = document.getElementById("courseName");
var courseCategory = document.getElementById("courseCategory");
var coursePrice = document.getElementById("coursePrice");
var courseDesc = document.getElementById("courseDescription");
var courseCapacity = document.getElementById("courseCapacity");
var inputs = document.querySelectorAll(".inputs");
var table = document.querySelector(".table #data");
var deleteButtons = [];
var updataButton = [];

var courses = [];
var submitBtn = document.getElementById("submit");
submitBtn.addEventListener("click", function(event) {
    event.preventDefault();
    addCourse();
    clearInputs();
    displayData();
    
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

function displayData() {
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
                <td><button class="delete-button btn btn-outline-danger" onclick="deleteCourse(${courses[i].id})">Delete</button></td>
            </tr> 
        `;
    }
    table.innerHTML = result;
}

function deleteCourse(id) {
    var target = biSearch(id);
    console.log(target);
    if (target != -1) {
        courses.splice(target, 1);
    }
    displayData();
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