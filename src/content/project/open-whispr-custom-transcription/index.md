---
title: "open-source contribution to open-whispr project"
description: "A feature contribution that allows users to specify a custom model for cloud-based transcriptions in the open-whispr project, providing greater flexibility and enabling the use of different or API-base models."
publishDate: 2025-8-26
techStack:
  - ElectronJS
  - TypeScript
  - React
githubUrl: "https://github.com/aMIrmxc/open-whispr-fork"
---

## Overview

This open-source contribution introduces a new feature to the [open-whispr](https://github.com/OpenWhispr/openwhispr) project that allows users to specify a custom transcription model for cloud-based audio transcriptions. This enhancement provides greater flexibility by enabling users to leverage different or fine-tuned Whisper models.

## Changes Made

### 1. Custom Transcription Model Support

The core of this feature is the ability to define a custom transcription model via the application's settings.

**`src/helpers/audioManager.js`:**

A new method, `getTranscriptionModel()`, has been added to resolve the transcription model to be used. It prioritizes the model specified in `localStorage` (`cloudTranscriptionModel`). If no custom model is set, it defaults to `whisper-1`. The `processWithOpenAIAPI` method now uses this dynamic model when making requests to the transcription endpoint.

### 2. UI Enhancements

To expose this new setting to the user, new input fields have been added to both the onboarding process and the main settings page.

**`src/components/OnboardingFlow.tsx`:**

A new component has been added to allow users to enter their desired transcription model during initial setup. A descriptive paragraph is included to inform the user about the purpose of this setting and its default value.

**`src/components/SettingsPage.tsx`:**

A corresponding "Custom Model Name" input field has been added under the "Transcription" section. This allows users to view and modify the transcription model at any time after the initial setup.

## How to Use

1. Navigate to the application's settings or the onboarding flow
2. Locate the "Transcription Model" input field
3. Enter the name of the desired Whisper-compatible model (e.g., a fine-tuned model name)
4. If left blank, the system will default to `whisper-1`

## Benefits

This enhancement empowers users to leverage their own transcription models, which is particularly useful for:

- Specialized use cases requiring specific model capabilities
- Taking advantage of the latest model improvements
- Using fine-tuned models for domain-specific transcription needs
