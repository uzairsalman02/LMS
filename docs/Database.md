# Database

Core entities:
Board, Class, Subject, Chapter, Topic, Lesson, LessonBlock, InteractiveExample,
Question, QuestionOption, QuestionTag, PastPaper, PastPaperQuestion,
Test, TestQuestion, Attempt, AttemptAnswer, Bookmark, Mistake, Progress,
Achievement, UserAchievement, AIConversation, AIMessage, ContentSource.

Question metadata:
class, subject, chapter, topic, type, difficulty, marks, source, answer,
explanation, paper/year/session and publication status.

Content source:
sourceType, title, URL/reference, publisher, class, subject, year, accessedAt,
verificationStatus.

Rules:
- Stable IDs
- Timestamps
- Useful indexes
- Normalized relationships
- JSON only where flexible interactive configuration is appropriate
- PastPaperQuestion connects actual papers to reusable Question records
- Repeat detection stores confidence and admin verification

## Environment & Connection Strategy (Frozen)
- ORM: Prisma ORM.
- Development: Local MySQL instance.
- Production: MySQL-compatible cloud database.
- Connection: `DATABASE_URL` managed strictly through environment variables.
- Containerization: Docker is optional, not mandatory.

