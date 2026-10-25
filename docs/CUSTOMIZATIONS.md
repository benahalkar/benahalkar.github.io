# Site customizations

Deviations from the stock al-folio starter, and how to reverse them. Kept separate from the rest of `docs/` (which mirrors upstream al-folio docs) so it doesn't get confused with or overwritten by an `al-folio upgrade`.

## `_config.yml` changes need a server restart

`bundle exec jekyll serve`'s auto-regeneration/watch only re-renders on changes to content files (posts, pages, images, etc.) — it does **not** reload `_config.yml`. If you edit `_config.yml` and don't see the change after refreshing the browser, restart the server (see below).

## Running / stopping the local dev server

Start (from repo root, in a terminal where `~/.zshrc` has been loaded so `rbenv`/`bundle` are on `PATH` — a new terminal tab, or `source ~/.zshrc`):

```bash
bundle exec jekyll serve --livereload
```

Visit `http://127.0.0.1:4000/`. Leave the terminal open — it prints `Server running... press ctrl-c to stop.`

Stop: press `Ctrl+C` in that terminal.

If you lost the terminal (e.g. closed the tab) and need to kill it from elsewhere:

```bash
pkill -f "jekyll serve"
```

Restart (needed after any `_config.yml`, `Gemfile`, or plugin change): stop it, then run the start command again.

## Search (Cmd+K) disabled

Disabled the `al_search` plugin (the Cmd+K / magnifying-glass command palette) — too heavy for a small personal site and adds to gem install/compile time.

To bring it back:

1. `Gemfile` — uncomment `gem 'al_search', '= 1.0.2'`
2. `_config.yml` — uncomment `- al_search` in the `plugins:` list
3. `_config.yml` — set `search_enabled: true`
4. `bundle install`
