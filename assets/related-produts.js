
document.addEventListener("DOMContentLoaded", async function () {
  
  var comboBox = document.getElementById('productVariantsCombo');
  
 // Verificar que el comboBox existe
 setTimeout(() => {
  if (comboBox) { 
    handleSelection(comboBox);
  } else{console.log("No existe el elemento HTML Select")};
  }, 600);

});

async function verifyExistence(productID,quantity){
 
 let data = await getQuantityProductGraphql(productID);
 let verify=false;
 if(quantity <= data.quantityAvailable ){
  verify=true;
 } 
 return [verify,data.quantityAvailable]; 
 
}

//Funcion para agregar al carrito de los porductos relacionados
async function addCard(button) {
  var formData = { items: [] };
  var productID = button.getAttribute('data-product-id');
  var input = document.getElementById(`quantity-${productID}`);
  let quantityNum = input.value;

  let [stock,quantity] = await verifyExistence(productID, quantityNum);

  if (quantityNum == "0" || quantityNum == "") {
    input.classList.add('vibration', 'warning-border');
    
    var warningMessage = document.getElementById('warning-message');
    warningMessage.style.display = 'block';
    
    setTimeout(() => {
      input.classList.remove('vibration');
    }, 1000);

    setTimeout(() => {
      warningMessage.style.display = 'none';
      input.classList.remove('warning-border');
    }, 3000);
    input.value = "0";

  } else {
    if (stock) {
      formData.items.push({
        'id': productID,
        'quantity': quantityNum
      });
      debugger;
      fetch(window.Shopify.routes.root + 'cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la solicitud: ' + response.statusText);
        }
        reloadHeader();
        input.value = "0";
        showModal();
        return response.json();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    } else {
      input.classList.add('vibration', 'error-border');

      var errorMessage = document.getElementById('error-message');
      errorMessage.style.display = 'block';

      setTimeout(() => {
        input.classList.remove('vibration');
      }, 1000);

      setTimeout(() => {
        errorMessage.style.display = 'none';
        input.classList.remove('error-border');
      }, 3000);
      input.value=quantity;
    }
  }
}

//Funcion modal para mostrar mensaje de modal
function showModal() {
  var modal = document.getElementById('productAddedModal');
  var modalContent = modal.querySelector('.modal-content');

  modal.style.display = 'block'; // Mostrar el modal
  modalContent.classList.add('fade-in');

  // Ocultar el modal después de 2 segundos con animación
  setTimeout(function() {
    modalContent.classList.add('fade-out');
  }, 1500);

  setTimeout(function() {
    modal.style.display = 'none';
    modalContent.classList.remove('fade-out'); // Eliminar la clase para futuras ocasiones
  }, 3500);
}

//funcion para actualizar icono del carrito
function reloadHeader() {
  debugger;
  var xhr = new XMLHttpRequest();
  xhr.open('GET',window.location.href, true); // Asegúrate de que esta ruta devuelve el contenido necesario

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var parser = new DOMParser();
      var doc = parser.parseFromString(xhr.responseText, 'text/html');
      var newHeader = doc.getElementById('site-header');
      var currentHeader = document.getElementById('site-header');

      if (newHeader && currentHeader) {
        currentHeader.innerHTML = newHeader.innerHTML;
      }
    } else if (xhr.readyState == 4) {
      console.error('Error al recargar el header: ', xhr.statusText);
    }
  };

  xhr.send();
}
 
// Función para manejar la selección del comboBox
function handleSelection() {
  var comboBox = document.getElementById('productVariantsCombo');
  var selectedIndex = comboBox.selectedIndex-1;
  cellRelatedProducts(selectedIndex);
}

async function cellRelatedProducts(indice){
  // Verifica si el índice es válido dentro del arreglo
  
  if (productsVariants[indice] && productsVariants[indice].relatedProducts && indice!=-1) {
    lista = GetLstGraphQlProduct(productsVariants, indice);

    try {
      var lst = await procesarProductos(lista);
      // Asegúrate de que existe el contenedor antes de intentar acceder a él.
      let container = document.getElementById('recommendations-container');
      const listItems = container.querySelectorAll('li');

      // Contar la cantidad de elementos <li>
      const numberOfListItems = listItems.length;
      if(numberOfListItems>0){
        listItems.forEach(li => li.remove());
       
      }

      if (!container) {
        console.error('El contenedor #recommendations-container no existe en el DOM.');
        return;
      }

      lst.forEach(item => {
        let li = document.createElement('li');
        li.className = 'li-related-produts';
        let index = item[0].indexOf('|');
        let lstIdVariant=item[4].split("/");
        idVariant=lstIdVariant[lstIdVariant.length-1];

        if (index !== -1) {
          item[0] = item[0].substring(0, index);
        }
        li.innerHTML = `
          <div class="container-products scroll-trigger animate--slide-in">
           <div class="element-card">
            <a href="${item[2]}"><img class="img-related-produts" src="${item[3]}" alt="${item[0]}"></a>
            <h3>${item[1]}</h3>
            <h4>${item[0]}</h4>
            <h4 style="font-size:11px; text-align: center;"> disponibles ${item[5]}</h4>
            <div class="custom-input-card">
                   <button type="button"  class="btn-decrement" onclick="btnDecrement(this)">-</button>
                    <input type="number"  data-product-id="${idVariant}" class="quantity" id="quantity-${idVariant}" value="0"  min="0">
                   <button type="button" class="btn-increment"  onclick="btnIncrement(this)" >+</button>
            </div>
           <button class="btn-card" data-product-id="${idVariant}" type="button" name="add" id="AddMultiCart2" onclick="addCard(this)">Agregar
           <img src="https://cdn.shopify.com/s/files/1/0812/4353/7710/files/shopping.png?v=1734627656" alt="Icono de Comparar">
            </button>
           <div>
          </div>  
        `;

        container.appendChild(li);
      });
    } catch (error) {
      console.error('Error al procesar los productos: ', error);
    }
  } else {
    console.info(`No existen datos en el índice ${indice} o no tiene productos relacionados.`);
  }
}   

// Función para obtener todos los variantes de productos
function GetLstGraphQlProduct(lisRelatedProduts,indice) {

    let relatedproducts = lisRelatedProduts[indice].relatedProducts;
    let variantRelatedproducts=[];
    relatedproducts.forEach(lstGraph=> {
    variantRelatedproducts.push(lstGraph);
    });
     
    return variantRelatedproducts;
}
  
// Función para obtener todos los variantes de productos
async function procesarProductos(lstGraphQl) {
    let variantRelatedproducts=[];
    
    for(var x=0; x<lstGraphQl.length; x++){
      try{
        const data = await getProductVariantData(lstGraphQl[x]);
        const fila = [data.title, data.product.title, data.product.onlineStoreUrl, data.image.originalSrc, data.id,data.quantityAvailable];
        variantRelatedproducts.push(fila);
      }
      catch(error){
        console.error('Error: ', error);  
        return;
      }
    }
    return variantRelatedproducts;
}

// Función para obtener los datos de los productos relacioados
async function getProductVariantData(variantId) {
    const query = `
    {
    node(id: "${variantId}") {
        ... on ProductVariant {
        id
        title
        sku   
        quantityAvailable   
        product {   
            id  
            title
            vendor
            tags
            handle
            productType
            onlineStoreUrl
        }

        image { 
         originalSrc    
        }

      }
    }
  }
    `;
    const response = await fetch('https://6d6410.myshopify.com/api/2024-10/graphql.json', {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': 'db729bb8d995194f1922fe4da617ced1',
    },
    body: JSON.stringify({ query: query })
    });

    const data = await response.json();
    return data.data.node;
}

// Función para obtener los datos de los el stock del producto
function getQuantityProductGraphql(variantId) {
  const query = `
  {
    node(id: "gid://shopify/ProductVariant/${variantId}") {
      ... on ProductVariant {
        quantityAvailable
      }
    }
  }
  `;

  return fetch('https://6d6410.myshopify.com/api/2024-10/graphql.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': 'db729bb8d995194f1922fe4da617ced1',
    },
    body: JSON.stringify({ query: query })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error en la solicitud: ' + response.statusText);
    }
    return  response.json(); // Convertir la respuesta a JSON
  })
  .then(data => {
  

    if (data.data && data.data.node) {
      return data.data.node; // Devolver los datos necesarios si existen
    } else {
      throw new Error('Estructura de datos inesperada: ' + JSON.stringify(data));
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}
