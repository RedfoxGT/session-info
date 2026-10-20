# session-info

[English](README.md)

Una barra lateral para Claude Code que muestra en vivo:

- tus plugins instalados y cuáles están activos
- los límites de uso (sesión y semana) como barras
- la ventana de contexto con la cuadrícula de discos de `/context` y el desglose por categoría
- la versión y el modelo
- Clawd, la mascota de Claude Code, caminando al fondo

Se abre sola en terminales anchas; si no, escribe `/session-info`.

## Instalación

En Claude Code, desde la terminal:

```
/plugin install session-info --marketplace RedfoxGT/session-info
```

Responde `y` para agregar el marketplace y elige un alcance.

Desde una terminal normal:

```
claude plugin install session-info --marketplace RedfoxGT/session-info
```

En la app de escritorio: haz clic en + junto a la caja del prompt, luego Plugins, Add marketplace con `RedfoxGT/session-info`, y después Add plugin.
