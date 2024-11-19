$(document).ready(function() {
  function verificarTamaño() {
      var $hiddenDiv = $('#fixed-div');
      var $maincontainer = $('#MainContent');
      var $textsearch = $('#Search-In-Modal');
      var $label = $('#text1');
      var $logo = $('#img-logo'); 
      
      
      if ($hiddenDiv.length && $maincontainer.length && $textsearch.length && $label.length && $logo.length) {
          var widthPlaceholder = $textsearch.width();
          var width = $maincontainer.width(); 
          var height = $maincontainer.height();
        
          console.log("Ancho de la ventana: " + width + "px, Alto de la ventana: " + height + "px");
        
          if (height < 400) {
              $hiddenDiv.show();
          } else {
              $hiddenDiv.hide();
          }
          
          if (widthPlaceholder < 140) {
              $label.css('font-size', '1rem');
          } else {
              $label.css('font-size', '1.3rem');
          }
        
          if (width < 478) {
              $logo.attr('src', 'assets/A-icon.png');
              $logo.attr('alt', 'logo nuevo');
          } else {
              $logo.attr('src', 'logo-original.jpg');
              $logo.attr('alt', 'Logo Original');
          }
      } else {
          console.warn('Uno o más elementos no fueron encontrados en el DOM.');
      }
  }

  
  verificarTamaño();

 
  $(window).resize(verificarTamaño);
});
