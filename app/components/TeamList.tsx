"use client";

import { useState } from "react";
import Card from "./Card";
import Button from "./Button";
import RemovableList from "./RemovableList";
import Input from "./Input";
import Label from "./Label";
import ErrorText from "./ErrorText";
import type { Team } from "../types/team";
import LoadingOverlay from "./LoadingOverlay";

export default function TeamList({ initialTeams = [], facilitatorId }: { readonly initialTeams?: Team[], readonly facilitatorId: number }) {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [showModal, setShowModal] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [memberInput, setMemberInput] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [memberError, setMemberError] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

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

  async function handleSubmit() {
    if (!teamName.trim() || members.length === 0 || !pin.trim()) return;

    setLoading(true);
    setSubmitError("");
    const res = await fetch("/api/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: teamName.trim(),
        pin: pin.trim(),
        facilitator_id: facilitatorId,
        members: members.map((name) => ({ name, submitted: false })),
      }),
    });
    setLoading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setSubmitError(body?.error ?? "something went wrong");
      return;
    }

    const newTeam: Team = await res.json();
    setTeams((prev) => [...prev, newTeam]);
    setTeamName("");
    setMembers([]);
    setMemberInput("");
    setPin("");
    setShowModal(false);
  }

  function handleEdit(team: Team) {
    setEditingTeam(team);
    setTeamName(team.name);
    setPin(String(team.pin));
    setMembers(team.members.map((m) => m.name));
    setShowModal(true);
  }

  function handleClose() {
    setShowModal(false);
    setEditingTeam(null);
    setTeamName("");
    setMembers([]);
    setMemberInput("");
    setPin("");
    setSubmitError("");
  }

  async function handleUpdate() {
    if (!teamName.trim() || members.length === 0 || !pin.trim() || !editingTeam) return;

    setLoading(true);
    setSubmitError("");
    const res = await fetch(`/api/teams/${editingTeam.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: teamName.trim(),
        pin: pin.trim(),
        members: members.map((name) => ({ name, submitted: editingTeam.members.find((m) => m.name === name)?.submitted ?? false })),
      }),
    });
    setLoading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setSubmitError(body?.error ?? "something went wrong");
      return;
    }

    const updated: Team = await res.json();
    setTeams((prev) => prev.map((t) => t.id === updated.id ? updated : t));
    handleClose();
  }

  return (
    <>
      <LoadingOverlay loading={loading} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {teams.map((team) => (
          <button
            key={team.name}
            type="button"
            onClick={() => handleEdit(team)}
            className="text-left w-full cursor-pointer transition-transform duration-200 hover:scale-105"
          >
            <Card title={team.name} subtitle={`PIN: ${team.pin}`}>
              <ul className="flex flex-col gap-2">
                {team.members.map((member) => (
                  <li
                    key={member.name}
                    className="flex items-center justify-between gap-2 text-sm text-gray-700"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#0ea5e9] shrink-0" />
                      {member.name}
                    </span>
                    {member.submitted && (
                      <span className="text-[0.65rem] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md bg-green-100 text-green-600">
                        Submitted
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </Card>
          </button>
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
            <h2 className="text-[#0369a1] font-bold text-lg">{editingTeam ? "Edit Team" : "Add New Team"}</h2>

            <div className="flex flex-col gap-1">
              <Label htmlFor="team-name">Team Name</Label>
              <Input
                id="team-name"
                value={teamName}
                onChange={setTeamName}
                placeholder="e.g. Team Delta"
                className="w-full"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="team-pin">PIN</Label>
              <Input
                id="team-pin"
                value={pin}
                onChange={(v) => setPin(v.replaceAll(/\D/g, ""))}
                placeholder="e.g. 1234"
                inputMode="numeric"
                maxLength={4}
                className="w-full"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="team-member">Members</Label>
              <div className="flex gap-2">
                <Input
                  id="team-member"
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
              <ErrorText show={!!memberError} className="text-xs mt-1">{memberError}</ErrorText>
              <RemovableList items={members} onRemove={handleRemoveMember} />
            </div>

            <ErrorText show={!!submitError} className="text-center">{submitError}</ErrorText>
            <div className="flex gap-3 mt-2">
              <Button variant="secondary" onClick={handleClose}>Cancel</Button>
              <Button onClick={editingTeam ? handleUpdate : handleSubmit} disabled={!teamName.trim() || members.length === 0}>{editingTeam ? "Update Team" : "Save Team"}</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
