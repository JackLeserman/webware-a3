let tag = 1
const submit = function (e) {
    e.preventDefault()

    const item = document.querySelector('#item').value
    const quan = document.querySelector('#quan').value
    const store = document.querySelector('#store').value
    const json = {
                'item': item,
                'quan':quan,
                'store':store,
            },

            body = JSON.stringify(json)

        fetch('/submit', {
            method: 'POST',
            body 
        })
  
        showData();
    }

const remove = function (e) {
    e.preventDefault()
    console.log("remove")
    let id_value = button.composedPath()[0].tag,
    console.log(id_value)
    }

const edit = function (e) {
    e.preventDefault()
    console.log("edit")
    }


const genTable = function (data) {

    let table = document.querySelector('#groceryData');
    table.innerHTML =
        '<tr>\n' +
        '<th align="center"></th>\n' +
        '<th align="center">Item</th>\n' +
        '<th align="center">Quantity</th>\n' +
        '<th align="center">Store</th>\n' +
        '<th align="center"></th>\n' +
        '</tr>';

    for (let i = 0; i < data.length; i++) {
        const currentItem = data[i];
        let newLine = '<tr>\n';
        newLine += ('<td align="center">' + '<button class = "button_delete" id = "remove">Remove</button>' +  '<td align="center">' + currentItem.item + '<td align="center">' + currentItem.quan + '<td align="center">' + currentItem.store + '</div></td>\n' + '<td align="center">' + '<button class = "button_edit" id = "edit">Edit</button>');
        newLine += '</div>' + '</tr>';

        table.innerHTML += newLine
        document.getElementById("edit").onclick = edit();
        document.getElementById("remove").onclick = remove();
    }
}


const showData = function () {
    fetch('/groceryData', {
        method: 'GET'
    }).then(function(response) {
        return response.json()
    }).then(function (groceryList) {
        genTable(groceryList, -1)
    })
}

window.onload = function () {
    const button = document.querySelector('button')
    button.onclick = submit
}
