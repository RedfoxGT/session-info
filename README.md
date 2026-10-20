# session-info

[Español](README.es.md)

A Claude Code sidebar that shows, live:

- your installed plugins and which are enabled
- usage limits (session and weekly) as bars
- the context window as the `/context` disc grid, with a per-category breakdown
- version and model
- Clawd, the Claude Code mascot, walking along the bottom

Opens by itself on wide terminals; otherwise run `/session-info`.

## Install

At the prompt of a Claude Code terminal session:

```
/plugin install session-info --marketplace RedfoxGT/session-info
```

Answer `y` to add the marketplace, then pick a scope.

From a shell:

```
claude plugin install session-info --marketplace RedfoxGT/session-info
```

In the desktop app: click + next to the prompt box, then Plugins, Add marketplace with `RedfoxGT/session-info`, then Add plugin.
