window.addEventListener('DOMContentLoaded', (event) => {
    verificarTamaño(); // Verifica el tamaño inicial una vez que el DOM esté completamente cargado
  });
  
  window.addEventListener('resize', verificarTamaño); // Verifica el tamaño al redimensionar la ventana
  
  function verificarTamaño() {
    var hiddenDiv = document.getElementById('fixed-div');
    var maincontainer = document.getElementById('MainContent');
    var textserach=document.getElementById('Search-In-Modal');
    var label=document.getElementById('text1');
    
    var widthPlaceholder=textserach.offsetWidth;
    
    var width = maincontainer.offsetWidth; 
    var height = maincontainer.offsetHeight;
  
    console.log("Ancho de la ventana: " + width + "px, Alto de la ventana: " + height + "px");
  
    if (height < 400) {
      hiddenDiv.style.display = 'block';
      
    } else {
      hiddenDiv.style.display = 'none';
    }
    if(widthPlaceholder<140){
       label.style.fontSize="1rem";
    }
    else{
      label.style.fontSize="1.3rem";
    }
    
    
}

