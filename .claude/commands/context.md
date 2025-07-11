---
description: Get quick context about the current project and recent work
allowed-tools: [Read, Bash, Grep, Glob, LS]
---

Provide a comprehensive context summary of the current project including:

1. **Project Overview**: 
   - Read CLAUDE.md for project-specific instructions
   - Check README.md for general project information

2. **Current State**:
   !git status --short
   !git log --oneline -10

3. **Recent Changes**:
   !git diff --stat HEAD~5..HEAD

4. **Architecture Summary**:
   - Key directories and their purposes from CLAUDE.md
   - Main entry points (glt_menu.py, glt.py)
   - Available scripts in scripts/ directory

5. **Configuration Status**:
   - Check if .env file exists
   - Verify essential environment variables are set

6. **Development Commands**:
   - Testing: pytest
   - Linting: flake8, mypy, black
   - Menu: python glt_menu.py

Focus: $ARGUMENTS

Provide a concise summary focusing on what's most relevant for continuing work.