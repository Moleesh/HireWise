/** @format */

import Modal from '../../shared/components/Modal';

type CreateUserModalProps = {
    open: boolean;
    newUser: { email: string; password: string; role: string };
    saving: boolean;
    error: string;
    onFieldChange: (updates: Partial<{ email: string; password: string; role: string }>) => void;
    onSubmit: () => void;
    onClose: () => void;
};

/** CreateUserModal - Add user modal form with username, password, and role fields */
const CreateUserModal = ({
    open,
    newUser,
    saving,
    error,
    onFieldChange,
    onSubmit,
    onClose,
}: CreateUserModalProps) => {
    return (
        <Modal open={open} onClose={onClose} title="Add New User">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                        Username
                    </label>
                    <input
                        type="text"
                        value={newUser.email}
                        onChange={(e) => onFieldChange({ email: e.target.value })}
                        className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)] transition-all"
                        placeholder="Enter username"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                        Password
                    </label>
                    <input
                        type="password"
                        value={newUser.password}
                        onChange={(e) => onFieldChange({ password: e.target.value })}
                        className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)] transition-all"
                        placeholder="Min 6 characters"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                        Role
                    </label>
                    <div className="select-wrap">
                        <select
                            value={newUser.role}
                            onChange={(e) => onFieldChange({ role: e.target.value })}
                            className="app-select h-11 w-full"
                        >
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">
                        {error}
                    </div>
                )}
                <div className="flex justify-end gap-3 pt-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-sm font-medium text-[var(--text-secondary)] bg-[var(--btn-ghost-bg)] hover:bg-[var(--btn-ghost-hover)] transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        disabled={saving}
                        className="px-4 py-2 rounded-xl text-sm font-medium bg-[var(--accent-bg)] hover:bg-[var(--accent-bg-hover)] text-white transition-all disabled:opacity-50"
                    >
                        {saving ? 'Creating...' : 'Create User'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default CreateUserModal;
