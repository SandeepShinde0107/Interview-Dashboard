import { nanoid } from "nanoid";
import { readStorage, writeStorage } from "../lib/storage";
import { Interviewer } from "../types/data";
export type { Interviewer} from "../types/data";

const KEY = "interviewers";

export type UserRole = { id: string | number; name: string; role: string };

export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "panelist" | "ta_member";
};


export function listInterviewers(): Interviewer[] {
    return readStorage(KEY, []);
}

export function createInterviewer(payload: Omit<Interviewer, "id">){
    const interviewers = listInterviewers();
    let id = nanoid();
    while(interviewers.find(i=> i.id ===id))id = nanoid();
    const newInterviewer:Interviewer = {...payload, id};
    interviewers.push(newInterviewer);
    writeStorage(KEY, interviewers);
    return interviewers;
}

export function updateInterviewer(id:string, patch:Partial<Interviewer>){
    const interviewers = listInterviewers();
    const index = interviewers.findIndex((iv)=> iv.id === id);
    if(index === -1) throw new Error("Interview not found");
    interviewers[index] = {...interviewers[index], ...patch};
    writeStorage(KEY, interviewers);
    return interviewers;
}

export function deleteInterviewer(id:string){
    const interviewers = listInterviewers();
    const index = interviewers.findIndex((iv)=> iv.id === id);
    if(index === -1) throw new Error("Interview not found");
    const filteredData = interviewers.filter(i=> i.id !== id);
    writeStorage(KEY, filteredData);
    return filteredData;
}

