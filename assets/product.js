document.addEventListener('DOMContentLoaded', function () {
  
	const variantRows = document.querySelectorAll('.variant-row');
	variantRows.forEach(row => {
		row.addEventListener('click', function () {
			if (this.classList.contains('disabled')) return; // Ignora los clics en filas deshabilitadas
			// Obtén el ID de la variante seleccionada
			const variantId = this.getAttribute('data-variant-id');
			// Llama a la función que cambia la variante, puede que ya la tengas implementada
			selectVariantById(variantId);
		});
	});
    ajustarScroll();
});

function checkboxActive(checkbox){
	var milimetrosCheckbox = document.getElementById('milimetro');
	var pulgadasCheckbox = document.getElementById('pulgadas');
	var table = document.getElementById('ts');
	if(milimetrosCheckbox.checked==false && pulgadasCheckbox.checked==false){
		checkbox.checked = true
	}else{
		if(checkbox.checked){
			if (checkbox.name=="milimetros") {
				pulgadasCheckbox.checked = false;
				changeValueTableMM(table);
			}
			else if(checkbox.name=="pulgadas"){
				milimetrosCheckbox.checked = false;
				changeValueTableIn(table);
			}
		}
	}	
}

function changeValueTableMM(table) {
// Iterar sobre las filas de la tabla, comenzando desde la segunda fila
  var numElements=number(table);
	for (var i = 1; i < table.rows.length; i++) {
		var row = table.rows[i]; 
		for (var c = 4; c < numElements; c++) { // Iterar sobre las celdas a partir de la cuarta
			var cell = table.rows[i].cells[c];
			var valueIn; var valueInRounded;
		if (cell) { 
			var value = cell.outerText;
			   if(value[0]=="ø"){
				value = value.substring(1); // Remover el primer carácter
				valueIn = value*25.4;
				valueInRounded = parseFloat(valueIn.toFixed(1));
				valueInRounded = "ø" + valueInRounded;
			   }
			   else if(value[0]=="M"){
				valueInRounded=value;
			   }
			   else{
				   valueIn = value*25.4;
				   valueInRounded = parseFloat(valueIn.toFixed(1));
			   }
			   cell.innerText=valueInRounded;	
		   } 
		}
	}
}

function changeValueTableIn(table) {
	// Iterar sobre las filas de la tabla, comenzando desde la segunda fila
	  var numElements=number(table);
		for (var i = 1; i < table.rows.length; i++) {
			var row = table.rows[i]; 
			var valueIn; var valueInRounded; 
			for (var c = 4; c < numElements; c++) { // Iterar sobre las celdas a partir de la cuarta
				var cell = table.rows[i].cells[c];
			if (cell) { 	
				var value = cell.outerText;

				if(value[0]=="ø"){
				 value = value.substring(1); // Remover el primer carácter
				 valueIn = Number((value/25.4).toFixed(3));
				 valueIn = "ø" + valueIn;
				}
				else if(value[0]=="M"){
					valueIn=value;
				}
				else{
					valueIn = Number((value/25.4).toFixed(3));
				}
				cell.innerText=valueIn;
			 } 
			}
		}
}
  
function number(table){
	let datos=4;
	for (var c = 4; c < table.rows[0].cells.length; c++) { 
		var cell = table.rows[0].cells[c]; // Obtener la celda actual
		if (cell) { // Verificar si el elemento cell no es null
			if(cell.outerText=="kg"){
				break;
			}
			else{
				datos++;
			}
		}
	}
	return datos;
}

function btnIncrement(button) {
	if (button.classList.contains('btn-increment')) {
	  const input = button.previousElementSibling; 
	  
		parseInt(input.value)>= 0 ? input.value = parseInt(input.value) + 1 : input.value = 0;
	}
}
  
function btnDecrement(button) {
	if (button.classList.contains('btn-decrement')) {
	  const input = button.nextElementSibling;

	  parseInt(input.value)> 0 ? input.value = parseInt(input.value) - 1 : input.value = 0;
	}
}

function selectVariantById(variantId) {
	// Simula el comportamiento de seleccionar una variante, por ejemplo, disparando un evento de cambio
	const variantInput = document.querySelector(`input[type="radio"][value="${variantId}"]`);
	if (variantInput) {
		variantInput.checked = true;
		variantInput.dispatchEvent(new Event('change'));
	}
	// Alternativamente, podrías ejecutar directamente la función que maneja el cambio de galería
	// Aquí deberías poner la lógica que cambia las imágenes de la galería basada en la variante
}

async function addMultiCart() {
    
	dataModel(formData);
	
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
	//addMultiCart(formData, productID , qty)
	// window.location.href = '/cart';	
	return response.json();
	})
	.catch((error) => {
	console.error('Error:', error);
	});
	


}

//Funcion para verificar si la tabla contiene todos ene sus campos un "0" o "null"
function checkTableData(table){
	//Contador para llevar la cuenta cuando 0 hay en la tabla
	let cont=0, cont2=0; var flag=true; var productID; var input;
	
	// Iterar sobre las filas de la tabla
	for (var i = 0; i < table.rows.length; i++) {
		// Obtener el input numérico en la última celda de cada fila
		var num2 = table.rows[i].cells[table.rows[i].cells.length - 1].querySelector("input.quantity");

		if(num2!=null){

			productID = num2.getAttribute('data-product-id');
			input = document.getElementById(`quantity-${productID}`);
			
			//console.log(num2?.value);

			if(num2?.value == 0 && num2?.value !="" ){
				cont++;
			}
			if(num2?.value ==""){
				cont2++;
				break;
			}
		}	
	}
	if(cont==table.rows.length-1 || cont2>0){

		flag=false;
	}
     return flag;
}

//Funcion para verificar si la tabla contiene todos ene sus campos un "0" o "null"
async function productStockValidity(table){
 
	flag=true; var productID; var input;
	
	// Iterar sobre las filas de la tabla
	for (var i = 0; i < table.rows.length; i++) {
		// Obtener el input numérico en la última celda de cada fila
		var num2 = table.rows[i].cells[table.rows[i].cells.length - 1].querySelector("input.quantity");

		if(num2!=null){

			productID = num2.getAttribute('data-product-id');
			input = document.getElementById(`quantity-${productID}`);

			let [stock,quantity] = await verifyExistence(productID, input.value);
			
			if(stock){
				flag=true;
			}
			else{
				flag=false;
				input.value=quantity;
				break;
			}	
		}	
	}
	
  return [flag,input];
}

//Funcion para verificar si la tabla contiene todos ene sus campos un "0" o "null"
function checkTable(table){
	//Contador para llevar la cuenta cuando 0 hay en la tabla
	let cont=0,  cont2=0;
	var warningMessage = document.getElementById('warning-message2');
	var flag=true;
	var productID;
	var input;
	
	// Iterar sobre las filas de la tabla
	for (var i = 0; i < table.rows.length; i++) {
		// Obtener el input numérico en la última celda de cada fila
		var num2 = table.rows[i].cells[table.rows[i].cells.length - 1].querySelector("input.quantity");

		
		if(num2!=null){

			productID = num2.getAttribute('data-product-id');
			input = document.getElementById(`quantity-${productID}`);
			
			//console.log(num2?.value);

			if(num2?.value == 0 && num2?.value !="" ){
				cont++;
			}
			if(num2?.value ==""){
				cont2++;
				break;
			}
		}	
	}
	
	if(cont==table.rows.length-1){
    
    var warningMessage = document.getElementById('warning-message2');
    warningMessage.style.display = 'block';
    setTimeout(() => {
      warningMessage.style.display = 'none';
    }, 3000);
		flag=false;
	}
	else if(cont2>0){

	       input.classList.add('vibration', 'error-border');

      var errorMessage = document.getElementById('warning-message2');
      errorMessage.style.display = 'block';

      setTimeout(() => {
        input.classList.remove('vibration');
      }, 1000);

      setTimeout(() => {
        errorMessage.style.display = 'none';
        input.classList.remove('error-border');
      }, 3000);
	 
		flag=false;
	}
	return flag;
}

async function clikButton(){
	var tbl = document.getElementById("ts");
	let product = document.getElementById("h1-titulo-producto");
	let precio =
	formData = { items: [] };
	datosModal = { items: [] };
	var num;
	var productID;
	let qty = 0;

	if(checkTableData(tbl)){
		const [flag,input]=await productStockValidity(tbl);
		if(flag){
			// Iterar sobre las filas de la tabla
			for (var i = 0; i < tbl.rows.length; i++) {
			// Obtener el input numérico en la última celda de cada fila
			// var num = tbl.rows[i].cells[1].querySelector("input[type=number]");
	
				num = tbl.rows[i].cells[tbl.rows[i].cells.length - 1].querySelector("input.quantity");
				precio = tbl.rows[i].cells[tbl.rows[i].cells.length - 2].querySelector("input.quantity");
	            
				if (num?.value > 0 && num !== null) {
					precio;
					debugger;
					productID = num.getAttribute("data-product-id");
					formData.items.push({
						'id': productID,
						'quantity': num.value
					});
					
					num.value="0";
				}
			
				
			}

			addMultiCart() 
		}
		else{
			input.classList.add('vibration', 'error-border');

			var errorMessage = document.getElementById('error-message2');
			errorMessage.style.display = 'block';

			setTimeout(() => {
				input.classList.remove('vibration');
			}, 1000);

			setTimeout(() => {
				errorMessage.style.display = 'none';
				input.classList.remove('error-border');
			}, 3000);
			
		}			
	}
	else{

	var warningMessage = document.getElementById('warning-message2');
	warningMessage.style.display = 'block';
	setTimeout(() => {
		warningMessage.style.display = 'none';
	}, 3000);
	
    }
}

function openDetails(event, obj) {
	event.preventDefault();
	var elementTr = obj.parentElement.parentElement;
	//console.log("test");
	// $(".fold-table tr.view").on("click", function(){
	// $(this).toggleClass("open").next(".fold").toggleClass("open");
	// });
	if (elementTr.classList.contains("open")) {
		elementTr.classList.remove("open");
	} else {
		elementTr.classList.add("open");
	}

	// Obtiene el siguiente elemento con la clase 'fold' y le agrega o elimina la clase 'open' de manera similar
	var nextFold = elementTr.nextElementSibling.children[0].children[0];
	if (nextFold && nextFold.classList.contains("fold-content")) {
		if (nextFold.classList.contains("open")) {
			nextFold.classList.remove("open");
		} else {
			nextFold.classList.add("open");
		}
	}
}

function ajustarScroll() {
	var tableContainer = $(".table-container");
	var innerWidth = $(window).width();

	if (innerWidth <= 600) {
		tableContainer.css({
			"overflow-x": "auto",
			"white-space": "nowrap"
		});
	} else {
		tableContainer.css({
			"overflow-x": "auto", /* Aseguramos que tenga scroll horizontal por si la tabla se expande */
			"white-space": "normal" /* Permite el quiebre de líneas cuando la pantalla es ancha */
		});
	}
}

/*********  Funcion para mostrar y caragr datos al modal ***********/

/**  Funcion para ir a la ventana del productos selecionados ( Carrito ) */

function onclickViewCard() {
	//var modal = document.getElementById("itemModal");
	window.location.href = '/cart';
}


// Funcoin para obtener informacion de los productos GraphQL
async function getInfoProductGraphqlModel(variantId) {
const query = `
	{
		node(id: "gid://shopify/ProductVariant/${variantId}")
		{
			... on ProductVariant {
			title
			price 
				{ 
				amount
				currencyCode
			}
			product {
				title
			}
			image {
				originalSrc
			}
		}
	}
		
}`;

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

// Funcion cargar los datos al modal y mostrarlo
function onclcikMostrarModalCard2(infoCompra, id, qty) {
	let urlImgProduct = infoCompra.image.originalSrc;
	let idProduct = id;
	let name = infoCompra.product.title;
	let noPart = infoCompra.title;
	let index = noPart.indexOf('|');
	let quantity = qty;
	let price = Math.round((infoCompra.price.amount * quantity),2);
	let currencyCode = infoCompra.price.currencyCode;
    let modalItems = document.getElementById("modalItems");
	
	noPart = noPart.substring(0,index);
	modalItems.innerHTML += `
	  <div class="item">
		<img src="${urlImgProduct}" alt="${idProduct}">
		<div class="item-element">
		  <p>ID:${idProduct}</p>
		  <p>${name}</p>
		  <p>${noPart}</p>
		  <p>Cantidad: ${quantity} </p>
		  <p>Precio: $ ${price} ${currencyCode}</p>
		</div>
	  </div>
	  <hr/ id="hrModal">
	`;
  }

function dataModel(format){

	for (const prop in format) {	
		format[prop].forEach(datos => {
			let idProduct = datos.id;
			let quantity =  datos.quantity;

			getDataModel(idProduct,  quantity);
		});
	}
	
 }
 async function getDataModel(id, quantity) {
	const modal = document.getElementById("itemModal");
	const spinner = document.getElementById("spinner");
	const modalContent = document.querySelector(".modal-content");
  
	// Mostrar el spinner y ocultar el contenido del modal
	spinner.style.display = "block";
	modalContent.classList.add("loading");
  
	// Obtener los datos del producto
	const datos = await getInfoProductGraphqlModel(id);
  
	// Llamar a la función para mostrar el contenido del modal con los datos
	onclcikMostrarModalCard2(datos, id, quantity);
  
	// Asegurarse de que todas las imágenes se hayan cargado
	const images = modal.querySelectorAll("img");
	const imageLoadPromises = Array.from(images).map((img) =>
	  new Promise((resolve) => {
		if (img.complete) resolve();
		else {
		  img.onload = resolve;
		  img.onerror = resolve;
		}
	  })
	);
	await Promise.all(imageLoadPromises);
  
	// Ocultar el spinner
	spinner.style.display = "none";
	modalContent.classList.remove("loading");
  
	// Mostrar el modal con animación
	showModal();	
  }
  
  
  
/*** Fin ***/ 