{ pkgs ? import <nixpkgs> {} }:
  pkgs.mkShell {
    nativeBuildInputs = with pkgs.buildPackages; [
      nodejs
      live-server
    ];

    hardeningDisable = [ "fortify" ];
}
