"use client";
import { nanoid } from "nanoid";
import { readStorage, writeStorage } from "../lib/storage";
import { Candidate } from "../types/data";
const KEY = 'candidates';

export function listCandidates(): Candidate[] {
    return readStorage(KEY, []);
}

export function getCandidate(id:string):Candidate | undefined {
    const candidates = listCandidates();
    return candidates.find(c=> c.id === parseInt(id));
}

export function createCandidate(data: Omit<Candidate, "id">):Candidate {
    const candidates = listCandidates();
    const newCandidate:Candidate ={...data, id: parseInt(nanoid(), 10) || Date.now()}
    candidates.push(newCandidate);
    writeStorage(KEY, candidates);
    return newCandidate;
}

export function updateCandidate(id:string, patch:Partial<Candidate>){
    const candidates = listCandidates();
    const index = candidates.findIndex(c=> c.id === parseInt(id));
    if(index === -1) throw new Error("Candidate not found");
    candidates[index] = {...candidates[index], ...patch};
    writeStorage(KEY, candidates);
    return candidates[index];
}

export function deleteCandidate(id:string){
    const candidates = listCandidates();
    const index = candidates.findIndex(c=> c.id === parseInt(id));
    if(index === -1) throw new Error("Candidate not found");
    const items = candidates.filter(c=> c.id !== parseInt(id));
    writeStorage(KEY, items);
    return true;
}

