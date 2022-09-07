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

 function remove(tag) {
    console.log("remove");
    console.log(tag)

    }


const update = function (tag) {
    console.log("edit")
    }

const help = function (e) {
    alert("Welcome to Grocery Boi! To add items to the grocery list, enter text below the shopping carts, then hit Submit. To remove, hit the remove button on the corresponding row. To update, enter the new information at the top just below the shopping carts, then hit update!");
    }

document.getElementById("help").onclick = help




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
        //let button_del = '<button class = "button_delete" id='+ i.toString +'>Remove</button>'
        let button_update = '<button class = "button_edit" id='+ i.toString + '>Update</button>'
        let button_del = '<button class = "button_delete" onclick = "remove(this.id)" id='+ i.toString +'>Remove</button>'
        
        let spacer = '<td align="center">';
        newLine += ( spacer + button_del +  spacer + currentItem.item + spacer + currentItem.quan + spacer + currentItem.store + '</div></td>\n' + spacer + button_update);
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
        genTable(groceryList, -1)
    })
}


window.onload = function () {
    const button = document.querySelector('button')
    button.onclick = submit
}
