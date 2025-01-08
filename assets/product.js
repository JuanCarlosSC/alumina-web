

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
	showModal();
	//window.location.href = '/cart';	
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
	formData = { items: [] };
	var num;
	var productID;

	if(checkTableData(tbl)){
		const [flag,input]=await productStockValidity(tbl);
		if(flag){
			// Iterar sobre las filas de la tabla
			for (var i = 0; i < tbl.rows.length; i++) {
			// Obtener el input numérico en la última celda de cada fila
			// var num = tbl.rows[i].cells[1].querySelector("input[type=number]");
	
				num = tbl.rows[i].cells[tbl.rows[i].cells.length - 1].querySelector("input.quantity");
	
				if (num?.value > 0 && num !== null) {
					productID = num.getAttribute("data-product-id");
					formData.items.push({
						'id': productID,
						'quantity': num.value
					});
					num.value="0";
				}
			
				
			}
			addMultiCart();
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
