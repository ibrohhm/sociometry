CREATE TABLE IF NOT EXISTS nominations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER NOT NULL,
  question_id INTEGER NOT NULL,
  nominee_id INTEGER NOT NULL,
  FOREIGN KEY (member_id) REFERENCES members(id),
  FOREIGN KEY (question_id) REFERENCES questions(id),
  FOREIGN KEY (nominee_id) REFERENCES members(id)
);
