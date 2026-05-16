export const routeConfig = {
    stream: '/stream/{-$streamId}',
    register: '/register',
    profile: '/profile',
    note: '/note/{-$noteId}',
    login: '/login',
    chat: '/chat/{-$streamId}',
} as const;