export type ReportStatus = "OPEN" | "CLOSED";

export interface Report {
  id: number;
  title: string;
  message: string;
  status: ReportStatus;
  createdAt: string;
}
