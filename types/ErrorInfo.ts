export interface ErrorInfo {
  what: string; // what function failed
  who: string; // class/module
  when: string; // process description
  where: string; // line number/stack trace
  why: string; // error code/message
}