function enviarFormulario() {
    var textoJson = document.getElementById('dataCart');
    var dataCart = JSON.parse(textoJson.textContent);
    var lstCart = [];
    var idCustomer=Number(document.getElementById('idCustomer').textContent);
    var test="";
    for (var i = 0; i < dataCart.length; i++) {
        lstCart.push({
            'id': dataCart[i].id,
            'title': dataCart[i].title,
            'quantity': dataCart[i].quantity
        });
    }



    var url = 'https://backend.shop-alumina.com/create_order';
    var opciones = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "lstCart": lstCart,
            "idCustomer":idCustomer
        })
    };

    // { "order": { "line_items": [ { "variant_id": 47859451035950, "quantity": 1 }, { "variant_id": 47859451101486, "quantity": 2 } ], "customer": { "id": 7425391165742 } } }


    

    fetch(url, opciones)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Hubo un problema al enviar los datos.');
            }
            return response.json();
        })
        .then(function(data) {
            console.log('Datos enviados correctamente:', data);
            cleanCart();
        })
        .catch(function(error) {
            console.error('Error al enviar los datos:', error);
        });
}

function cleanCart() {
    fetch(window.Shopify.routes.root + 'cart/clear.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(formData)
    })
    .then(response => {
        window.location.href = '/account';
        return response.json();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// {
//     "line_items": [
//         {
//             "title": "Big Brown Bear Boots",
//             "price": 74.99,
//             "grams": "1300",
//             "quantity": 3,
//             "tax_lines": [
//                 {
//                     "price": 13.5,
//                     "rate": 0.06,
//                     "title": "State tax"
//                 }
//             ]
//         }
//     ],
//     "transactions": [
//         {
//             "kind": "sale",
//             "status": "success",
//             "amount": 238.47
//         }
//     ],
//     "total_tax": 13.5,
//     "currency": "MXN",
//     "customer": {
//         "id": data.idCustomer,
//         // "email": "correo@ejemplo.com",
//         // "first_name": "Nombre",
//         // "last_name": "Apellido"
//     }
// }