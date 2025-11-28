"use client";
import { nanoid } from "nanoid";
import { readStorage, writeStorage } from "../lib/storage";
import type { Interview } from "../types/data";

const KEY = 'interviews';

export function listInterviewes():Interview[]{
    return readStorage(KEY, []);
}

export function listAllInterviews():Interview[]{
    return  readStorage(KEY, []);
}

export function createInterview(payload: Omit<Interview, "id">):Interview[]{
    const interviews = listInterviewes();
    let id = nanoid();
    while(interviews.find(i => i.id === id)) id = nanoid();
    const newInterview:Interview ={...payload,id};
    interviews.push(newInterview);
    writeStorage(KEY, interviews);
    return interviews;
}

export function updateInterview(id:string, patch:Partial<Interview>):Interview[]{
    const interviews = listInterviewes();
    const index = interviews.findIndex(i=> i.id === id);
    if(index === -1) throw new Error("Interview not found");
    interviews[index]= {...interviews[index], ...patch};
    writeStorage(KEY, interviews);
    return interviews;
}

export function updateInterviewByCandidate(candidateId:string, updates:Partial<Interview>){
    const interviews = listInterviewes();
    const filtered= interviews.map(i=> i.candidateId === candidateId
        ? {...i,...updates}:i
    );
    localStorage.setItem(KEY, JSON.stringify(filtered));
}

export  function deleteInterview(id:string):Interview[]{
    const interviews = listInterviewes();
    const index = interviews.findIndex(i=> i.id === id);
    if(index === -1) throw new Error("Interview not found");
    const data = interviews.filter(i => i.id !== id);
    writeStorage(KEY, data);
    return data;
}

export function listInterviewByCandidate(candidateId: string): Interview[] {
  return listInterviewes()
    .filter(i => String(i.candidateId) === String(candidateId))
    .sort((a, b) => b.date.localeCompare(a.date));
}

