export const getSessionId = () => {
  if (typeof window === "undefined") return "server-session";
  let sessionId = localStorage.getItem("lumiere_session_id");
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("lumiere_session_id", sessionId);
  }
  return sessionId;
};
