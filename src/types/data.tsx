export type Role = "admin" | "panelist" | "ta_member";

export type status = "scheduled" | "completed" | "cancelled";

export interface User {
  id: number | string;
  username: string;
  email?: string;
  image?: string;
  role: Role;
}

export type Candidate = {
    status: string;
    id:number;
    firstName:string;
    lastName:string;
    email?:string;
    department?:string;
    designation?:string;
    candidateStatus?: status;
}

export type Interview ={
    id:string;
    candidateId:string;
    interviewerId: string;
    date:string;
    status:status;
    notes?:string;
}

export type Interviewer = {
    id:string;
    name:string;
    email:string;
    role:Role;
}

export type Feedback ={
    id:string;
    candidateId:string;
    authorRole?:string;
    score:number;
    strengths:string;
    improvements:string;
    createdAt:string;
}

