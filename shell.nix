{ pkgs ? import <nixpkgs> { }, ... }:
let
  diesel-cli = pkgs.diesel-cli.override {
    sqliteSupport = false;
    postgresqlSupport = true;
    mysqlSupport = false;
  };
in
pkgs.mkShell
rec {
  buildInputs = with pkgs; [
    rust-bin.nightly."2022-01-20".default
    rust-analyzer
    (diesel-cli.override {
      sqliteSupport = false;
      postgresqlSupport = true;
      mysqlSupport = false;
    })

    nodejs
    nodePackages.pnpm
    nodePackages.typescript
    nodePackages.typescript-language-server

    libiconv
    postgresql
  ];
  shellHook = ''
  '';
}
