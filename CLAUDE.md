# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Good Math** is an educational React application for interactive math practice. It's a single-file component designed to be integrated into a larger React project.

**Current State**: This repository contains only the React component file with no build system, package manager configuration, or testing infrastructure. The component is production-ready but requires integration into a React project with appropriate tooling.

## Architecture

### Single-File Component Structure

The entire application lives in `good-math-app.tsx` (~730 lines). All UI, state management, and business logic are contained in the `GoodMath` component.

### Mode-Based Navigation

The app uses a single state variable (`mode`) to manage 6 distinct views:

- `'home'` - Main menu with 4 options
- `'setup-practice'` - Operation and difficulty selection
- `'practice'` - Interactive problem-solving with streak tracking
- `'calculator'` - Calculator with operation history
- `'history'` - Progress dashboard showing solved problems
- `'test-creator'` - Custom test builder with print functionality

Navigation is handled by `setMode()` calls rather than a routing library.

### State Management

**Local React hooks only** - no Redux, Context, or external state libraries:

- Problem generation and current problem state
- User input and answer validation
- Solved problems array (persisted to localStorage)
- Test creation state
- Streak counter
- Calculator state and history

**Persistence**: The `solvedProblems` array is persisted to localStorage under the key `'goodMathProblems'`. Each solved problem includes:
- `num1`, `num2` - The operands
- `operation` - String: 'addition', 'subtraction', 'multiplication', or 'division'
- `answer` - Correct answer
- `userAnswer` - User's response
- `date` - ISO timestamp
- `difficulty` - 'easy', 'medium', or 'hard'

### Problem Generation Algorithm

**Important implementation details**:

1. **Difficulty ranges** (defined in `getRandomNumber()`):
   - Easy: 1-10
   - Medium: 1-20
   - Hard: 1-50

2. **Subtraction**: Numbers are automatically swapped if `num2 > num1` to prevent negative results (lines 36-38)

3. **Division**: Uses a reverse-calculation approach to ensure whole number results (lines 40-49):
   - Generates a small divisor (1-10, always 'easy' range)
   - Generates the answer based on selected difficulty
   - Calculates `num1 = divisor × answer`
   - This guarantees the division problem has a whole number solution

4. **Operations**: Stored as strings ('addition', 'subtraction', 'multiplication', 'division') internally, but displayed as symbols (+, -, ×, ÷) via `getOperationSymbol()`

### Dependencies

Required in host project:
- `react` (17+ with hooks)
- `lucide-react` (for icons)
- Tailwind CSS (for styling)

The component uses these Lucide icons: Plus, Minus, X, Divide, Star, Trophy, BookOpen, Printer, Sparkles, TrendingUp

## Integration Requirements

This component is designed to be imported into an existing React project:

1. The host project must provide:
   - React build environment (Next.js, Vite, Create React App, etc.)
   - Tailwind CSS configuration
   - `lucide-react` package installed

2. Import and use:
   ```tsx
   import GoodMath from './good-math-app'

   function App() {
     return <GoodMath />
   }
   ```

## Key Features

- **4 operations**: Addition, subtraction, multiplication, division
- **3 difficulty levels**: Easy (1-10), medium (1-20), hard (1-50)
- **Gamification**: Streak counter for consecutive correct answers
- **Progress tracking**: Total problems solved and today's count
- **Custom test creation**: Build and print custom math worksheets
- **Calculator**: Full calculator with operation history
- **Responsive design**: Mobile-friendly Tailwind CSS layout with large touch targets

## File Structure

```
/
├── good-math-app.tsx    # Main application component (entire app)
└── CLAUDE.md            # This file
```

## Development Workflow

Since there's no build system configured yet:

- No `npm install`, `npm run dev`, or `npm test` commands available
- No linting or formatting tools configured
- No test suite exists
- Component must be integrated into a React project to develop/preview
- No git commits have been made yet (repository initialized but empty)

If setting up a development environment, recommended additions would include:
- Package.json with React, TypeScript, Tailwind CSS dependencies
- Build tool (Vite recommended for speed)
- ESLint/Prettier for code quality
- Testing library (Vitest + React Testing Library)
