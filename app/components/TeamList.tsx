"use client";

import { useState, useEffect } from "react";
import Card from "./Card";
import Button from "./Button";
import RemovableList from "./RemovableList";
import Input from "./Input";

type Team = {
  id: string;
  name: string;
  members: string[];
  pin: string;
};

export default function TeamList() {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    fetch("/api/teams")
      .then((res) => res.json())
      .then((data: Team[]) => setTeams(data));
  }, []);
  const [showModal, setShowModal] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [memberInput, setMemberInput] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [memberError, setMemberError] = useState("");

  function handleAddMember() {
    const trimmed = memberInput.trim();
    if (!trimmed) return;
    if (members.some((m) => m.toLowerCase() === trimmed.toLowerCase())) {
      setMemberError(`"${trimmed}" is already added.`);
      return;
    }
    setMembers((prev) => [...prev, trimmed]);
    setMemberInput("");
    setMemberError("");
  }

  function handleRemoveMember(index: number) {
    setMembers((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit() {
    if (!teamName.trim() || members.length === 0) return;
    setTeams((prev) => [...prev, {
      id: crypto.randomUUID(),
      name: teamName.trim(),
      members,
      pin: Math.floor(1000 + Math.random() * 9000).toString(),
    }]);
    setTeamName("");
    setMembers([]);
    setMemberInput("");
    setShowModal(false);
  }

  function handleClose() {
    setShowModal(false);
    setTeamName("");
    setMembers([]);
    setMemberInput("");
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {teams.map((team) => (
          <div
            key={team.name}
            className="cursor-pointer transition-transform duration-200 hover:scale-105"
          >
            <Card title={team.name}>
              <ul className="flex flex-col gap-2">
                {team.members.map((member) => (
                  <li
                    key={member}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#0ea5e9] shrink-0" />
                    {member}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        ))}

        <button
          onClick={() => setShowModal(true)}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-white/40 bg-transparent text-white/60 flex flex-col items-center justify-center gap-2 min-h-36 hover:border-white/70 hover:text-white/90 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <span className="text-3xl font-light leading-none">+</span>
          <span className="text-sm font-semibold">Add Team</span>
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4">
            <h2 className="text-[#0369a1] font-bold text-lg">Add New Team</h2>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Team Name
              </label>
              <Input
                value={teamName}
                onChange={setTeamName}
                placeholder="e.g. Team Delta"
                className="w-full"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Members
              </label>
              <div className="flex gap-2">
                <Input
                  value={memberInput}
                  onChange={(v) => { setMemberInput(v); setMemberError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleAddMember()}
                  placeholder="Member name"
                  className="flex-1"
                />
                <div className="w-24 shrink-0">
                  <Button onClick={handleAddMember}>Add</Button>
                </div>
              </div>
              {memberError && (
                <p className="text-xs text-red-500 mt-1">{memberError}</p>
              )}

              <RemovableList items={members} onRemove={handleRemoveMember} />
            </div>

            <div className="flex gap-3 mt-2">
              <Button variant="secondary" onClick={handleClose}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={!teamName.trim() || members.length === 0}>Save Team</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
