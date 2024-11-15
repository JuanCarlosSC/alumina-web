document.addEventListener('DOMContentLoaded', function () {
	
	// Tu código JavaScript aquí
	console.log('Evento JavaScript ejecutado desde Liquid');
	var miElemento = document.getElementById('AddMultiCart');
	
	formData = { items: [] };

	miElemento.addEventListener('click', function (event) {
		// Maneja el evento de clic aquí
		event.preventDefault();
		
		console.log('Se hizo clic en el elemento:', event.target);
        
		var tbl = document.getElementById("ts");

        if(checkTable(tbl)== true){

			// Iterar sobre las filas de la tabla
			for (var i = 0; i < tbl.rows.length; i++) {
			// Obtener el input numérico en la última celda de cada fila
			// var num = tbl.rows[i].cells[1].querySelector("input[type=number]");

				var num = tbl.rows[i].cells[tbl.rows[i].cells.length - 1].querySelector("input.quantity");
				
				if (num?.value > 0 && num !== null) {
					var productID = num.getAttribute("data-product-id");
					formData.items.push({
						'id': productID,
						'quantity': num.value
					});
				}
			}
			//window.alert("verificado");
			console.log('verificado:', event.target);
			addMultiCart();			
			
		}
		else{
			// Enviar mensaje (Modal) a la pantalla del usuario que tiene un error con la compra
			console.log('campos en 0 o nulos', event.target);
			window.alert("Por favor asegúrese que las cantidades sean mayor a 0");
		}

	});
    
	

	//Funcion para verificar si la tabla contiene todos ene sus campos un "0" o "null"
	function checkTable(table){
		//Contador para llevar la cuenta cuando 0 hay en la tabla
		let cont=0;
		let cont2=0;
		var flag=true;
		
		// Iterar sobre las filas de la tabla
		for (var i = 0; i < table.rows.length; i++) {
			// Obtener el input numérico en la última celda de cada fila
			var num2 = table.rows[i].cells[table.rows[i].cells.length - 1].querySelector("input.quantity");
			//console.log(input); // Asegúrate de que el input existe
			if(num2!=null){
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
		if(cont==table.rows.length-1 ||cont2>0){
			flag=false;
		}
		
	 return flag;
	}


	// let formData = {
	// 	'items': [{
	// 		'id': 41657273581619,
	// 		'quantity': 2
	// 	}]
	// };
	
	

	function addMultiCart() {
		fetch(window.Shopify.routes.root + 'cart/add.js', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
		})
			.then(response => {
				window.location.href = '/cart';
				return response.json();
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	}


	document.addEventListener('click', function (event) {
		if (event.target.classList.contains('btn-decrement')) {
			const input = event.target.nextElementSibling;
			if (parseInt(input.value) > 0) {
				input.value = parseInt(input.value) - 1;
			}
			
		}

		if (event.target.classList.contains('btn-increment')) {
			const input = event.target.previousElementSibling;
			input.value = parseInt(input.value) + 1;
		}
	});


	// Selecciona todas las filas de la tabla que tienen las variantes
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

});

function openDetails(event, obj) {
	event.preventDefault();
	var elementTr = obj.parentElement.parentElement;
	console.log("test");
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

jQuery(document).ready(function() {
    var tableContainer = $(".table-container");

    function ajustarScroll() {
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

    
    ajustarScroll();

   
    $(window).resize(function() {
        ajustarScroll();
    });
});
