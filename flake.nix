{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-22.11";
    unstable.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    rust-overlay.url = "github:oxalica/rust-overlay";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, rust-overlay, flake-utils, ... } @ inputs:
    {
      overlays = {
        channels = final: prev: {
          # expose other channels via overlays
          unstable = import inputs.unstable { system = prev.system; };
        };
      };
    } // flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import inputs.nixpkgs {
          inherit system;
          overlays = [ rust-overlay.overlays.default ]; # ++ builtins.attrValues self.overlays;
        };
        unstable = import inputs.unstable { };
      in
      {
        devShells.default = import ./shell.nix { inherit pkgs unstable; };
        formatter = pkgs.nixpkgs-fmt;
      }
    );
}
