function convertirEquipo() {
    let textoEquipo = document.getElementById("inputShowdown").value.trim();
    let btn = document.getElementById("btnConvertir");
    let resultadoDiv = document.getElementById("resultado");
    let linkResultado = document.getElementById("linkResultado");
    let errorDiv = document.getElementById("error");

    resultadoDiv.classList.add("hidden");
    errorDiv.classList.add("hidden");

    if (!textoEquipo) {
        mostrarError("Por favor, pega el texto del equipo.");
        return;
    }

    btn.disabled = true;

    try {
        enviarPorFormularioInvisible(textoEquipo);
    } catch (err) {
        console.error(err);
        mostrarError("Error: " + err.message);
        btn.disabled = false;
    }
}

function enviarPorFormularioInvisible(textoEquipo) {
    let form = document.createElement("form");
    form.method = "POST";
    form.action = "https://pokepast.es/";
    form.target = "_blank";

    let inputPaste = document.createElement("textarea");
    inputPaste.name = "paste";
    inputPaste.value = textoEquipo;
    form.appendChild(inputPaste);

    let inputTitle = document.createElement("input");
    inputTitle.type = "hidden";
    inputTitle.name = "title";
    inputTitle.value = "Convertido desde Showdown";
    form.appendChild(inputTitle);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    let resultadoDiv = document.getElementById("resultado");
    let linkResultado = document.getElementById("linkResultado");
    linkResultado.href = "https://pokepast.es/";
    linkResultado.innerText = "¡Se ha abierto una pestaña con tu Pokepaste creado!";
    resultadoDiv.classList.remove("hidden");
    
    document.getElementById("btnConvertir").disabled = false;
}

function mostrarError(mensaje) {
    let errorDiv = document.getElementById("error");
    errorDiv.innerText = mensaje;
    errorDiv.classList.remove("hidden");
}
