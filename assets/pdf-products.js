
	  // Variables Globales
	  const variantId = parseInt(getUrlParameter('variant'));
	  let relatedProducts=[];
	  const { jsPDF } = window.jspdf;
	  let orientacion='landscape';
	  let newMedidades=[];
	  let tituloVariante="";
	  let tituloPrincipal;
	  let material="";
	  let imgBAse64="https://cdn.shopify.com/s/files/1/0812/4353/7710/files/alumina_logo_black_blue_83aa172c-6c60-4a20-9d06-dc1b0ca264ef.png?v=1712535296";
	  let listaGrapql =[];
      const doc = new jsPDF({
			orientation: orientacion,
	   });
	  const encabezados = ["No. Parte", "Nombre"]; 
	  let img = new Image();

	document.addEventListener("DOMContentLoaded", function () {
		//Campos de la tabla del Producto
        let medidades=[];   
		let imgDiagramproduct; 
		let imgError404="https://cdn.shopify.com/s/files/1/0812/4353/7710/files/diagram_404.png?v=1727926694";
		

		// Busca la variante en los productos disponibles
		if (variantId && window.products) {
			let variantFound = false;

			window.products.forEach(product => {
			product.variants.forEach(variant => {
				if (variant.id === variantId) {
					variantFound = true;
					tituloPrincipal =variant.title2;
					tituloVariante=variant.title;
					material=variant.type_material;
					imgDiagramproduct = variant.name_img_diagram;
					listaGrapql = getUrlGraphql(variant.lstProductosRelacionados);
				}

			});
			
			});
			
			if(tituloVariante!=""){
				medidades = tituloVariante.split('|');
				tituloVariante=medidades[0];
				newMedidades=medidades;
				newMedidades[0]="Dimensions";
				medidades = medidades.slice(1);
			}
		}
		
	    // Llamar a la función con la URL de la imagen
		GenerarPDF(imgDiagramproduct);
		
	});

	async function GenerarPDF(imgDiagrama) {
		try {
			const pdfViewer = document.getElementById("pdf-viewer");
			
			const { newWidth, newHeight } = await redimensionarImagen(imgDiagrama);
			await fetchAllProductVariants(listaGrapql);
			await tableReladeProducts();
			await tablaDetalleProducto();

	
			// Asegúrate de que `doc` esté definido y disponible aquí
			if (typeof doc !== 'undefined' && doc.addImage) {
                 let ejex =Math.round((2480-img.width)/19);
				  
				doc.addImage(imgDiagrama, "JPEG", ejex, 15, newWidth, newHeight);

				if (pdfViewer) {
					const pdfBlob = doc.output("blob"); 
					const pdfUrl = URL.createObjectURL(pdfBlob);
					if (/Mobi|Android/i.test(navigator.userAgent)) {
						window.open(pdfUrl, "_blank");
						
					} else {
						pdfViewer.src = pdfUrl; // Establece el URL del PDF en el iframe
					}

				} else {
					console.error("El elemento con id 'pdf-viewer' no existe.");
				}
			} else {
				console.error("El objeto `doc` no está definido o no tiene el método `addImage`.");
			}
		} catch (error) {
			console.error(error);
		}
	}
	
	

	// Función para redimensionar imagen
	function redimensionarImagen(imgDiagrama) {
				return new Promise((resolve, reject) => {
				
			
					img.onload = function() {
						let imgWidth = img.width;
						let imgHeight = img.height;
						let porcentaje = 1;
						
							if(imgWidth>imgHeight){porcentaje=0.88}
							else if (imgWidth<imgHeight){porcentaje=0.88}
							else if (imgWidth==imgHeight){porcentaje=0.87}
							
						
						
						
	                    debugger;
						let newWidth = Math.round(imgWidth - (imgWidth * porcentaje));
						let newHeight = Math.round(imgHeight - (imgHeight * porcentaje));
			
						// Resolver la promesa con los valores redimensionados
						resolve({ newWidth, newHeight });
					};
			
					img.onerror = function() {
						reject("Error al cargar la imagen: " + imgDiagrama);
					};
			
					// Establecer la ruta de la imagen
					img.src = imgDiagrama;
				});
	}
	
    
    //funcion para crear tabla del detalle del producto
	async function tablaDetalleProducto (){

		// Definir el tamaño de las celdas y las posiciones iniciales
		
		let yInicial = 165; 
		doc.setFontSize(12); // Tamaño de fuente pequeño
		doc.setTextColor(0, 0, 0);
		let maxAncho;
		let cadena="";
		let cell=0;

		newMedidades.forEach(elemento =>{
			cadena+=elemento.toString() + "   ";
			cell++;
		 });

		maxAncho=getTextWidth(cadena);
        const xInicial = 290-maxAncho;
		debugger;
		
		doc.addImage(imgBAse64, "JPEG", xInicial, 147	, 53, 16);
		// Función para medir el ancho del texto
		function getTextWidth(text) {
			return Math.round(doc.getTextWidth(text)); // Añadimos un pequeño margen
		}
		


		let xPos=xInicial;
		let yPos=yInicial;
	
		doc.rect(xPos, yPos, maxAncho, 8); // Dibuja la celda de la cabecera
		doc.text("Title: "+tituloPrincipal, xPos + 2, yPos + 6); // Escribe el texto
		yPos=yPos+8;
		doc.rect(xPos, yPos, maxAncho, 8); // Dibuja la celda de la cabecera
		doc.text("Part Number: "+tituloVariante, xPos + 2, yPos + 6); // Escribe el texto
		yPos=yPos+8;
		doc.rect(xPos, yPos, maxAncho, 8); // Dibuja la celda de la Material
		doc.text("Material: "+ material, xPos + 2, yPos + 6); // Escribe el texto
		yPos=yPos+8;
		
        
		
        let auxXpos=xPos;
		let auxYpost=yPos;
        
        auxYpost=auxYpost+7;
		let codigoASCII = 65;
		let Suma=0;
	
		for(var x=0; x<cell; x++){
            
			var cadenaTexto=newMedidades[x];
            let heightCell = getTextWidth(newMedidades[x] +"   ");
            Suma+=heightCell;
            
			if(x == cell-1){
				if(Suma<maxAncho){
					heightCell++;
				}
				else if(Suma==maxAncho){

				}
				else if(Suma>maxAncho){
					heightCell--;
				}
			}

			//Fila Dimenciones
			doc.setFillColor("#A6D6E4");
			doc.rect(auxXpos, yPos, heightCell, 8,'DF'); // Dibuja la celda Dimensions
			doc.rect(auxXpos, yPos+8, heightCell, 8); // Dibuja la celda Unnis
			

			if(x==0){
			 
		      doc.text("Dimensions", auxXpos+2,auxYpost); // Escribe el texto
			  doc.text("Unnis: mm", auxXpos+2,auxYpost+8); // Escribe el texto
			}
			else if (x < cell-1){
				// Número ASCII
				
				// Obtener la letra correspondiente al número ASCII
				let letra = String.fromCharCode(codigoASCII);
				doc.text(letra, auxXpos+2,auxYpost); // Escribe el texto Letras
				doc.text(newMedidades[x], auxXpos+2,auxYpost+8); // Escribe el texto Medidas
				codigoASCII++;
			}
			else{
				doc.text("Kg", auxXpos+1,auxYpost); // Escribe el texto Kg en la ultima celda
				doc.text(newMedidades[x], auxXpos+2,auxYpost+8); //Escribir el peso del producto
			}

			//doc.text(, xPos + 2, yPos + 6); // Escribe el texto
			auxXpos=auxXpos+heightCell;
            
			
			
		}
	

	}

	//Funcion para crear la Tabla de los productos relacionados
    async function tableReladeProducts() {

     // Definir el tamaño de las celdas y las posiciones iniciales
		const xInicial = 7; 
		let yInicial = 218; 
		let paddingBotton=5;
		doc.setFontSize(12); // Tamaño de fuente pequeño
        let maxAncho;
		
        let anchoble=(relatedProducts.length*8)+16;
		yInicial=218-anchoble-paddingBotton;
		debugger;
		// Función para medir el ancho del texto
		function getTextWidth(text) {
			return doc.getTextWidth(text) + 4; // Añadimos un pequeño margen
		}

		// Calculamos el ancho de cada columna
		const anchosColumnas = encabezados.map((columna, index) => {
			maxAncho = getTextWidth(columna);
			relatedProducts.forEach(fila => {
				const valor = fila[index];
				const anchoValor = getTextWidth(valor.toString());
				if (anchoValor > maxAncho) {
					maxAncho = anchoValor;
				}
			});
			return maxAncho;
		});
        
		// Guardar la posición X inicial
		let xPos = xInicial;
		
		

		// Dibujar las cabeceras
		encabezados.forEach((columna, index) => {
			doc.setFillColor("#A6D6E4");
			doc.rect(xPos, yInicial, anchosColumnas[index], 8,'DF'); // Dibuja la celda de la cabecera
			doc.text(columna, xPos + 2, yInicial + 7); // Escribe el texto

			if(index==0){
            //Celda Titulo
             let textleng=getTextWidth("Productos Relacionados");
			 let largo =anchosColumnas[0]+anchosColumnas[1];
			 let diferiencia=largo-textleng;
			 diferiencia=Math.round(diferiencia/2) +xPos;
			doc.setFillColor("#0C92B7");
			doc.rect(xPos, yInicial-8,largo, 8,'DF'); // Dibuja la celda de la cabecera
			doc.text("Productos Relacionados", diferiencia , yInicial -2); // Escribe el texto
			
			}
			xPos += anchosColumnas[index]; // Ajustar la posición X para la siguiente columna
			
		
		});

		// Dibujar las filas de datos
		yInicial += 8; // Ajustar Y para las filas de datos
		relatedProducts.forEach(fila => {
			xPos = xInicial; // Reiniciar la posición X para cada fila
			fila.forEach((valor, index) => {
				if (index === 0 || index === 1) { // Solo las primeras dos columnas: "No. Parte" y "Nombre"
					// Dibujar la celda
					doc.rect(xPos, yInicial, anchosColumnas[index], 8); // Dibuja cada celda

					doc.setTextColor(0, 0, 0);
					if (index === 0) {
						
						doc.text(valor.toString(), xPos + 2, yInicial + 7); 
					} else if (index === 1) { 
						const url = fila[2]; // Obtenemos la URL (la tercera columna)
						doc.setTextColor(8, 102, 128);
						doc.text(valor.toString(), xPos + 2, yInicial + 7); 
						
						
						doc.link(xPos, yInicial, anchosColumnas[index], 8, { url: url }); // Crea el enlace en la celda
					}
				}
				xPos += anchosColumnas[index]; // Ajustar la posición X para la siguiente celda
			});
			yInicial += 8; // Moverse hacia abajo para la siguiente fila
		});

		
	}
	
	//Funcoin para obtener la lista de direccion grapql para los productos relacionados
	function getUrlGraphql(str) {
		// Elimina los caracteres no deseados al inicio y final del string
		const cleanedStr = str.replace(/^\[&quot;|&quot;\]$/g, '');
		// Divide la cadena resultante cuando encuentre ",&quot;"
		const resultArray = cleanedStr.split('&quot;,&quot;');
		return resultArray;
	}

	// Función para obtener todos los variantes de productos
	async function fetchAllProductVariants(listaGrapql) {	
		for (let x = 0; x < listaGrapql.length; x++) {
			try {
			const data = await getProductVariantData(listaGrapql[x]);
			const fila = [data.title, data.product.title, data.product.onlineStoreUrl];
			relatedProducts.push(fila);

			} catch (error) {
			console.error('Error:', error);
			}
		}

		
	}

	// Función para obtener parámetros de la URL
	function getUrlParameter(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
		var results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}


    // Función para obtener los datos de los productos relacioados
	async function getProductVariantData(variantId) {
				const query = `
			{
			node(id: "${variantId}") {
				... on ProductVariant {
				id
				title
				product {
					id
					title
					productType
					onlineStoreUrl
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
		console.log(data);
		return data.data.node;
	}
