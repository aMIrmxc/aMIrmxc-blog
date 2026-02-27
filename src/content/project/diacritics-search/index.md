---
title: "Pro Search in Persian/Arabic Vocalized Text"
description: "A smart search tool for Persian & Arabic text that recognizes diacritics. Search and highlight text with support for various diacritic forms."
publishDate: 2026-02-20
techStack:
  - JavaScript
  - HTML
  - CSS
githubUrl: "https://github.com/aMIrmxc/Diacritics-search"
demoUrl: "https://amirmxc.github.io/Diacritics-search/"
---

A smart search tool for Persian & Arabic text that recognizes diacritics.

## Features

- 🔍 **Text Search**: find phrases in Persian & Arabic
- ✨ **Diacritic Search**: matches variants (شُکِر, شِکِر, شکر, شُکر, شَکَر)
- 🎨 **Highlight**: color the hits
- 💾 **Storage**: save texts to localStorage
- 📋 **Case-sensitive**: toggle case sensitivity
- 🔤 **Whole-word**: exact word or substring

## Usage

1. Paste your text
2. Enter query
3. Press Search / Enter
4. View highlighted results

### Options

- **Case-sensitive**: on → case matters
- **Whole-word**: on → exact word only
- **Diacritic search**: on → matches any diacritic form
- **Color**: pick highlight color

## Examples

| Text                         | Query | Options                   | Result               |
| ---------------------------- | ----- | ------------------------- | -------------------- |
| شُکِر شِکِر شکر شُکر شَکَر   | شکر   | diacritic on              | all highlighted      |
| شُکِر شِکِر شکر شُکر شَکَر   | شُکر  | diacritic on              | شُکِر & شُکر         |
| من شکر را دوست دارم. شکرستان | شکر   | diacritic on + whole-word | only شکر             |
| الحمدلله رب العالمين         | الحمد | —                         | الحمدلله highlighted |
| شُکِر شِکِر شکر شُکر شَکَر   | شکر   | diacritic off             | only bare شکر        |
