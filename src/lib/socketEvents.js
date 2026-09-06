/**
 * Socket event names. Mirrors pace_app_backend_v1/realtime/events.js —
 * change both together.
 */

export const SERVER_EVENTS = {
  CHALLENGE_INVITED: "challenge:invited",
  CHALLENGE_ACCEPTED: "challenge:accepted",
  CHALLENGE_DECLINED: "challenge:declined",
  CHALLENGE_EXPIRED: "challenge:expired",
  CHALLENGE_CLAIMED: "challenge:claimed",
  CHALLENGE_CANCELLED: "challenge:cancelled",

  LOBBY_UPDATED: "lobby:updated",

  DUEL_MATCHED: "duel:matched",
  DUEL_COUNTDOWN: "duel:countdown",
  DUEL_ROUND: "duel:round",
  DUEL_OPPONENT_ANSWERED: "duel:opponentAnswered",
  DUEL_ROUND_RESULT: "duel:roundResult",
  DUEL_OPPONENT_STATE: "duel:opponentState",
  DUEL_EMOTE: "duel:emote",
  DUEL_COMPLETED: "duel:completed",

  QUEUE_STATUS: "queue:status",
  QUEUE_ASYNC_OFFER: "queue:asyncOffer",

  NOTIFICATION_NEW: "notification:new",

  PRESENCE_CHANGED: "presence:changed",
};

export const CLIENT_EVENTS = {
  DUEL_READY: "duel:ready",
  DUEL_ANSWER: "duel:answer",
  DUEL_EMOTE: "duel:emote",
  DUEL_LEAVE: "duel:leave",
  DUEL_SUBSCRIBE: "duel:subscribe",
  LOBBY_SUBSCRIBE: "lobby:subscribe",
  LOBBY_UNSUBSCRIBE: "lobby:unsubscribe",
  PRESENCE_HEARTBEAT: "presence:heartbeat",
};
