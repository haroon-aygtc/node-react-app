import * as chatRepo from '../repositories/chatRepository';
export async function startSession(userId, contextRuleId) {
    return chatRepo.createSession({ userId, contextRuleId });
}
export async function getSessionById(id) {
    return chatRepo.getSessionById(id);
}
export async function getUserSessions(userId) {
    return chatRepo.getUserSessions(userId);
}
export async function addMessage(data) {
    if (!data.content.trim())
        throw new Error('Message content is required');
    return chatRepo.createMessage(data);
}
export async function getMessagesBySession(sessionId) {
    return chatRepo.getMessagesBySession(sessionId);
}
