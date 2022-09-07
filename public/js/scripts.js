let tag_count = -1;

const submit = function (e) {
    e.preventDefault()

    const item = document.querySelector('#item').value;
    const quan = document.querySelector('#quan').value;
    const store = document.querySelector('#store').value;
    tag_count = tag_count + 1;
    console.log("Adding to" + tag_count);
    console.log("Current tags " + tag_count)
    let new_tag = tag_count.toString
    const json = {
                'item': item,
                'quan':quan,
                'store':store,
                'tag': new_tag
            },

            body = JSON.stringify(json)
            
        fetch('/submit', {
            method: 'POST',
            body 
        })
        showData();
    }

const remove = function (tag) {
    console.log("Removing " + tag);
    console.log("Current tags " + tag_count)
    const json = { tag: tag };
    const body = JSON.stringify(json);
   
    fetch('/remove', {
      method: 'POST',
      body 
    });
    showData(); //todo   
    };

 function update(tag) {
    console.log("Updating " + tag);
    const input = tag;
    const item = document.querySelector('#item').value
    const quan = document.querySelector('#quan').value
    const store = document.querySelector('#store').value
    tag_count = tag_count - 1;
   console.log("Current tags " + tag_count);
    const json = {
        'item': item,
        'quan':quan,
        'store':store,
        'tag':tag
    },
    body = JSON.stringify(json);
   
    fetch('/update', {
      method: 'POST',
      body 
    })
        showData();
    }


const help = function (e) {
    alert("Welcome to Grocery Boi! To add items to the grocery list, enter text below the shopping carts, then hit Submit. To remove, hit the remove button on the corresponding row. To update, enter the new information at the top just below the shopping carts, then hit update! If lists do not update due to server challenges, try Manual Refresh!");
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
        let tag2 = currentItem.tag
        console.log(tag2)
        let newLine = '<tr>\n';
        //let button_del = '<button class = "button_delete" id='+ i.toString +'>Remove</button>'
        let button_update = '<button class = "button_edit" id='+ i + ' onclick = "update(this.id)"+ >Update</button>'
        let button_del = '<button class = "button_delete" id='+ i + ' onclick = "remove(this.id)">Remove</button>'
        
        
        let spacer = '<td align="center">';
        newLine += ( spacer + currentItem.tag + spacer + button_del +  spacer + currentItem.item + spacer + currentItem.quan + spacer + currentItem.store + spacer + button_update);
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
document.getElementById("refresh").onclick = showData

window.onload = function () {
    const button = document.querySelector('button')
    button.onclick = submit
}
