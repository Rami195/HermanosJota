document.addEventListener("DOMContentLoaded", function() {
    const formulario = document.getElementById("formulario");
    const nombre = document.getElementById("nombre");
    const email = document.getElementById("email");
    const mensaje = document.getElementById("mensaje");
    const mensajeExito = document.getElementById("mensajeExito");
    
    // Función para mostrar errores
    function mostrarError(campo, elementoError, textoError) {
        campo.classList.add("campo-error");
        elementoError.textContent = textoError;
        elementoError.style.display = "block";
    }
    
    // Función para limpiar errores
    function limpiarError(campo, elementoError) {
        campo.classList.remove("campo-error");
        elementoError.style.display = "none";
    }
    
    // Validación
    function validarFormulario() {
        let esValido = true;
        
        // Limpiar errores previos
        limpiarError(nombre, document.getElementById("errorNombre"));
        limpiarError(email, document.getElementById("errorEmail"));
        limpiarError(mensaje, document.getElementById("errorMensaje"));
        
        // Validar nombre
        if (nombre.value.trim() === "") {
            mostrarError(nombre, document.getElementById("errorNombre"), "El nombre es requerido");
            esValido = false;
        }
        
        // Validar email
        if (email.value.trim() === "") {
            mostrarError(email, document.getElementById("errorEmail"), "El email es requerido");
            esValido = false;
        } else if (!email.validity.valid) {
            mostrarError(email, document.getElementById("errorEmail"), "Email inválido");
            esValido = false;
        }
        
        // Validar mensaje
        if (mensaje.value.trim() === "") {
            mostrarError(mensaje, document.getElementById("errorMensaje"), "El mensaje es requerido");
            esValido = false;
        }
        
        return esValido;
    }
    
    formulario.addEventListener("submit", function(e) {
        e.preventDefault(); 
        
        if (validarFormulario()) {
            // Mostrar mensaje de éxito
            mensajeExito.innerHTML = "¡Formulario enviado correctamente!";
            mensajeExito.className = "mensaje-exito";
            mensajeExito.style.display = "block";
            
            // Limpiar formulario
            formulario.reset();
            
            console.log("Formulario válido y enviado");
        }
    });
});