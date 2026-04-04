CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  valence TEXT NOT NULL DEFAULT 'positive' CHECK (valence IN ('positive', 'negative'))
);
