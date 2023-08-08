// ==UserScript==
// @name         OmeRizz Script
// @namespace    https://github.com/notcobalt/OmeRizz
// @version      0.1
// @description  Rizzler for Estonia ome.tv
// @author       You
// @match        https://ome.tv/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    const MAX_PROMPT_ALLOWED = 3;
    const RESET_TIME_INTERVAL = 5 * 60 * 1000;

    const lastPromptTime = GM_getValue('lastPromptTime', 0);
    const promptCount = GM_getValue('promptCount', 0);

    if (Date.now() - lastPromptTime > RESET_TIME_INTERVAL) {
        GM_setValue('lastPromptTime', Date.now());
        GM_setValue('promptCount', 0);
    }

    GM_addStyle(`
        #omeRizzButton {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 30%;
            background: url('https://raw.githubusercontent.com/notcobalt/OmeRizz/main/Rizzler.png') no-repeat center;
            background-size: cover;
            cursor: pointer;
            z-index: 9999;
            animation: gradientAnimation 3s linear infinite;
        }
        @keyframes gradientAnimation {
            0% {
                box-shadow: 0 0 0 2px transparent, 0 0 0 2px #1e5799;
            }
            33.33% {
                box-shadow: 0 0 0 2px transparent, 0 0 0 2px #f300ff;
            }
            66.66% {
                box-shadow: 0 0 0 2px transparent, 0 0 0 2px #e0ff00;
            }
            100% {
                box-shadow: 0 0 0 2px transparent, 0 0 0 2px #1e5799;
            }
        }
        #omeRizzPrompt {
            position: fixed;
            top: 80px;
            right: 20px;
            width: 300px;
            padding: 10px;
            background-color: rgba(0, 0, 0, 0.8);
            border-radius: 10px;
            display: none;
            z-index: 9998;
        }
        #omeRizzPrompt p {
            color: white;
            margin: 0;
            padding: 5px;
            cursor: pointer;
        }
    `);

    const button = document.createElement('div');
    button.id = 'omeRizzButton';
    document.body.appendChild(button);

    const promptBar = document.createElement('div');
    promptBar.id = 'omeRizzPrompt';
    document.body.appendChild(promptBar);

    let isOpen = false;

    function togglePromptBar() {
        isOpen = !isOpen;
        promptBar.style.display = isOpen ? 'block' : 'none';
    }

    function fetchSinglePrompt() {
        fetch('https://raw.githubusercontent.com/notcobalt/OmeRizz/main/EE')
            .then(response => response.text())
            .then(data => {
                const prompts = data.split('\n');
                if (prompts.length > 0) {
                    promptBar.innerHTML = '';
                    const randomIndex = Math.floor(Math.random() * prompts.length);
                    const selectedPrompt = prompts[randomIndex];
                    const promptElement = document.createElement('p');
                    promptElement.textContent = selectedPrompt;
                    promptElement.addEventListener('click', () => {
                        // Use prompt for your own functionality
                        console.log('Selected Prompt:', selectedPrompt);
                    });
                    promptBar.appendChild(promptElement);
                }
            });
    }

    button.addEventListener('click', () => {
        if (promptCount < MAX_PROMPT_ALLOWED) {
            togglePromptBar();
            if (isOpen) {
                fetchSinglePrompt();
                GM_setValue('promptCount', promptCount + 1);
            }
        }
    });

    promptBar.addEventListener('dblclick', () => {
        fetchSinglePrompt();
    });
})();
