import {nanoid} from "nanoid";
import { readStorage, writeStorage } from "../lib/storage";
import type { Feedback } from "../types/data";

const KEY = 'feedback';

export default function listFeedback():Feedback[]{
    return readStorage(KEY,[]);
}

export function createFeedback(payload: Omit<Feedback, "id" | "createdAt">){
    const feedbacks = listFeedback();
    const newFeedback:Feedback ={ id:nanoid(),createdAt: new Date().toISOString(),...payload};
    feedbacks.push(newFeedback);
    writeStorage(KEY, feedbacks);
    return newFeedback;
}

export function updateFeedback(id:string, patch:Partial<Feedback>){
    const feedbacks = listFeedback();
    const index = feedbacks.findIndex(f=> f.id === id);
    if(index === -1) throw new Error("feedback not found");
    feedbacks[index]={...feedbacks[index], ...patch};
    writeStorage(KEY, feedbacks);
    return feedbacks[index];
}

export function deleteFeedback(id:string){
    const feedbacks = listFeedback();
    const index = feedbacks.findIndex(f=> f.id === id);
    if(index === -1) throw new Error("feedback not found");
    const data= feedbacks.filter(f=> f.id !== id);
    writeStorage(KEY, data);
    return data;
}

export function listFeedbackByCandidate(candidateId:string){
    return listFeedback().filter(f=> f.candidateId === candidateId);
}