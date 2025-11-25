# Team

| Name              | Seneca Email            |
| ----------------- | ----------------------- |
| Issa Abishev      | iabishev@myseneca.ca    |
| Mukhit AKimzhanov | makimzhanov@myseneca.ca |

# Description

This project is a web-platform with a job postings . When user loads the page , the client side sends whole job postings dataset to the AI model (Ollama 3.2) to analyze every single posting's transparency. In the future we plan to setup a database that would store all the postings and result for their transparency check . Also , for employer's side , we plan to notify him , if their posting lacks transparency , and how they can fix it

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
cd frontend
npm install
npm run dev
```

```
cd server
npm install
npm run dev
```
