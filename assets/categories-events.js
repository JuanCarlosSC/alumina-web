jQuery(document).ready(function() {
    var hideit = jQuery("#hideit");
    var title=$(".titulo");
    var slider = $("#sliderView");
    var hr=$(".hr-title");

    // Definir h2Shop
    var h2 = $("<h2></h2>").text("Categorias").css({
        "display":"block",
        "text-align": "center",
        "font-size": "38px",
        "font-weight": "revert",
        "color":"#0C91B6",
        "margin":"0",
        "padding":"5px 0 5px 0",
        
    });
  
    function ocultarElemento() {
        var innerWidth = window.innerWidth;
        if (innerWidth <= 600) {
            hideit.hide();
            h2.css("display", "block");
            title.append(h2);
            slider.hide();
            hr.css("display","block");       
        } 
        else if (innerWidth > 600){
            h2.css("display", "none");
            hideit.show();
            slider.show();
            hr.css("display","none");

        }
       
    }

    ocultarElemento();

    jQuery(window).resize(function() {
        ocultarElemento();
    });
});




