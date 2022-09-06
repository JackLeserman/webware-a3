const submit = function (e) {

    e.preventDefault()

    const item = document.querySelector('#item').value
    const json = {
                'item': item,
            }, //check comma

            body = JSON.stringify(json)

        fetch('/submit', {
            method: 'POST',
            body 
        })
  
        showData();
        return false
    }


const genTable = function (data) {
  console.log("E")
    let table = document.querySelector('#groceryData');
    table.innerHTML =
        '<tr>\n' +
        '<th align="center">First Name</th>\n' +
        '</tr>';

    for (let i = 0; i < data.length; i++) {
        const currentStudent = data[i];
        let newLine = '<tr>\n';
        newLine += ('<td align="center">' + currentStudent.item + '</div></td>\n');
        newLine += '</div>' + '</tr>';

        table.innerHTML += newLine
    }
}

const showData = function () {
    fetch('/groceryData', {
        method: 'GET'
    }).then(function(response) {
        return response.json()
    }).then(function (groceryList) {
        genTable(groceryData, -1)
    })
}

window.onload = function () {
    const button = document.querySelector('button')
    button.onclick = submit
}
