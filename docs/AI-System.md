# AI System

AI is a tutor/feedback layer, not the source of truth.

Capabilities:
- Explain simply
- Explain in Urdu
- Step-by-step
- Give an example
- Explain why an answer is correct
- Generate a similar question
- Quiz the student
- Give typed-answer feedback

Grounding context:
class + subject + chapter + topic + approved lesson content + question +
reference answer/solution when available.

Security:
- server-side API calls
- no exposed keys
- rate limiting
- input/request-size limits
- prompt-injection resistance
- no private admin data in student prompts
- usage logging
- safe caching where appropriate

Answer feedback must clearly state that it is approximate and is not official board marking.
