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
        mostrarError("Por favor, introduce un enlace o código válido.");
        return;
    }


    let codigoMatch = inputVal.match(/(?:psim\.us\/t\/)?([a-zA-Z0-9-_]+)/);
    let codigo = codigoMatch ? codigoMatch[1] : inputVal;

    loading.classList.remove("hidden");
    btn.disabled = true;

    try {

        let urlShowdown = `https://psim.us/t/${codigo}`;
        let response = await fetch(urlShowdown);
        
        if (!response.ok) {
            throw new Error("No se pudo encontrar el equipo en Pokémon Showdown. Verifica que el enlace sea correcto.");
        }

        let textoEquipo = await response.text();

        let formData = new URLSearchParams();
        formData.append("paste", textoEquipo);
        formData.append("title", "Convertido desde Showdown");

        let responsePokepaste = await fetch("https://pokepast.es/", {
            method: "POST",
            body: formData,

            redirect: "follow"
        });

        let urlFinal = responsePokepaste.url;

        if (!urlFinal || urlFinal.includes("error")) {
            throw new Error("Pokepaste no devolvió un enlace válido.");
        }

        linkResultado.href = urlFinal;
        linkResultado.innerText = urlFinal;
        resultadoDiv.classList.remove("hidden");

    } catch (err) {
        console.error(err);
        mostrarError("Ocurrió un error al procesar el equipo. (Nota: Si el navegador bloquea la petición por políticas CORS de Pokepaste, requeriría un pequeño proxy intermedio, pero prueba primero ejecutándolo en GitHub Pages).");
    } finally {
        loading.classList.add("hidden");
        btn.disabled = false;
    }
}

function mostrarError(mensaje) {
    let errorDiv = document.getElementById("error");
    errorDiv.innerText = mensaje;
    errorDiv.classList.remove("hidden");
}