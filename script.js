async function convertirEquipo() {
    let inputVal = document.getElementById("inputShowdown").value.trim();
    let btn = document.getElementById("btnConvertir");
    let loading = document.getElementById("loading");
    let resultadoDiv = document.getElementById("resultado");
    let linkResultado = document.getElementById("linkResultado");
    let errorDiv = document.getElementById("error");

    resultadoDiv.classList.add("hidden");
    errorDiv.classList.add("hidden");

    if (!inputVal) {
        mostrarError("Por favor, introduce un enlace o el texto del equipo.");
        return;
    }

    loading.classList.remove("hidden");
    btn.disabled = true;

    try {
        let textoEquipo = inputVal;

        // Si lo que metieron es un enlace o código de Showdown, intenta descargarlo
        if (inputVal.includes("psim.us") || /^[a-zA-Z0-9-_]+$/.test(inputVal)) {
            let codigoMatch = inputVal.match(/(?:psim\.us\/t\/)?([a-zA-Z0-9-_]+)/);
            let codigo = codigoMatch ? codigoMatch[1] : inputVal;
            let urlShowdown = `https://psim.us/t/${codigo}`;
            let proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(urlShowdown)}`;
            
            let response = await fetch(proxyUrl);
            if (!response.ok) throw new Error("No se pudo leer el enlace de Showdown.");
            textoEquipo = await response.text();
        }

        if (!textoEquipo || textoEquipo.trim() === "") {
            throw new Error("El contenido del equipo está vacío.");
        }

        enviarPorFormularioInvisible(textoEquipo);

    } catch (err) {
        console.error(err);
        mostrarError("Error al leer el enlace (CORS/Red). Solución: Copia el texto del equipo en Showdown (Export/Import) y pégalo aquí directamente.");
    } finally {
        loading.classList.add("hidden");
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
}

function mostrarError(mensaje) {
    let errorDiv = document.getElementById("error");
    errorDiv.innerText = mensaje;
    errorDiv.classList.remove("hidden");
}