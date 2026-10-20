<div align="center">

# ⚡ Session Info

**Una barra lateral para Claude Code que te muestra, en vivo, todo lo que pasa en tu sesión.**

Plugins · Uso · Costo · Contexto · Versión · Modelo · y Clawd caminando

[English](README.md) · **Español**

<img src="images/clawd.gif" alt="Clawd caminando" width="280">

</div>

---

<table>
<tr>
<td width="300" valign="top"><img src="images/screenshot.png" alt="Screenshot de mi proyecto" width="280"></td>
<td valign="top">

### ¿Qué es?

Session Info es un mod para Claude Code que abre un panel a un lado de tu terminal. Mientras trabajas, el panel se actualiza solo y te deja ver de un vistazo:

- 🧩 **Plugins** — cuáles tienes activos
- 📊 **Uso** — tu consumo de la sesión y de la semana, y el costo
- 🧠 **Contexto** — qué tanto de la ventana de contexto llevas y en qué se va
- 🏷️ **Status** — versión de Claude Code y modelo
- 🦀 **Clawd** — la mascota de Claude, para darle vida a tu área de trabajo

Se abre solo en terminales anchas; si no, escribe `/session-info`.

</td>
</tr>
</table>

---

## 🧩 Plugins activos

<table>
<tr>
<td width="300" valign="top"><img src="images/plugins.gif" alt="Plugins activos" width="280"></td>
<td valign="top">

Te muestra **cuáles plugins seleccionaste para que estén activos**.

- <code>●</code> verde: el plugin está activo
- <code>○</code> gris: está instalado pero apagado

Arriba ves el total (por ejemplo `4/4 plugins activos`). Si activas o desactivas un plugin con `/plugin`, el panel cambia en un par de segundos, sin que hagas nada.

</td>
</tr>
</table>

## 📊 Uso de tokens

<table>
<tr>
<td width="300" valign="top"><img src="images/usage.gif" alt="Barras de uso" width="280"></td>
<td valign="top">

Las barras amarillas te muestran tu **sesión actual** y tu **consumo semanal**, con el porcentaje usado y cuándo se reinicia cada una.

Esto te permite **mantener un vistazo a tu consumo mientras trabajas**, sin tener que salir a revisar `/usage`.

Abajo ves el **costo de la sesión**, lo que te ayuda a **mantener un control de tu presupuesto**.

> Las barras aparecen con planes de suscripción, después de la primera respuesta de Claude en la sesión. El costo es el equivalente en API que calcula `/cost`.

</td>
</tr>
</table>

## 🧠 Contexto

<table>
<tr>
<td width="300" valign="top"><img src="images/context.gif" alt="Cuadrícula de contexto" width="280"></td>
<td valign="top">

La misma cuadrícula de `/context`, siempre a la vista. **Cada casilla es 1% de tu ventana de contexto**, y cada color es una categoría.

Es útil para **ir optimizando tu manejo del contexto**: conforme vayas integrando plugins, MCPs o skills, vas a ver si **lo optimizan o lo impactan**. Verlo con iconos es una forma mucho más intuitiva que leer números.

| Icono | Categoría | Qué es |
|:--:|---|---|
| ⛁ | **Sistema** | Las instrucciones base de Claude Code |
| ⛁ | **Herramientas** | Las herramientas integradas (Bash, Read, Edit…) |
| ⛁ | **MCP** | Las herramientas de tus servidores MCP |
| ⛁ | **MCP instr.** | Las instrucciones que agregan tus servidores MCP |
| ⛁ | **Skills** | Las skills disponibles; cada plugin con skills suma aquí |
| ⛁ | **Mensajes** | Tu conversación: mensajes, respuestas y resultados de herramientas. Es lo que más crece |
| ⛝ | **Reserva** | Espacio guardado para la compactación automática; cuando los discos llegan aquí, Claude compacta la conversación |
| ⛶ | **Libre** | Lo que te queda |

</td>
</tr>
</table>

## 🏷️ Status

<table>
<tr>
<td width="300" valign="top"><img src="images/status.png" alt="Status" width="280"></td>
<td valign="top">

Te permite ver **rápidamente en qué versión estás trabajando y con qué modelo**.

Algo invaluable para saber que estás **al día** y que estás usando **el modelo óptimo para tus tareas**.

</td>
</tr>
</table>

## 🦀 Clawd

<table>
<tr>
<td width="300" valign="top"><img src="images/clawd.gif" alt="Clawd caminando" width="280"></td>
<td valign="top">

Clawd, la mascota de Claude Code, camina de lado a lado al fondo del panel en naranja Claude.

No mide nada: está ahí **solo para darle un poco de vida a tu área de trabajo**.

</td>
</tr>
</table>

---

## 📦 Instalación

En Claude Code, desde la terminal:

```
/plugin install session-info --marketplace RedfoxGT/session-info
```

Responde `y` para agregar el marketplace y elige un alcance.

Desde una terminal normal:

```
claude plugin install session-info --marketplace RedfoxGT/session-info
```

En la app de escritorio: haz clic en **+** junto a la caja del prompt, luego **Plugins**, **Add marketplace** con `RedfoxGT/session-info`, y después **Add plugin**.

---

<div align="center">

Hecho por **Byron Juarez** · <a href="mailto:byron@nexxus.dev">byron@nexxus.dev</a>

</div>
