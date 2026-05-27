# Métamorphose

## Description

<img width="798" height="662" alt="Screenshot 2026-05-26 at 15 58 44" src="https://github.com/user-attachments/assets/dd9b829a-5580-4359-a4f2-a81578b0f24f" />

Ce jeu met en avant une série de mini-jeux, similaire au processus d'un Warioware, pour explorer les différentes métamorphoses animales existantes. Le public cible est celui de tout âge : n’importe qui peut jouer, comprendre le jeu et essayer de battre son score précédent !

## Installation et lancement

Rendez-vous sur la page itch.io du jeu et cliquez sur « Run » ou téléchargez le dépôt, ouvrez-le dans VS Code et utilisez l'extension « Live Server » pour jouer au jeu dans votre navigateur.

## Assets

Tous les assets visuels ont été créés par moi-même.
La musique vient d'un créateur sur Pixabay; "Cyberwave-Orchestra", le son se nommant "Puzzle Game - Bright Casual Video Game Music". https://pixabay.com/music/video-games-puzzle-game-bright-casual-video-game-music-249202/

## Recours au LLM

J'ai utilisé le LLM (Claude, Sonnet 4.6) pour m'aider dans deux cas spécifiques :

1. Pour créer la mécanique des pop-ups qui apparaissent avant chaque mini-jeu.
Prompt: "hello! how do I change the text in a kaplay game for the text to be black with a white border?"
2. Pour que le texte soit noir, entouré d'une bordure blanche : "hello! here is a code i made for a game using kaplay. What do i do if i want to add a popup window that last a couple seconds at the beginning of each minigame? the popup would be an image (sprite), not a box of text. explain how conceptually and in code."
Claude m'a alors donné une solution pour des boîtes de texte et non un sprite comme demandé ; j'ai décidé de garder ceci au détriment des sprites, car je n'ai pas eu le temps de finir mes sprites de pop-ups.

## Contexte

Ce projet a été créé dans le cadre du cours « Développement de jeux vidéo 2D », dispensé par Loïc Cattani (SLI, Lettres, UNIL).
