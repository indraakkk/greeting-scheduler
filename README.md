# Tech stack

- NextJs
- HonoJs as API routes (to do) \*runtime edge issue with drizzle
- Postgresql
- Drizzle ORM (core, kit, studio)

# Libraries

- Moment.js
- Node Cron

# Development Environment

- Nix (flake)

# How to run

- Install nix if not exist [text](#install-nix)
- Run Nix command

```bash
nix develop .
```

- once complete, install NextJs Deps

```bash
pnpm install
```

\*node+pnpm already installed inside flake

- Setup Postgresql

```bash
pg-setup
pg-start
pg-console
```

\*pg-console is to check if you can access the Postgresql console

# Install Nix

- follow this tutorial from [zero-to-nix](https://zero-to-nix.com/start/install)
- activate flake [nix-flake](https://nixos.wiki/wiki/Flakes)
  add this line to your `$HOME/.config/nix/nix.conf`

```
experimental-features = nix-command flakes
```
