# Lecture AI

A web application that records lectures and generates AI-powered summaries and notes.

---

## Overview

This project allows users to upload lecture recordings and automatically generate summarized notes and key concepts using AI.

---

## Features

- Record and upload audio recordings
- Automatic speech-to-text transcription
- AI-generated summaries
- Extracted key concepts

---

## Tech Criteria

#### LLM and Models
- Workers AI
- Llama 3.3 (Text Summarization)
- Open AI Whisper (Speech to Text)
#### Workflow / coordination
- Workflows
- Worker
- Pages Functions
#### User input via chat or voice
- Pages
#### Memory or state
- Frontend: Local state managed within components using useState
- Backend: State maintained across workflow steps

### Setup
- Frontend: React Vite + Deployed with Cloudflare Pages
- Backend: Workflow deployed on Cloudflare Worker
- AI: Workers AI Binding in Worker

---

## Usage

Run website at this link: https://lecture-ai.pages.dev/
Workflow worker deployed at: [lecture-ai-workflow.favour-iheanyichukwu.workers.dev](http://lecture-ai-workflow.favour-iheanyichukwu.workers.dev)

To run github repository locally see "Installation".

---

## Installation

```bash
# Clone the repository
git clone https://github.com/fabf28/cf_ai_lecture_note_taker_favour_i.git

# Go into the frontend directory
cd frontend

# Install dependencies
npm install

# Build the application
npm run build

#Run the server
npx wrangler pages dev dist