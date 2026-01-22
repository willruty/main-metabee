# Metabee

## Overview
Metabee is an educational platform prototype created for a robotics school, designed to explore modern approaches to online learning and assisted education.

Although originally an academic project, it was extended beyond the required scope as a personal initiative, focusing on backend integration, automation, and AI-assisted learning.

## Problem
Traditional educational platforms often struggle to offer personalized learning experiences and interactive assistance outside of live classes.

Metabee aims to explore how automation and AI can enhance online education by providing guided learning, interactive support, and scalable content delivery.

## Solution
The platform was designed as a multi-component system supporting:

- Online course access
- AI-assisted learning through conversational interaction
- Course purchasing flow
- Certificate issuance

A key focus of the project was integrating AI into the learning experience to help students explore concepts and navigate the platform more effectively.

## Main Features

- AI-powered learning assistant for guided study and exploration
- Online course structure
- Course purchase flow (conceptual implementation)
- Certificate generation (conceptual)
- Backend-driven logic and integrations

## Tech Stack

- Backend: Go
- Frontend: TypeScript
- Database: MongoDB
- Automation: n8n
- AI: Gemini

## Architecture
The project follows a service-oriented approach:

- A backend service written in Go handling core logic and integrations
- A frontend built with TypeScript for user interaction
- MongoDB used for flexible data storage
- n8n used to orchestrate automation workflows
- Gemini integrated as an AI assistant for educational support

The AI chat component is fully functional and represents the most complete part of the system.

## Key Technical Decisions

- Use of AI to support learning rather than replace instruction
- Flexible schema design using MongoDB
- Automation workflows to connect platform actions and AI responses
- Backend-first approach, with AI treated as an integrated service

## Limitations

- Course video streaming from cloud storage was not completed
- Desktop compilation was not finalized
- Integration with a 3D simulator was not implemented
- Some planned features remain conceptual due to time constraints

## Status

Partially completed.  
Academic project extended with personal development efforts.

The AI-assisted learning component is fully functional, while other parts of the platform remain incomplete.

## Next Steps

- Implement reliable video streaming for course content
- Finalize purchase and certificate flows
- Improve frontend structure and UX
- Explore simulator integration for robotics learning
