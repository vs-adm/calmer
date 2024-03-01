# Meditation App Backend

This project serves as the backend for a Meditation App, providing dynamic 
text-to-speech (TTS) functionality using ElevenLabs API and generating meditation 
hints with OpenAI's GPT model. It's built with Express.js and uses EJS for templating.

## Features

- Serve a main page with meditation content.
- Generate meditation hints using OpenAI's GPT-4 model.
- Synthesize speech from text using ElevenLabs API.
- Stream synthesized speech back to the client as audio.

## Getting Started

### Prerequisites

- Node.js installed on your machine.
- An OpenAI API key.
- An ElevenLabs API key.

### Installation

1. Clone the repository:

2. Install dependencies

```
yarn install
```

3. Set environment variables

```
cp .env.sample .env
vim .env
```

4. Start the server

```
yarn start
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any bugs or feature requests.

## License

This project is open source and available under the MIT License.

## Acknowledgments

* OpenAI for the GPT-4 model.
* ElevenLabs for the TTS API.
