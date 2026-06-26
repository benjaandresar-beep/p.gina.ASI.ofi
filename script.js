/* =========================================================
   Mi cuerpo es mío · Semáforo del cuerpo
   Lógica de la página
   ========================================================= */

/* ----------------------------------------------------------
   1. ADVERTENCIA inicial
   ---------------------------------------------------------- */
const advCheck = document.getElementById("adv-check");
const advEntrar = document.getElementById("adv-entrar");
const advertencia = document.getElementById("advertencia");
const pagina = document.getElementById("pagina");

advCheck.addEventListener("change", () => {
  advEntrar.disabled = !advCheck.checked;
});

advEntrar.addEventListener("click", () => {
  if (advCheck.checked) {
    advertencia.classList.add("oculto");
    pagina.classList.remove("oculto");
    window.scrollTo(0, 0);
  }
});

/* ----------------------------------------------------------
   2. DATOS DE LAS ZONAS DEL CUERPO
   Basado en la "Regla de Kiko" (Consejo de Europa):
   las zonas que cubre la ropa interior / el traje de baño
   son privadas y nadie debe tocarlas.

   tipo: "verde"  -> se puede tocar (con permiso)
         "amarillo"-> depende, presta atención
         "rojo"   -> zona privada, nadie debe tocar

   figura: hotspot {cx,cy,rx,ry} sobre la silueta (o null)
   ---------------------------------------------------------- */
const ZONAS = [
  {
    id: "cabeza", etiqueta: "Cabeza y cara", tipo: "verde",
    figura: { cx: 150, cy: 66, rx: 40, ry: 40 },
    desc: "La cabeza, el pelo y la cara. Normalmente está bien que personas de confianza te despeinen con cariño o te den un beso en la mejilla o la frente.",
    tip: "Aun así, tu cuerpo es tuyo: si no quieres un beso o una caricia, puedes decir «no, gracias»."
  },
  {
    id: "hombros", etiqueta: "Hombros y espalda alta", tipo: "verde",
    figura: { cx: 150, cy: 128, rx: 46, ry: 12 },
    desc: "Los hombros y la parte alta de la espalda. Está bien una mano en el hombro de alguien de confianza, por ejemplo para saludar.",
    tip: "Si una caricia dura demasiado o te incomoda, puedes decir «no» y alejarte."
  },
  {
    id: "pecho", etiqueta: "Pecho", tipo: "rojo",
    figura: { cx: 150, cy: 175, rx: 40, ry: 30 },
    desc: "El pecho es una zona privada, de las que cubre la ropa interior o el traje de baño. Nadie debe tocarlo.",
    tip: "Está en rojo en el semáforo: nadie debe tocarlo ni pedirte que lo enseñes o lo toques."
  },
  {
    id: "brazos", etiqueta: "Brazos", tipo: "verde",
    figura: { cx: 91, cy: 200, rx: 15, ry: 58 },
    figura2: { cx: 209, cy: 200, rx: 15, ry: 58 },
    desc: "Los brazos. Está bien chocar los cinco, darse la mano o un abrazo que tú quieras.",
    tip: "Tú decides a quién abrazas. Nadie puede obligarte."
  },
  {
    id: "barriga", etiqueta: "Barriga", tipo: "amarillo",
    figura: { cx: 150, cy: 250, rx: 34, ry: 30 },
    desc: "La barriga o el abdomen. Depende: a veces unas cosquillas con personas de confianza están bien, pero si te incomoda puedes decir basta.",
    tip: "«Basta» significa basta. Si alguien no se detiene cuando lo pides, cuéntalo."
  },
  {
    id: "manos", etiqueta: "Manos", tipo: "verde",
    figura: { cx: 91, cy: 286, rx: 17, ry: 17 },
    figura2: { cx: 209, cy: 286, rx: 17, ry: 17 },
    desc: "Las manos. Saludar, dar la mano o chocar los cinco está bien.",
    tip: "Nadie debe usar tus manos para que toques sus zonas privadas. Si pasa, cuéntalo."
  },
  {
    id: "intima", etiqueta: "Zona íntima (genitales)", tipo: "rojo",
    figura: { cx: 150, cy: 325, rx: 28, ry: 26 },
    desc: "Las zonas íntimas o genitales, las que cubre la ropa interior o el traje de baño, son totalmente privadas.",
    tip: "Nadie debe tocarlas, mirarlas, fotografiarlas ni pedirte que tú las toques. Si pasa, no es tu culpa: cuéntalo."
  },
  {
    id: "piernas", etiqueta: "Piernas y rodillas", tipo: "amarillo",
    figura: { cx: 132, cy: 440, rx: 17, ry: 90 },
    figura2: { cx: 168, cy: 440, rx: 17, ry: 90 },
    desc: "Las piernas y las rodillas. Depende de la situación. La parte cercana a la ropa interior es privada.",
    tip: "Si una caricia sube hacia las zonas privadas o te incomoda, di «no» y cuéntalo."
  },
  {
    id: "pies", etiqueta: "Pies", tipo: "verde",
    figura: { cx: 128, cy: 566, rx: 22, ry: 13 },
    figura2: { cx: 172, cy: 566, rx: 22, ry: 13 },
    desc: "Los pies. Suele estar bien, por ejemplo al jugar o al ponerte los zapatos con ayuda.",
    tip: "Si algo te incomoda, siempre puedes decirlo."
  },
  {
    id: "cuello", etiqueta: "Cuello", tipo: "amarillo",
    figura: { cx: 150, cy: 112, rx: 16, ry: 11 },
    desc: "El cuello. Depende de la situación y de quién. A veces un abrazo está bien; otras veces puede incomodarte.",
    tip: "Presta atención a cómo te sientes. Si algo te incomoda, puedes apartarte y contarlo."
  },
  {
    id: "boca", etiqueta: "Boca", tipo: "rojo",
    figura: { cx: 150, cy: 92, rx: 13, ry: 8 },
    desc: "La boca es una zona privada. Nadie debe darte besos en la boca ni pedirte besos que te incomoden.",
    tip: "Un beso en la boca de una persona adulta hacia un niño o niña no es un secreto: cuéntalo a alguien de confianza."
  },
  {
    id: "gluteos", etiqueta: "Glúteos (parte de atrás)", tipo: "rojo",
    figura: null, // está en la parte de atrás del cuerpo
    desc: "Los glúteos (el trasero) están en la parte de atrás y también son una zona privada que cubre la ropa interior.",
    tip: "Nadie debe tocarlos sin tu permiso. Si alguien lo hace y te incomoda, cuéntalo a una persona de confianza."
  }
];

const ZONAS_POR_ID = Object.fromEntries(ZONAS.map(z => [z.id, z]));

/* ----------------------------------------------------------
   3. DIBUJAR LA FIGURA SEGÚN EL PERSONAJE
   ---------------------------------------------------------- */
const svg = document.getElementById("figura");

// Pelo y ropa según el género elegido
function decoracion(genero) {
  // Pelo
  let pelo;
  if (genero === "femenino") {
    pelo = `
      <path class="figura-pelo" d="M106,74 Q104,26 150,26 Q196,26 194,74
        Q200,110 196,140 L182,140 Q190,100 184,70 Q150,52 116,70
        Q110,100 118,140 L104,140 Q100,110 106,74 Z"/>`;
  } else if (genero === "masculino") {
    pelo = `
      <path class="figura-pelo" d="M110,70 Q112,32 150,32 Q188,32 190,70
        Q172,52 150,52 Q128,52 110,70 Z"/>`;
  } else { // neutro
    pelo = `
      <path class="figura-pelo" d="M108,74 Q108,28 150,28 Q192,28 192,74
        Q174,54 150,54 Q126,54 108,74 Z"/>`;
  }

  // Ropa interior / traje de baño (marca las zonas privadas)
  let ropa = `
    <path class="figura-ropa" d="M114,300 L186,300 Q192,332 168,352
      Q150,362 132,352 Q108,332 114,300 Z"/>`;
  if (genero === "femenino") {
    // parte de arriba (bikini) sobre el pecho
    ropa += `
      <path class="figura-ropa" d="M112,160 Q150,152 188,160 L188,190
        Q150,198 112,190 Z"/>`;
  }

  return { pelo, ropa };
}

function dibujarFigura(genero) {
  const { pelo, ropa } = decoracion(genero);

  // Capa base (silueta)
  let base = `
    <g class="capa-base">
      <!-- piernas -->
      <rect class="figura-base" x="116" y="348" width="32" height="214" rx="16"/>
      <rect class="figura-base" x="152" y="348" width="32" height="214" rx="16"/>
      <!-- pies -->
      <ellipse class="figura-base" cx="128" cy="566" rx="22" ry="13"/>
      <ellipse class="figura-base" cx="172" cy="566" rx="22" ry="13"/>
      <!-- brazos -->
      <rect class="figura-base" x="78" y="128" width="26" height="150" rx="13"/>
      <rect class="figura-base" x="196" y="128" width="26" height="150" rx="13"/>
      <!-- manos -->
      <circle class="figura-base" cx="91" cy="286" r="16"/>
      <circle class="figura-base" cx="209" cy="286" r="16"/>
      <!-- cadera -->
      <rect class="figura-base" x="112" y="298" width="76" height="62" rx="22"/>
      <!-- torso -->
      <rect class="figura-base" x="108" y="120" width="84" height="190" rx="28"/>
      <!-- cuello -->
      <rect class="figura-base" x="140" y="100" width="20" height="22" rx="8"/>
      ${ropa}
      <!-- cabeza -->
      <circle class="figura-base" cx="150" cy="70" r="42"/>
      ${pelo}
      <!-- cara -->
      <circle class="figura-rasgo" cx="136" cy="68" r="3.5"/>
      <circle class="figura-rasgo" cx="164" cy="68" r="3.5"/>
      <path class="figura-ropa-borde" d="M138,90 Q150,98 162,90" stroke="#a06a4a" stroke-width="2.5" fill="none"/>
    </g>`;

  // Capa de zonas interactivas (hotspots)
  let hotspots = '<g class="capa-zonas">';
  for (const z of ZONAS) {
    if (!z.figura) continue;
    hotspots += hotspot(z, z.figura);
    if (z.figura2) hotspots += hotspot(z, z.figura2);
  }
  hotspots += "</g>";

  svg.innerHTML = base + hotspots;

  // Conectar los eventos de cada zona
  svg.querySelectorAll(".zona").forEach(el => {
    el.addEventListener("click", () => seleccionarZona(el.dataset.id, true));
    el.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        seleccionarZona(el.dataset.id, true);
      }
    });
  });

  // Mantener resaltada la zona seleccionada al cambiar de personaje
  if (estado.zona) marcarZonaEnFigura(estado.zona);
}

function hotspot(z, f) {
  return `<ellipse class="zona zona-${z.tipo}" data-id="${z.id}"
    cx="${f.cx}" cy="${f.cy}" rx="${f.rx}" ry="${f.ry}"
    tabindex="0" role="button"
    aria-label="${z.etiqueta}. Zona ${z.tipo}."></ellipse>`;
}

/* ----------------------------------------------------------
   4. PANEL DE INFORMACIÓN AL TOCAR UNA ZONA
   ---------------------------------------------------------- */
const panelInfo = document.getElementById("panel-info");

const NOMBRE_COLOR = {
  verde: "Se puede tocar (con tu permiso)",
  amarillo: "Depende · presta atención",
  rojo: "Zona privada · nadie debe tocar"
};
const EMOJI_COLOR = { verde: "✅", amarillo: "⚠️", rojo: "⛔" };

function mostrarPanel(zona) {
  panelInfo.innerHTML = `
    <div class="panel-detalle">
      <div class="panel-encabezado">
        <span class="etiqueta-color ${zona.tipo}">${EMOJI_COLOR[zona.tipo]} ${zona.tipo}</span>
      </div>
      <h3>${zona.etiqueta}</h3>
      <p class="panel-sub"><strong>${NOMBRE_COLOR[zona.tipo]}</strong></p>
      <p class="panel-desc">${zona.desc}</p>
      <p class="panel-tip">💡 ${zona.tip}</p>
    </div>`;
}

/* ----------------------------------------------------------
   5. ESTADO + SELECCIÓN COMPARTIDA (figura <-> semáforo)
   ---------------------------------------------------------- */
const estado = { genero: "neutro", zona: null, sentir: null };

function seleccionarZona(id, scrollPanel) {
  const zona = ZONAS_POR_ID[id];
  if (!zona) return;
  estado.zona = id;
  mostrarPanel(zona);
  marcarZonaEnFigura(id);
  marcarBotonZona(id);
  actualizarMensaje();
}

function marcarZonaEnFigura(id) {
  svg.querySelectorAll(".zona").forEach(el => {
    el.classList.toggle("seleccionada", el.dataset.id === id);
  });
}

/* ----------------------------------------------------------
   6. SELECTOR DE PERSONAJE
   ---------------------------------------------------------- */
document.querySelectorAll(".chip-personaje").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".chip-personaje").forEach(b => b.classList.remove("activo"));
    btn.classList.add("activo");
    estado.genero = btn.dataset.genero;
    dibujarFigura(estado.genero);
  });
});

/* ----------------------------------------------------------
   7. SEMÁFORO DE COMUNICACIÓN
   ---------------------------------------------------------- */
const zonasBotones = document.getElementById("zonas-botones");

// Botones de zona (incluye las que no tienen hotspot, como glúteos)
ZONAS.forEach(z => {
  const b = document.createElement("button");
  b.className = "btn-zona";
  b.dataset.id = z.id;
  b.innerHTML = `<span class="mini-punto ${z.tipo}"></span>${z.etiqueta}`;
  b.addEventListener("click", () => {
    seleccionarZona(z.id);
    // si la zona tiene panel, mostrarlo también
    mostrarPanel(z);
  });
  zonasBotones.appendChild(b);
});

function marcarBotonZona(id) {
  zonasBotones.querySelectorAll(".btn-zona").forEach(b => {
    b.classList.toggle("activo", b.dataset.id === id);
  });
}

// Luces del semáforo
const FRASE_SENTIR = {
  rojo: "Algo me hizo sentir mal o tocaron una zona privada. Necesito ayuda.",
  amarillo: "Algo me incomoda o me confunde. No estoy seguro/a.",
  verde: "Me siento seguro/a y bien."
};
const GUIA_ADULTO = {
  rojo: "Por favor, mantén la calma, créele, dile que no es su culpa y busca apoyo de un profesional o de un servicio de ayuda.",
  amarillo: "Pregúntale con calma y sin presionar qué le incomoda. Hazle saber que puede contar contigo.",
  verde: "¡Genial! Refuerza que está bien y recuérdale que siempre puede contarte cualquier cosa."
};

document.querySelectorAll(".luz").forEach(luz => {
  luz.addEventListener("click", () => {
    document.querySelectorAll(".luz").forEach(l => l.classList.remove("activo"));
    luz.classList.add("activo");
    estado.sentir = luz.dataset.sentir;
    actualizarMensaje();
  });
});

/* ----------------------------------------------------------
   8. MENSAJE PARA LA PERSONA ADULTA
   ---------------------------------------------------------- */
const mensajeResultado = document.getElementById("mensaje-resultado");
const mensajeTexto = document.getElementById("mensaje-texto");

function actualizarMensaje() {
  if (!estado.zona || !estado.sentir) return;
  const zona = ZONAS_POR_ID[estado.zona];
  mensajeTexto.innerHTML =
    `Eligió la zona <strong>«${zona.etiqueta}»</strong> y el color ` +
    `<strong>${estado.sentir.toUpperCase()}</strong>: «${FRASE_SENTIR[estado.sentir]}»<br><br>` +
    `<em>${GUIA_ADULTO[estado.sentir]}</em>`;
  mensajeResultado.classList.remove("oculto");
  mensajeResultado.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

document.getElementById("btn-limpiar").addEventListener("click", () => {
  estado.zona = null;
  estado.sentir = null;
  mensajeResultado.classList.add("oculto");
  document.querySelectorAll(".luz").forEach(l => l.classList.remove("activo"));
  marcarBotonZona(null);
  marcarZonaEnFigura(null);
  panelInfo.innerHTML = `
    <div class="panel-vacio">
      <span class="panel-emoji" aria-hidden="true">👆</span>
      <p>Pulsa una zona del cuerpo para ver qué significa su color.</p>
    </div>`;
});

/* ----------------------------------------------------------
   9. INICIO
   ---------------------------------------------------------- */
dibujarFigura(estado.genero);
