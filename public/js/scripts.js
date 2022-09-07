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
    let id_value = button.composedPath()[0].id;
    console.log(id_value)
    }


const update = function (e) {
    e.preventDefault()
    console.log("edit")
    }

const help = function (e) {
    e.preventDefault()
    alert("Welcome to Grocery Boi! To add items to the grocery list, enter text below the shopping carts, then hit Submit. To remove, hit the remove button on the corresponding row. To update, enter the new information at the top just below the shopping carts, then hit update!");
    }



document.getElementById("help").onclick = help;

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
        newLine += ('<td align="center">' + '<button class = "button_delete" id = "remove">Remove</button>' +  '<td align="center">' + currentItem.item + '<td align="center">' + currentItem.quan + '<td align="center">' + currentItem.store + '</div></td>\n' + '<td align="center">' + '<button class = "button_edit" id = "update">Update</button>');
        newLine += '</div>' + '</tr>';

        table.innerHTML += newLine
        document.getElementById("update").onclick = update;
        document.getElementById("remove").onclick = remove;
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
