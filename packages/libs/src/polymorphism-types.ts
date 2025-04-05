import { GetTodayRes, ProofMethodElem } from "./injunghaseyo-api";

interface PhotoProofElem {
  id: number;
  url: string;
}

interface ButtonClickProofElem {
  id: number;
}

interface LocationProofElem {
  id: number;
  latitude: number;
  longitude: number;
}

interface Proof {
  proofMethod: ProofMethodElem;
  groupProgressId: number;
  proofElem: PhotoProofElem | ButtonClickProofElem | LocationProofElem | null;
}

export interface ModifiedGetTodayRes extends Omit<GetTodayRes, "proofs"> {
  proofs: Proof[];
}
