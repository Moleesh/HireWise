/** @format */

import { type ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

type ModalProps = {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg';
};

/** Modal - Dialog with backdrop blur, scrollable content, and responsive sizing. */
const Modal = ({ open, onClose, title, children, size = 'md' }: ModalProps) => {
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    if (!open) return null;

    const sizeClass = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' }[size];

    return (
        <div className="fixed inset-0 z-50">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />
            <div className="absolute inset-0 md:left-64 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
                <div
                    className={`relative w-full ${sizeClass} bg-[var(--modal-bg)] backdrop-blur-xl border border-[var(--modal-border)] rounded-2xl shadow-2xl animate-scale-in my-4 sm:my-0`}
                >
                    <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[var(--border-subtle)]">
                        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            aria-label="Close"
                            className="p-2 rounded-xl text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)] transition-all"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
