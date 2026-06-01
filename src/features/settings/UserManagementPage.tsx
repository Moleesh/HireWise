/** @format */

import { useState, useEffect } from 'react';
import { supabase } from '../../shared/lib/supabase';
import { UserPlus, Shield } from 'lucide-react';
import FrostedCard from '../../shared/components/FrostedCard';
import PageHero from '../../shared/components/PageHero';
import ThemeSwitcher from '../../shared/components/ThemeSwitcher';
import ZeroState from '../../shared/components/ZeroState';
import { ShimmerRow } from '../../shared/components/ShimmerLoader';
import CreateUserModal from './CreateUserModal';
import DeleteUserModal from './DeleteUserModal';
import ResetPasswordModal from './ResetPasswordModal';
import UserDirectory from './UserDirectory';
import type { User as UserType } from '../../shared/types';
import {
	postUserAction,
	toAuthEmail,
	validateCredentials,
	validatePassword,
} from './_private/userAccess';

/** UserManagementPage - User management page with add/delete functionality */
const UserManagementPage = () => {
	const [users, setUsers] = useState<UserType[]>([]);
	const [loading, setLoading] = useState(true);
	const [showAddModal, setShowAddModal] = useState(false);
	const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
	const [passwordUser, setPasswordUser] = useState<UserType | null>(null);
	const [resetPassword, setResetPassword] = useState('');
	const [newUser, setNewUser] = useState({ email: '', password: '', role: 'member' });
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');

	const loadUsers = async () => {
		setLoading(true);
		const { data } = await supabase
			.from('users')
			.select('*')
			.order('createdAt', { ascending: false });
		setUsers((data as UserType[]) ?? []);
		setLoading(false);
	};

	useEffect(() => {
		// Defer to avoid triggering react-hooks/set-state-in-effect (ESLint 10+ rule).
		void Promise.resolve().then(loadUsers);
	}, []);

	const handleAddUser = async () => {
		const validation = validateCredentials(newUser.email, newUser.password);
		if (validation) {
			setError(validation);
			return;
		}
		setSaving(true);
		setError('');
		try {
			const result = await postUserAction({
				action: 'create',
				email: toAuthEmail(newUser.email),
				password: newUser.password,
				role: newUser.role,
			});
			if (result.error) {
				setError(result.error);
			} else {
				setShowAddModal(false);
				setNewUser({ email: '', password: '', role: 'member' });
				loadUsers();
			}
		} catch {
			setError('Failed to create user');
		}
		setSaving(false);
	};

	const handleResetPassword = async () => {
		if (!passwordUser) return;
		const validation = validatePassword(resetPassword);
		if (validation) {
			setError(validation);
			return;
		}
		setSaving(true);
		setError('');
		try {
			const result = await postUserAction({
				action: 'reset-password',
				user_id: passwordUser.id,
				password: resetPassword,
			});
			if (result.error) setError(result.error);
			else {
				setPasswordUser(null);
				setResetPassword('');
			}
		} catch {
			setError('Failed to update password');
		}
		setSaving(false);
	};

	const handleDeleteUser = async (userId: string) => {
		try {
			await postUserAction({ action: 'delete', user_id: userId });
			setUsers((prev) => prev.filter((u) => u.id !== userId));
		} catch {
			/* deletion failed silently */
		}
		setDeleteConfirm(null);
	};

	return (
		<div className="max-w-7xl mx-auto">
			<PageHero
				eyebrow="Access Control"
				title="User Management"
				description="Manage admin and member accounts with secure role-based access."
				action={
					<div className="flex items-center gap-2">
						<ThemeSwitcher showLabel={false} />
						<button
							onClick={() => setShowAddModal(true)}
							className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--accent-bg)] hover:bg-[var(--accent-bg-hover)] text-white font-medium text-xs md:text-sm whitespace-nowrap transition-all shadow-md shadow-[var(--accent-shadow)]"
						>
							<UserPlus size={14} />
							<span className="md:hidden">Add</span>
							<span className="hidden md:inline">Add User</span>
						</button>
					</div>
				}
			/>

			{loading ? (
				<FrostedCard className="p-6" hover={false}>
					<ShimmerRow rows={3} />
				</FrostedCard>
			) : users.length === 0 ? (
				<ZeroState
					icon={Shield}
					title="No users found"
					description="Add users to manage access to HireWise"
					action={
						<button
							onClick={() => setShowAddModal(true)}
							className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent-bg)] hover:bg-[var(--accent-bg-hover)] text-white font-medium text-sm transition-all"
						>
							<UserPlus size={16} /> Add User
						</button>
					}
				/>
			) : (
				<UserDirectory
					users={users}
					onDelete={(id) => setDeleteConfirm(id)}
					onResetPassword={(user) => {
						setPasswordUser(user);
						setError('');
					}}
				/>
			)}

			<CreateUserModal
				open={showAddModal}
				newUser={newUser}
				saving={saving}
				error={error}
				onFieldChange={(updates) => setNewUser((prev) => ({ ...prev, ...updates }))}
				onSubmit={handleAddUser}
				onClose={() => {
					setShowAddModal(false);
					setError('');
				}}
			/>

			<ResetPasswordModal
				open={Boolean(passwordUser)}
				user={passwordUser}
				password={resetPassword}
				saving={saving}
				error={error}
				onPasswordChange={setResetPassword}
				onSubmit={handleResetPassword}
				onClose={() => {
					setPasswordUser(null);
					setResetPassword('');
					setError('');
				}}
			/>

			<DeleteUserModal
				open={!!deleteConfirm}
				onClose={() => setDeleteConfirm(null)}
				onConfirm={() => deleteConfirm && handleDeleteUser(deleteConfirm)}
			/>
		</div>
	);
};

export default UserManagementPage;
