export type UserRole = 'DOC' | 'INF' | 'AMM'

export interface User {
    id: number;
    username: string;
    password?: string;
    role: UserRole;
    isActive?: boolean;
};

// Mappatura per mostrare più "leggibili" le etichette nel DB
export const UserRoleLabel: Record<UserRole, string> = {
    DOC: 'Medico',
    INF: 'Infermiere',
    AMM: 'Amministrativo'
};