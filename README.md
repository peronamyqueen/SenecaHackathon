# Team

| Name              | Seneca Email            |
| ----------------- | ----------------------- |
| Issa Abishev      | iabishev@myseneca.ca    |
| Mukhit AKimzhanov | makimzhanov@myseneca.ca |

# Getting started

### First , clone the repo

```
git clone https://github.com/peronamyqueen/SenecaHackathon.git
```

### Now , install Ollama model 3.2

On Mac/Linux:

```
curl -fsSL https://ollama.com/install.sh | sh
```

On Windows:

- Go to https://ollama.com/download
- Download the Windows installer
- Run it (just like installing any program)

### Start Ollama

Open your terminal and run:

```
ollama serve
```

This starts Ollama in the background. Keep this terminal open! It's like starting a server.

### Download an AI Model

Open a new terminal window and run:

```
ollama pull llama3.2
```

This downloads the AI model (about 2-4GB). Think of it like downloading a game or app.

### Run both backend and frontend :

```
cd frontend && npm run dev
```

```
cd server && npm run dev
```
