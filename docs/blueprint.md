# **App Name**: JEE Question Master

## Core Features:

- AI Question Generation: Generates JEE Main-style multiple-choice questions based on subject, topics, and difficulty using the Gemini API. The prompt ensures output includes LaTeX formatting for math equations, which will use a tool to make sure equations are integrated where necessary.
- MathJax Rendering: Renders dynamically generated math equations using MathJax in a display format within question and answer options.
- Dynamic UI/UX: Presents questions in a clear, scrollable card layout. The UI dynamically updates to indicate loading states and error conditions, as well as handling account creation and login.
- Session History: Stores a timestamped history of generated question sets for logged-in users.
- Anonymous generation: Allows users to generate mock JEE papers even without an account. An account is needed only if the user wants to keep the generated question set into the history of sets.

## Style Guidelines:

- Primary color: Use a calming blue (#000000) for headers and primary actions to establish trust and focus.
- Secondary color: A light gray (#f4f4f4) for backgrounds to provide contrast and reduce visual fatigue.
- Accent: A vibrant green (#3D94C0) should highlight correct answers, success states and important CTAs like 'Generate Paper'.
- Use a clean, sans-serif font (like Open Sans) for readability, especially in question content. Use swiss typography with unique fonts and styles.
- Incorporate math-related icons to visually represent different subjects (physics, chemistry, math) or difficulty levels.
- Use clear visual hierarchy with distinct sections for input controls, question display, and history.
- Clear, card-based layout to display questions and options, providing an organized and user-friendly experience.
- Subtle loading animations to enhance the user experience during question generation. There should be a grid in the background which will glow #3D94C0 when hovered over