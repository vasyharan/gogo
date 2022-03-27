{ pkgs ? import <nixpkgs> {} }:
  let 
    diesel-cli = pkgs.diesel-cli.override {
      sqliteSupport = false;
      postgresqlSupport = true;
      mysqlSupport = false;
    };
  in
    pkgs.mkShell rec {
      buildInputs = with pkgs; [
        rustup
        rust-analyzer
        diesel-cli
        nodejs
        nodePackages.pnpm
        nodePackages.typescript
        nodePackages.typescript-language-server

        libiconv
        postgresql
      ];
      RUSTC_VERSION = pkgs.lib.readFile ./rust-toolchain;
      # Add libvmi precompiled library to rustc search path
      shellHook = ''
        export PATH=$PATH:~/.cargo/bin
        export PATH=$PATH:~/.rustup/toolchains/$RUSTC_VERSION-x86_64-unknown-linux-gnu/bin/
      '';
    }
