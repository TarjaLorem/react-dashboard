# React dashboard — effects & cleanup

A small dashboard of independent widgets. Each one is an exercise in **where a
`useEffect` belongs, why it needs a matching cleanup, and when no effect is
needed at all**.

Guiding rules followed throughout:

- An effect is only for synchronizing with something outside React (timers,
  browser events, `document`, `localStorage`, the network).
- If an effect switches something on, its cleanup switches it back off — so the
  widget leaves nothing running when it unmounts or updates.
- Values that can be computed from props/state are computed during render, not
  copied into state via an effect.
- Dependency arrays are honest; `react-hooks/exhaustive-deps` is never
  suppressed.

## Tech stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4 (via `@tailwindcss/vite`)

## Running the project

```bash
npm install
npm run dev        # start the dev server (prints a localhost URL)
```

Other scripts:

```bash
npm run build      # type-check (tsc -b) + production build to dist/
npm run preview    # serve the production build locally
npm run lint       # eslint
```

## Project layout

```
src/
  App.tsx                    grid that renders every widget
  main.tsx                   React entry point (StrictMode)
  components/WidgetCard.tsx   shared card shell (title + content)
  widgets/                    one file per widget
```

## Widgets

### Stopwatch (`widgets/Stopwatch.tsx`)

Elapsed time with **Start / Pause** and **Reset**.

- Time is kept as timestamps (`accumulatedMs` + `now - runStartedAt`), so it
  stays accurate even if interval ticks are throttled in a background tab. The
  displayed `mm:ss.cc` string is formatted during render.
- One effect owns the single `setInterval`, keyed on `runStartedAt`; its cleanup
  clears the interval on pause, reset, and unmount — never more than one timer.
- Pressing **Start** repeatedly can't make the clock run fast: a guard ignores
  the press while already running, and `runStartedAt` only transitions once so
  the effect never spawns a second interval.

### Connection status (`widgets/ConnectionStatus.tsx`)

A `🟢 Online` / `🔴 Offline` indicator that updates automatically.

- Uses `useSyncExternalStore` to subscribe to the window `online` / `offline`
  events — the right primitive for reading a live browser value (no effect, no
  render/subscribe gap).
- The `subscribe` function returns an unsubscribe that removes both listeners on
  unmount.
- Test it: DevTools → Network → set to **Offline**, then back to **No
  throttling**.

### Window size (`widgets/WindowSize.tsx`)

Live `width × height` of the window, updating on resize.

- One effect adds a `resize` listener and removes it on cleanup — that's the
  whole lifecycle.
- The initial value comes from the `useState` initializer, so the first render
  is already correct.
- No manual throttle: the browser already fires `resize` at roughly one event
  per frame.

### Persistent note (`widgets/PersistentField.tsx`)

A text field whose value survives a page reload, with the character count shown
in the browser tab title.

- The `useState` initializer seeds from `localStorage`; a `[value]` effect writes
  it back on every change.
- A second effect syncs `document.title` to `(N) React dashboard`. It captures
  the previous title first and **restores it on cleanup**, so the widget never
  leaves the global tab title mutated after it unmounts, and the count prefix
  doesn't stack up across updates.
- The character count is derived during render.

### Info modal (`widgets/InfoModal.tsx`)

A button that opens a simple dialog (icon + heading + description). **Esc**
closes it.

- One effect, gated on `isOpen`: it adds a `keydown` listener (for Esc) and locks
  `document.body` scroll — but only while the modal is open.
- Cleanup removes the listener and restores the previous `overflow` value. It
  runs on close, on Esc, and on unmount, so no global listener or scroll lock
  outlives the open modal.
- The modal itself is just conditionally-rendered JSX driven by `isOpen`.

### Live search (`widgets/LiveSearch.tsx`)

Search users by email against `https://jsonplaceholder.typicode.com/users`
(`?email_like=`), querying only after typing pauses, and never showing stale
results.

- One effect keyed on the trimmed query. It does **not** fetch immediately — it
  schedules the request with `setTimeout` (debounce). Each keystroke re-runs the
  effect and the cleanup `clearTimeout`s the pending call, so the request only
  goes out ~400 ms after the last keystroke.
- Each run creates an `AbortController`; cleanup calls `controller.abort()`, so a
  superseded request is actually cancelled. Its response is also stamped with the
  query that produced it, and render only trusts it when that matches the current
  input — a slow earlier response can never overwrite a newer one.
- Loading, empty, and error states are all derived during render from the query
  string and the stored result. `setState` happens only inside the async
  callback, not synchronously in the effect body.
- Test it: DevTools → Network → **Slow 3G**, type a few letters quickly, and only
  the final query's results ever render.
