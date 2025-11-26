# PDA Engine

A web-based mathematical expression parser and evaluator built with Pushdown Automata (PDA) principles. Convert expressions between different notations and calculate results in real-time.

## What Does It Do?

PDA Engine lets you:
- Convert mathematical expressions between **infix** (A + B), **postfix** (AB+), and **prefix** (+ A B) notations
- Evaluate expressions and get numerical results
- Validate expression syntax with helpful error messages

Perfect for learning about compiler design, expression parsing, and the Shunting Yard algorithm.

## Quick Start

### Prerequisites

- Node.js 18+ and npm installed on your system

### Setup & Run

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   
   Navigate to `http://localhost:5173`

That's it! Start converting expressions.

## Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Docker Deployment

Build and run with Docker:

```bash
# Build the image
docker build -t pda-engine .

# Run the container
docker run -p 8080:80 pda-engine
```

Access at `http://localhost:8080`

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Project Structure

```
src/
├── components/          # React components
│   └── ExpressionConverter.jsx
├── utils/              # Core logic
│   └── PdaLogic.js    # PDA algorithms
├── App.jsx            # Root component
└── main.jsx           # Entry point
```

## How It Works

The engine uses classic computer science algorithms:
- **Shunting Yard Algorithm** for infix to postfix conversion
- **Stack-based evaluation** for calculating results
- **Pushdown Automata** principles for parsing

All conversions normalize to postfix notation as an intermediate representation, then convert to the target format.
