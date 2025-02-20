Dacoid Quiz Application - 

This is a simple quiz application built with Next.js, TypeScript, and Tailwind CSS. It demonstrates basic quiz functionality with a clean, responsive user interface.

## Features

1. Next.js 13 with App Router: Utilizes the latest Next.js features for efficient routing and server-side rendering.

2. TypeScript Support: Entire application is written in TypeScript for improved developer experience and type safety.

3. Tailwind CSS Integration: Styled using Tailwind CSS for rapid UI development and easy customization.

4. Responsive Design: The quiz interface adapts to different screen sizes for a consistent user experience across devices.

5. Multiple Question Types:
   - Multiple-choice questions
   - Numeric input questions

6. Dynamic Quiz Flow:
   - Questions are presented one at a time
   - Automatic progression to the next question after answering
   - Final score display upon completion of the quiz

7. State Management: Uses React's useState hook for managing quiz state (current question, score, etc.)

8. UI Components: Utilizes shadcn/ui components for a polished look and feel:
   - Button
   - Card (with Header, Content, Footer, and Title)
   - RadioGroup and RadioGroupItem for multiple-choice questions
   - Input for numeric questions
   - Label for form elements

9. Accessibility: Basic accessibility features are implemented, such as proper labeling of form elements.

10. Custom Fonts: Integrates the Inter font from Google Fonts for improved typography.

11. Modular Component Structure: The quiz logic is encapsulated in a separate `Quiz` component for better code organization.

12. Client-Side Interactivity : The Quiz component is marked with "use client" for client-side rendering and interactivity.

## Project Structure

- `src/app/page.tsx`: Main page component that renders the Quiz
- `src/app/layout.tsx`: Root layout component for consistent page structure
- `src/app/globals.css`: Global styles and Tailwind directives
- `src/components/Quiz.tsx`: Core Quiz component with all the quiz logic
- `tailwind.config.js`: Tailwind CSS configuration
- `next.config.js`: Next.js configuration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

