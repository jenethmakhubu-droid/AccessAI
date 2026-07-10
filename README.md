# AccessAI

> **Making workplace AI accessible to everyone.**

AccessAI is an AI-powered **Inclusive Workplace Productivity Assistant** designed to help professionals work smarter while promoting accessibility, multilingual communication, and inclusive design. Built with React and TypeScript, AccessAI ensures that workplace technology adapts to people — not the other way around.

---

## Why AccessAI?

Workplace AI tools have transformed how professionals write, plan, research, and communicate. However, many of these tools are not designed with accessibility and inclusion in mind. Professionals with different abilities, language backgrounds, communication preferences, and workplace experiences often face unnecessary barriers when using productivity software.

AccessAI was built on the belief that **workplace AI should adapt to people with diverse needs**. Whether a user prefers simplified language, relies on assistive technologies, communicates in multiple languages, or works in a specialized industry, AccessAI is designed to support them from the very first interaction — no account required.

---

## Project Overview

AccessAI combines modern AI-powered productivity features with inclusive design principles. It offers a suite of workplace tools that help users complete common professional tasks more efficiently, while ensuring the experience remains accessible, responsive, and easy to use across devices.

This project is suitable for:

- Academic presentations and assignments
- Professional portfolios
- Accessibility and inclusive design demonstrations
- AI-powered SaaS product showcases

---

## Problem Statement

Professionals spend a significant portion of their time on repetitive workplace tasks, including:

- Writing and replying to emails
- Summarizing meetings and extracting action items
- Planning tasks and prioritizing schedules
- Researching information and gathering insights
- Simplifying complex documents for different audiences

While many AI productivity tools exist, they often:

- Ignore accessibility needs such as visual contrast, text size, and screen reader support
- Assume a one-size-fits-all communication style
- Require user accounts or subscriptions before allowing access
- Offer limited multilingual or plain-language support

AccessAI addresses these gaps by placing **inclusion, accessibility, and flexibility** at the center of the user experience.

---

## Solution

AccessAI provides a clean, responsive, and accessible workspace where users can instantly access AI-powered productivity tools. Every feature is designed with inclusive defaults:

- Clear, readable interfaces with adjustable text sizes
- High contrast mode for improved visibility
- Text-to-speech support for reading AI responses aloud
- Plain-language explanations and translation options
- Optional workplace profiles to personalize AI responses
- Full keyboard navigation and mobile responsiveness

By combining practical AI assistance with inclusive design, AccessAI helps professionals communicate more effectively, plan more efficiently, and access information more confidently.

---

## Features

| Feature | Description |
|--------|-------------|
| **Email Assistant** | Generate professional workplace emails tailored to audience, tone, and purpose. Includes a searchable audience combobox with suggested and custom options. |
| **Meeting Assistant** | Paste meeting notes and receive a structured summary with key decisions, action items, deadlines, and responsibilities. |
| **Task Planner** | Enter a list of tasks and get a prioritized schedule with time blocks, duration estimates, and productivity tips. |
| **Research Assistant** | Submit a research topic and receive a concise summary with key insights, important facts, and recommendations. |
| **Document Simplifier** | Paste complex documents and receive a simplified version with plain-language explanations and key takeaways. |
| **Ava AI Assistant** | Have a conversational workplace chat with an AI assistant that answers questions, offers guidance, and supports daily productivity. |

---

## Accessibility Features

Accessibility is integrated into AccessAI rather than treated as a separate feature. The following inclusive options are built in:

| Feature | Description |
|--------|-------------|
| **High Contrast Mode** | Improves visibility for users with low vision or visual impairments. |
| **Larger Text** | Increases text size across the interface for better readability. |
| **Read Aloud** | Converts AI-generated responses into speech using the browser's text-to-speech engine. |
| **Explain in Simple Language** | Rewrites responses using plain, beginner-friendly language. |
| **Translation** | Translates AI outputs into multiple languages, including local South African languages and global options. |
| **Responsive Design** | Works seamlessly on desktops, tablets, and mobile devices. |
| **Keyboard Navigation** | All interactive elements are accessible via keyboard for users who do not use a mouse. |

---

## Workplace Profiles

Users can optionally select a workplace profile to personalize AI responses without creating an account. Available profiles include:

- Information Technology
- Education
- Healthcare
- Finance
- Human Resources
- Marketing
- Retail
- Legal
- Government
- Business
- Other

These profiles help AccessAI tailor examples, terminology, and tone to match the user's professional context.

---

## Technologies Used

| Technology | Purpose |
|------------|---------|
| **React** | Frontend user interface |
| **TypeScript** | Type-safe development |
| **Lovable** | Rapid AI-assisted development and deployment |
| **GitHub** | Version control and project hosting |
| **OpenAI API** | Future integration point for AI completions |
| **Gemini API** | Future integration point for AI completions |

---

## Project Structure

```text
AccessAI/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions, constants, and AI logic
│   ├── routes/             # Application pages and routes
│   ├── styles.css          # Global styles and design tokens
│   └── ...
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
└── README.md               # Project documentation
```

> **Note:** This project uses file-based routing through TanStack Start. Route files are located in `src/routes/`.

---

## Installation

Follow these steps to run AccessAI locally using **npm**:

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd AccessAI
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open the application**

   Navigate to `http://localhost:8080` in your browser.

> **Note:** Some AI features require an API key. Add your key to the appropriate environment variable or configuration file as described in the project setup notes.

---

## Future Enhancements

The following improvements are planned for future versions of AccessAI:

- **Voice Commands** — Allow users to interact with AccessAI using speech input.
- **OCR Document Support** — Upload images or scanned documents for summarization and simplification.
- **Calendar Integration** — Connect with calendar services to schedule tasks and meetings automatically.
- **Additional Languages** — Expand translation and language support for more global and regional languages.
- **AI Personalization** — Learn user preferences over time to deliver increasingly tailored responses.
- **Offline Mode** — Enable core features to work without a constant internet connection.

---

## About

> AccessAI was created with the belief that productivity tools should adapt to people — not the other way around. By combining AI-powered workplace assistance with accessibility and inclusive design, AccessAI helps professionals work more efficiently and confidently.

---

## Author

- **Name:** [Your Name]
- **GitHub:** [Your GitHub Profile URL]
- **LinkedIn:** [Your LinkedIn Profile URL]

---

## License

This project is intended for **educational and portfolio use**. You are welcome to explore, modify, and present this project as part of academic coursework, personal portfolios, or professional demonstrations. Commercial use or redistribution requires explicit permission from the author.

---

## Screenshots

> _Screenshots and demo media can be added here once the application is finalized._

```text
[Homepage Screenshot]
[Email Assistant Screenshot]
[Accessibility Settings Screenshot]
```

---

## Repository Links

- **Live Demo:** [Add live deployment URL here]
- **Source Code:** [Add GitHub repository URL here]
- **Documentation:** [Add documentation link if available]

---

_Thank you for exploring AccessAI. Together, we can build workplace technology that works for everyone._
