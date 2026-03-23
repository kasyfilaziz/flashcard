# Brain Workout Platform: Future App Pipeline

This document serves as a technical and functional specification for potential new "Brain Workout" modules. Each idea is designed to align with the project's **Constitution**: Local-first (IndexedDB), Svelte 4, Tailwind CSS, and mobile-first responsiveness.

---

## 1. Executive Function & Attention

### Stroop Test (Inhibitory Control)
- **Concept:** Measures the delay in reaction time between congruent and incongruent stimuli.
- **Gameplay:**
    - Display a color word (e.g., "RED", "BLUE", "GREEN").
    - The *font color* of the word may or may not match the word itself.
    - User must tap a button corresponding to the **font color**, ignoring the text content.
- **Metrics:** Reaction time (ms) and accuracy.
- **LLM Implementation Note:** Use a `congruent: boolean` flag in the state to track performance differences. Store results in `stroop_scores` indexed by `timestamp`.

### Schulte Table (Peripheral Vision & Focus)
- **Concept:** A grid of numbers (standard is 5x5) that the user must find in ascending order.
- **Gameplay:**
    - Generate a 5x5 grid with randomized numbers 1–25.
    - User taps 1, then 2, then 3, etc.
    - The timer starts on the first tap and ends on the last.
- **Metrics:** Total completion time.
- **LLM Implementation Note:** Use CSS Grid for the layout. Animate "correct" taps with a brief green flash and "incorrect" taps with a haptic shake.

### Toggle Task (Cognitive Flexibility)
- **Concept:** Trains the brain to switch between different rule sets rapidly.
- **Gameplay:**
    - Screen is split into top and bottom halves.
    - If a number/letter pair appears in the TOP: "Is the number EVEN or ODD?"
    - If it appears in the BOTTOM: "Is the letter a VOWEL or CONSONANT?"
- **Metrics:** "Switch cost" (additional time taken when the task type changes between trials).
- **LLM Implementation Note:** State should track `previousTaskType` vs `currentTaskType` to calculate switch cost statistics.

---

## 2. Advanced Working Memory

### Dual N-Back (Fluid Intelligence)
- **Concept:** The gold standard for working memory training.
- **Gameplay:**
    - A 3x3 grid shows a square in a random position while a letter is spoken (or shown).
    - User must press "Position Match" if the current square is in the same place as it was $N$ steps ago.
    - User must press "Audio/Letter Match" if the current letter matches $N$ steps ago.
    - $N$ increases as the user gets better (starting at $N=2$).
- **Metrics:** Accuracy percentage at specific $N$ levels.
- **LLM Implementation Note:** Requires a sliding window array of size $N+1$ to store the history of stimuli.

### Reverse Span (Working Memory Manipulation)
- **Concept:** A variation of the existing `sequence-recall` that requires mental manipulation of information.
- **Gameplay:**
    - App displays a sequence (digits, colors, or positions).
    - User must input the sequence in **reverse order**.
- **LLM Implementation Note:** Reuse `sequence-recall` logic but validate input against `sequence.reverse()`.

---

## 3. Language & Logic

### Anagram Solver (Vocabulary & Search)
- **Concept:** Finding hidden patterns in scrambled letters.
- **Gameplay:**
    - Provide a set of 5–8 letters.
    - User must find all possible words (3+ letters) that can be formed.
- **LLM Implementation Note:** Can use a local dictionary JSON or pre-calculated word lists. Integrate with `word_scramble` data structures.

### Syllogism Trainer (Deductive Reasoning)
- **Concept:** Formal logic training.
- **Gameplay:**
    - Present two premises: "All roses are flowers," "Some flowers fade quickly."
    - Present a conclusion: "Therefore, some roses fade quickly."
    - User selects: "Valid" or "Invalid".
- **LLM Implementation Note:** Requires a template-based logic generator to ensure variety while maintaining logical soundess.

---

## 4. Visual-Spatial Training

### Rotation Match (Mental Rotation)
- **Concept:** Training the ability to mentally rotate 2D/3D objects.
- **Gameplay:**
    - Show two abstract 2D shapes.
    - User determines if the second shape is a rotated version of the first or a mirrored/different shape.
- **LLM Implementation Note:** SVG-based shapes are preferred for lightweight rendering and easy rotation (CSS `transform: rotate()`).

### Pathfinder (Spatial Memory)
- **Concept:** Recalling spatial routes.
- **Gameplay:**
    - A grid is shown. A "path" flashes through several cells sequentially.
    - User must tap the cells in the exact same path.
- **LLM Implementation Note:** Similar to `sequence-recall` but uses a 2D coordinate system.

---

## 5. Numerical Reasoning

### Estimation Sprint (Approximate Number System)
- **Concept:** Training the ability to approximate large calculations quickly.
- **Gameplay:**
    - Show a problem like `412 * 19`.
    - Provide choices: `~4,000`, `~8,000`, `~12,000`.
    - User has 3 seconds per problem.
- **LLM Implementation Note:** Focus on magnitude recognition rather than exact arithmetic.

### Number Sequence (Inductive Reasoning)
- **Concept:** Recognizing patterns in series.
- **Gameplay:**
    - Show a sequence: `2, 6, 12, 20, 30, ?`
    - User must identify the rule (in this case, $x^2 + x$) and provide the next number (`42`).
- **LLM Implementation Note:** Store pattern types (linear, quadratic, Fibonacci-style) to categorize difficulty.

---

## Technical Integration Strategy for Future LLMs

1. **Database:** Always check `src/lib/utils/db.js` for existing store patterns. Create a new prefix in `APP_PREFIXES`.
2. **App Entry:** Create `src/apps/[app-id]/index.js` and export the app definition including `componentLoader`.
3. **State Management:** Use Svelte stores for game state. Persist only meaningful results (scores, settings) to IndexedDB.
4. **Haptics:** Use the shared utility for vibration feedback on user errors or successes.
