/** @format */

import { useState, useEffect } from 'react';
import { supabase } from '../../shared/lib/supabase';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../../shared/lib/config';
import { UserPlus, Shield } from 'lucide-react';
import FrostedCard from '../../shared/components/FrostedCard';
import ZeroState from '../../shared/components/ZeroState';
import { ShimmerRow } from '../../shared/components/ShimmerLoader';
import Modal from '../../shared/components/Modal';
import CreateUserModal from './CreateUserModal';
import UserDirectory from './UserDirectory';
import type { User as UserType } from '../../shared/types';

/** UserManagementPage - User management page with add/delete functionality */
const UserManagementPage = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'member' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('users')
      .select('*')
      .order('createdat', { ascending: false });
    setUsers((data as UserType[]) ?? []);
    setLoading(false);
  };

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.password || newUser.password.length < 6) {
      setError('Username and password (min 6 chars) are required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const apiUrl = `${SUPABASE_URL}/functions/v1/manage-users`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          action: 'create',
          email: newUser.email,
          password: newUser.password,
          role: newUser.role,
        }),
      });
      const result = await res.json();
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

  const handleDeleteUser = async (userId: string) => {
    try {
      const apiUrl = `${SUPABASE_URL}/functions/v1/manage-users`;
      await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ action: 'delete', user_id: userId }),
      });
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch {
      /* deletion failed silently */
    }
    setDeleteConfirm(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">
            User Management
          </h1>
          <p className="text-[var(--text-tertiary)] mt-1 text-sm">
            Manage admin and member accounts
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-xl bg-[var(--accent-bg)] hover:bg-[var(--accent-bg-hover)] text-white font-medium text-sm transition-all shadow-lg shadow-[var(--accent-shadow)]"
        >
          <UserPlus size={16} /> <span className="hidden sm:inline">Add User</span>
        </button>
      </div>

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
        <UserDirectory users={users} onDelete={(id) => setDeleteConfirm(id)} />
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

      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete User"
        size="sm"
      >
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          Are you sure you want to delete this user? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setDeleteConfirm(null)}
            className="px-4 py-2 rounded-xl text-sm font-medium text-[var(--text-secondary)] bg-[var(--btn-ghost-bg)] hover:bg-[var(--btn-ghost-hover)] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => deleteConfirm && handleDeleteUser(deleteConfirm)}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-all"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagementPage;
