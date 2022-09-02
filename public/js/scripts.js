const submit = function (e) {

    e.preventDefault()

    const input_item = document.querySelector('#item').value
    const json = {
                'item': input_item,
            }, //check comma

            body = JSON.stringify(json)

        fetch('/submit', {
            method: 'POST',
            body 
        }).then(function (response) {})
  
        showData();
        return false
    }


const genTable = function (studentList, editIndex) {
    let studentTable = document.querySelector('#item');
    studentTable.innerHTML =
        '<tr>\n' +
        '<th align="center">First Name</th>\n' +
        '</tr>';

    for (let i = 0; i < studentList.length; i++) {
        const currentStudent = studentList[i];
        let newLine = '<tr>\n';
        newLine += ('<td align="center">' + currentStudent.firstName + '</div></td>\n');
        newLine += '</div>' + '</tr>';

        studentTable.innerHTML += newLine
    }
}

const showData = function () {
    fetch('/groceryData', {
        method: 'GET'
    }).then(function(response) {
        return response.json()
    }).then(function (studentList) {
        genTable(studentList, -1)
    })
}
