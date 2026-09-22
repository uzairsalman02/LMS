# Interactive Engine

Interactive content is teaching functionality, not decoration.

Reusable components:
- Binary converter
- Decimal/Binary/Hex converter
- Place-value visualizer
- Logic gate simulator
- Truth-table generator
- Algorithm visualizer
- Flowchart visualizer
- Code example/code visualization

Architecture:
DB stores interactive type + validated configuration.
Reusable React component owns interaction logic.
Lesson builder selects the component and configuration.
Do not create a custom one-off component for every lesson when a reusable component is possible.

Requirements:
- responsive
- accessible controls
- keyboard support where practical
- reduced-motion fallback
- lightweight loading
- clear explanation alongside interaction
