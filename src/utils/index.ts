export const getUsername = (): string => {
    return 'user-' + Math.random().toString(36).substring(2);
};
