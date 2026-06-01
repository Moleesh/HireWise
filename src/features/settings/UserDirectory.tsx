/** @format */

import { KeyRound, Trash2, Shield, User, Clock } from 'lucide-react';
import FrostedCard from '../../shared/components/FrostedCard';
import type { User as UserType } from '../../shared/types';
import { formatDate } from './_private/helpers';
import { displayUsername } from './_private/userAccess';

type UserDirectoryProps = {
    users: UserType[];
    onDelete: (id: string) => void;
    onResetPassword: (user: UserType) => void;
};

/** UserDirectory - User table (desktop) and card list (mobile) display */
const UserDirectory = ({ users, onDelete, onResetPassword }: UserDirectoryProps) => {
    return (
        <div className="space-y-3 md:space-y-0">
            <div className="lg:hidden space-y-3">
                {users.map((user) => (
                    <FrostedCard key={user.id} className="p-4" hover={false}>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-[var(--accent-bg-subtle)] border border-[var(--accent-border)] flex items-center justify-center text-xs font-semibold text-[var(--accent-text)]">
                                    {user.email?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[var(--text-primary)]">
                                        {displayUsername(user.email)}
                                    </p>
                                    <span
                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium ${
                                            user.role === 'admin'
                                                ? 'bg-[var(--accent-bg-subtle)] text-[var(--accent-text)] border border-[var(--accent-border)]'
                                                : 'bg-[var(--btn-ghost-bg)] text-[var(--text-tertiary)]'
                                        }`}
                                    >
                                        <Shield size={8} />
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => onResetPassword(user)}
                                    className="p-2 rounded-lg text-[var(--text-quaternary)] hover:text-[var(--accent-text)] hover:bg-[var(--btn-ghost-hover)] transition-all"
                                >
                                    <KeyRound size={14} />
                                </button>
                                <button
                                    onClick={() => onDelete(user.id)}
                                    className="p-2 rounded-lg text-[var(--text-quaternary)] hover:text-red-400 hover:bg-red-500/10 transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-[var(--text-quaternary)]">
                            <span className="flex items-center gap-1">
                                <Clock size={10} /> Created {formatDate(user.createdAt)}
                            </span>
                            <span>Last sign in {formatDate(user.lastSignInAt)}</span>
                        </div>
                    </FrostedCard>
                ))}
            </div>

            <FrostedCard className="overflow-hidden hidden lg:block" hover={false}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[var(--border-subtle)]">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--text-quaternary)] uppercase tracking-wider">
                                    Username
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--text-quaternary)] uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--text-quaternary)] uppercase tracking-wider">
                                    Created
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--text-quaternary)] uppercase tracking-wider">
                                    Last Sign In
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-[var(--text-quaternary)] uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--btn-ghost-hover)] transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[var(--accent-bg-subtle)] border border-[var(--accent-border)] flex items-center justify-center text-xs font-semibold text-[var(--accent-text)]">
                                                {user.email?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <User
                                                    size={12}
                                                    className="text-[var(--text-quaternary)]"
                                                />
                                                <span className="text-sm text-[var(--text-primary)]">
                                                    {displayUsername(user.email)}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                                                user.role === 'admin'
                                                    ? 'bg-[var(--accent-bg-subtle)] text-[var(--accent-text)] border border-[var(--accent-border)]'
                                                    : 'bg-[var(--btn-ghost-bg)] text-[var(--text-tertiary)]'
                                            }`}
                                        >
                                            <Shield size={10} />
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-[var(--text-tertiary)] flex items-center gap-1.5">
                                            <Clock
                                                size={12}
                                                className="text-[var(--text-quaternary)]"
                                            />
                                            {formatDate(user.createdAt)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-[var(--text-tertiary)]">
                                            {formatDate(user.lastSignInAt)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => onResetPassword(user)}
                                            className="p-2 rounded-lg text-[var(--text-quaternary)] hover:text-[var(--accent-text)] hover:bg-[var(--btn-ghost-hover)] transition-all"
                                        >
                                            <KeyRound size={14} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(user.id)}
                                            className="p-2 rounded-lg text-[var(--text-quaternary)] hover:text-red-400 hover:bg-red-500/10 transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </FrostedCard>
        </div>
    );
};

export default UserDirectory;
